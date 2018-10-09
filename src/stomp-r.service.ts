import {filter, first, share} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Observer, Subject, Subscription} from 'rxjs';

import {StompConfig} from './stomp.config';

import {Client, Frame, Message, Stomp, StompHeaders, StompSubscription} from '@stomp/stompjs';
import {StompState} from './stomp-state';

/**
 * Angular2 STOMP Raw Service using @stomp/stomp.js
 *
 * You will only need the public properties and
 * methods listed unless you are an advanced user. This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 *
 * If you will like to pass the configuration as a dependency,
 * please use StompService class.
 */
@Injectable()
export class StompRService {
  /**
   * State of the STOMPService
   *
   * It is a BehaviorSubject and will emit current status immediately. This will typically get
   * used to show current status to the end user.
   */
  public state: BehaviorSubject<StompState>;

  /**
   * Will trigger when connection is established. Use this to carry out initialization.
   * It will trigger every time a (re)connection occurs. If it is already connected
   * it will trigger immediately. You can safely ignore the value, as it will always be
   * StompState.CONNECTED
   */
  public connectObservable: Observable<StompState>;

  /**
   * Provides headers from most recent connection to the server as return by the CONNECTED
   * frame.
   * If the STOMP connection has already been established it will trigger immediately.
   * It will additionally trigger in event of reconnection, the value will be set of headers from
   * the recent server response.
   */
  public serverHeadersObservable: Observable<StompHeaders>;

  private _serverHeadersBehaviourSubject: BehaviorSubject<null | StompHeaders>;

  /**
   * Will emit all messages to the default queue (any message that are not handled by a subscription)
   */
  public defaultMessagesObservable: Subject<Message>;

  /**
   * Will emit all receipts
   */
  public receiptsObservable: Subject<Frame>;

  /**
   * Will trigger when an error occurs. This Subject can be used to handle errors from
   * the stomp broker.
   */
  public stompError$: Subject<Frame>;

  /**
   * Internal array to hold locally queued messages when STOMP broker is not connected.
   */
  protected queuedMessages: { queueName: string, message: string, headers: StompHeaders }[] = [];

  /**
   * Configuration
   */
  private _config: StompConfig;

  /**
   * STOMP Client from @stomp/stomp.js
   */
  protected client: Client;

  /**
   * Constructor
   *
   * See README and samples for configuration examples
   */
  public constructor() {
    this.state = new BehaviorSubject<StompState>(StompState.CLOSED);

    this.connectObservable = this.state.pipe(
      filter((currentState: StompState) => {
        return currentState === StompState.CONNECTED;
      })
    );

    // Setup sending queuedMessages
    this.connectObservable.subscribe(() => {
      this.sendQueuedMessages();
    });

    this._serverHeadersBehaviourSubject = new BehaviorSubject<null | StompHeaders>(null);

    this.serverHeadersObservable = this._serverHeadersBehaviourSubject.pipe(
      filter((headers: null | StompHeaders) => {
        return headers !== null;
      })
    );

    this.stompError$ = new Subject();
  }

  /** Set configuration */
  set config(value: StompConfig) {
    this._config = value;
  }

  /** It will initialize STOMP Client. */
  protected initStompClient(): void {
    // disconnect if connected
    this.disconnect();

    // url takes precedence over socketFn
    if (typeof(this._config.url) === 'string') {
      this.client = Stomp.client(this._config.url);
    } else {
      this.client = Stomp.over(this._config.url);
    }

    // Configure client heart-beating
    this.client.heartbeatIncoming = this._config.heartbeat_in;
    this.client.heartbeatOutgoing = this._config.heartbeat_out;

    // Auto reconnect
    this.client.reconnectDelay = this._config.reconnect_delay;

    if (!this._config.debug) {
      this.debug = function () {
      };
    }
    // Set function to debug print messages
    this.client.debug = this.debug;

    // Default messages
    this.setupOnReceive();

    // Receipts
    this.setupReceipts();
  }


  /**
   * It will connect to the STOMP broker.
   */
  public initAndConnect(): void {
    this.initStompClient();

    if (!this._config.headers) {
      this._config.headers = {};
    }

    this.client.configure({
      onConnect: this.on_connect,
      onStompError: (frame: Frame) => {
        // Trigger the frame subject
        this.stompError$.next(frame);
      },
      onWebSocketClose: () => {
        this.state.next(StompState.CLOSED);
      },
      connectHeaders: this._config.headers
    });
    // Attempt connection, passing in a callback
    this.client.activate();

    this.debug('Connecting...');
    this.state.next(StompState.TRYING);
  }


  /**
   * It will disconnect from the STOMP broker.
   */
  public disconnect(): void {

    // Disconnect if connected. Callback will set CLOSED state
    if (this.client) {

      this.client.deactivate();

      if (!this.client.connected) {
        // Nothing to do
        this.state.next(StompState.CLOSED);
        return;
      }

      // Notify observers that we are disconnecting!
      this.state.next(StompState.DISCONNECTING);
    }
  }

  /**
   * It will return `true` if STOMP broker is connected and `false` otherwise.
   */
  public connected(): boolean {
    return this.state.getValue() === StompState.CONNECTED;
  }

  /**
   * It will send a message to a named destination. The message must be `string`.
   *
   * The message will get locally queued if the STOMP broker is not connected. It will attempt to
   * publish queued messages as soon as the broker gets connected.
   *
   * @param queueName
   * @param message
   * @param headers
   */
  public publish(queueName: string, message: string, headers: StompHeaders = {}): void {
    if (this.connected()) {
      this.client.publish({destination: queueName, headers: headers, body: message});
    } else {
      this.debug(`Not connected, queueing ${message}`);
      this.queuedMessages.push({queueName: <string>queueName, message: <string>message, headers: headers});
    }
  }

  /** It will send queued messages. */
  protected sendQueuedMessages(): void {
    const queuedMessages = this.queuedMessages;
    this.queuedMessages = [];

    this.debug(`Will try sending queued messages ${queuedMessages}`);

    for (const queuedMessage of queuedMessages) {
      this.debug(`Attempting to send ${queuedMessage}`);
      this.publish(queuedMessage.queueName, queuedMessage.message, queuedMessage.headers);
    }
  }

  /**
   * It will subscribe to server message queues
   *
   * This method can be safely called even if the STOMP broker is not connected.
   * If the underlying STOMP connection drops and reconnects, it will resubscribe automatically.
   *
   * If a header field 'ack' is not explicitly passed, 'ack' will be set to 'auto'. If you
   * do not understand what it means, please leave it as is.
   *
   * Note that when working with temporary queues where the subscription request
   * creates the
   * underlying queue, mssages might be missed during reconnect. This issue is not specific
   * to this library but the way STOMP brokers are designed to work.
   *
   * @param queueName
   * @param headers
   */
  public subscribe(queueName: string, headers: StompHeaders = {}): Observable<Message> {

    /* Well the logic is complicated but works beautifully. RxJS is indeed wonderful.
     *
     * We need to activate the underlying subscription immediately if Stomp is connected. If not it should
     * subscribe when it gets next connected. Further it should re establish the subscription whenever Stomp
     * successfully reconnects.
     *
     * Actual implementation is simple, we filter the BehaviourSubject 'state' so that we can trigger whenever Stomp is
     * connected. Since 'state' is a BehaviourSubject, if Stomp is already connected, it will immediately trigger.
     *
     * The observable that we return to caller remains same across all reconnects, so no special handling needed at
     * the message subscriber.
     */
    this.debug(`Request to subscribe ${queueName}`);

    // By default auto acknowledgement of messages
    if (!headers['ack']) {
      headers['ack'] = 'auto';
    }

    const coldObservable = Observable.create(
      (messages: Observer<Message>) => {
        /*
         * These variables will be used as part of the closure and work their magic during unsubscribe
         */
        let stompSubscription: StompSubscription;

        let stompConnectedSubscription: Subscription;

        stompConnectedSubscription = this.connectObservable
          .subscribe(() => {
            this.debug(`Will subscribe to ${queueName}`);
            stompSubscription = this.client.subscribe(queueName, (message: Message) => {
                messages.next(message);
              },
              headers);
          });

        return () => { /* cleanup function, will be called when no subscribers are left */
          this.debug(`Stop watching connection state (for ${queueName})`);
          stompConnectedSubscription.unsubscribe();

          if (this.state.getValue() === StompState.CONNECTED) {
            this.debug(`Will unsubscribe from ${queueName} at Stomp`);
            stompSubscription.unsubscribe();
          } else {
            this.debug(`Stomp not connected, no need to unsubscribe from ${queueName} at Stomp`);
          }
        };
      });

    /**
     * Important - convert it to hot Observable - otherwise, if the user code subscribes
     * to this observable twice, it will subscribe twice to Stomp broker. (This was happening in the current example).
     * A long but good explanatory article at https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339
     */
    return coldObservable.pipe(share());
  }

  /**
   * It will handle messages received in the default queue. Messages that would not be handled otherwise
   * get delivered to the default queue.
   */
  protected setupOnReceive(): void {
    this.defaultMessagesObservable = new Subject();

    this.client.onUnhandledMessage = (message: Message) => {
      this.defaultMessagesObservable.next(message);
    };
  }

  /**
   * It will emit all receipts.
   */
  protected setupReceipts(): void {
    this.receiptsObservable = new Subject();

    this.client.onUnhandledReceipt = (frame: Frame) => {
      this.receiptsObservable.next(frame);
    };
  }

  /**
   * Wait for receipt, this indicates that server has carried out the related operation
   */
  public waitForReceipt(receiptId: string, callback: (frame: Frame) => void): void {
    this.client.watchForReceipt(receiptId, callback);
  }

  /**
   * Callback Functions
   *
   * Note the method signature: () => preserves lexical scope
   * if we need to use this.x inside the function
   */
  protected debug = (args: any): void => {
    console.log(new Date(), args);
  }

  /** Callback run on successfully connecting to server */
  protected on_connect = (frame: Frame) => {

    this.debug('Connected');

    this._serverHeadersBehaviourSubject.next(frame.headers);

    // Indicate our connected state to observers
    this.state.next(StompState.CONNECTED);
  }

}
