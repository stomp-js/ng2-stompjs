import { Injectable } from '@angular/core';

import {Observable, Observer, Subscription} from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StompConfig } from './stomp.config';

import * as Stomp from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs';
import {StompHeaders} from './stomp-headers';

/**
 * Possible states for the STOMP service
 */
export enum StompState {
  CLOSED,
  TRYING,
  CONNECTED,
  DISCONNECTING
}

/**
 * Angular2 STOMP Service using @stomp/stomp.js
 *
 * @description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 */
@Injectable()
export class StompService {

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
   * Internal array to hold locallly queued messages when STOMP broker is not connected.
   */
  protected queuedMessages: {queueName: string, message: string, headers: StompHeaders}[]= [];

  /**
   * Configuration
   */

  /**
   * STOMP Client from @stomp/stomp.js
   */
  protected client: Stomp.Client;

  /**
   * Constructor
   *
   * See README and samples for configuration examples
   */
  public constructor(protected config: StompConfig) {
    this.state = new BehaviorSubject<StompState>(StompState.CLOSED);

    this.connectObservable = this.state
      .filter((currentState: number) => {
        return currentState === StompState.CONNECTED;
      });

    // Setup sending queuedMessages
    this.connectObservable.subscribe(() => {
      this.sendQueuedMessages();
    });

    this.initStompClient();
    this.try_connect();
  }

  /** Initialize STOMP Client */
  protected initStompClient(): void {
    // url takes precedence over socketFn
    if (typeof(this.config.url) === 'string') {
      this.client = Stomp.client(this.config.url);
    } else {
      this.client = Stomp.over(this.config.url);
    }

    // Configure client heart-beating
    this.client.heartbeat.incoming = this.config.heartbeat_in;
    this.client.heartbeat.outgoing = this.config.heartbeat_out;

    // Auto reconnect
    this.client.reconnect_delay = this.config.reconnect_delay;

    if (!this.config.debug) {
      this.debug = function() {};
    }
    // Set function to debug print messages
    this.client.debug = this.debug;
  }


  /**
   * Perform connection to STOMP broker
   */
  protected try_connect(): void {

    // Attempt connection, passing in a callback
    this.client.connect(
      this.config.headers,
      this.on_connect,
      this.on_error
    );

    this.debug('Connecting...');
    this.state.next(StompState.TRYING);
  }


  /**
   * Disconnect the connection to the STOMP broker and clean up,
   * not sure how this method will get called, if ever.
   * Call this method only if you know what you are doing.
   */
  public disconnect(): void {

    // Disconnect if connected. Callback will set CLOSED state
    if (this.client && this.client.connected) {
      // Notify observers that we are disconnecting!
      this.state.next(StompState.DISCONNECTING);

      this.client.disconnect(
        () => this.state.next(StompState.CLOSED)
      );
    }
  }

  /**
   * The current connection status with the STOMP broker
   * @returns {boolean}
   */
  public connected(): boolean {
    return this.state.getValue() === StompState.CONNECTED;
  }

  /**
   * Send a message to a named destination. The message must be string.
   *
   * The message will get locally queued if the STOMP broker is not connected. Attempt
   * will be made to publish queued messages as soon as the broker gets connected.
   *
   * @param queueName
   * @param message
   * @param headers
   */
  public publish(queueName: string, message: string, headers: StompHeaders = {}): void {
    if (this.connected()) {
      this.client.send(queueName, headers, message);
    } else {
      this.debug(`Not connected, queueing ${message}`);
      this.queuedMessages.push({queueName: <string>queueName, message: <string>message, headers: headers});
    }
  }

  /** Send queued messages */
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
   * Subscribe to server message queues
   *
   * This method can safely be called even when STOMP broker is not connected. Further
   * if the underlying STOMP connection drops and reconnects, it will resubscribe transparently.
   *
   * If a header field 'ack' is not explicitly passed, 'ack' will be set to 'auto'. If you
   * do not understand what it means, please leave it as is.
   *
   * Please note, however, while working with temporary queues, where the subscription request
   * creates the
   * underlying queue, during reconnect it might miss messages. This issue is not specific
   * to this library but the way STOMP brokers are designed to work.
   *
   * @param queueName
   * @param headers
   * @returns {Observable<Stomp.Message>}
   */
  public subscribe(queueName: string, headers: StompHeaders = {}): Observable<Stomp.Message> {

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
      (messages: Observer<Stomp.Message>) => {
        /*
         * These variables will be used as part of the closure and work their magic during unsubscribe
         */
        let stompSubscription: StompSubscription;

        let stompConnectedSubscription: Subscription;

        stompConnectedSubscription = this.connectObservable
          .subscribe(() => {
            this.debug(`Will subscribe to ${queueName}`);
            stompSubscription = this.client.subscribe(queueName, (message: Stomp.Message) => {
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
    return coldObservable.share();
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
  protected on_connect = () => {

    this.debug('Connected');

    // Indicate our connected state to observers
    this.state.next(StompState.CONNECTED);
  }

  /** Handle errors from stomp.js */
  protected on_error = (error: string | Stomp.Message) => {

    if (typeof error === 'object') {
      error = (<Stomp.Message>error).body;
    }

    this.debug(`Error: ${error}`);

    // Check for dropped connection and try reconnecting
    if (!this.client.connected) {
      // Reset state indicator
      this.state.next(StompState.CLOSED);
    }
  }
}

