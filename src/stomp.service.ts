import { Injectable } from '@angular/core';

import {Observable, Observer, Subscription} from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StompConfig } from './stomp.config';

import * as Stomp from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs';
import {StompConfigService} from './stomp-config.service';

/** possible states for the STOMP service */
export enum STOMPState {
  CLOSED,
  TRYING,
  CONNECTED,
  DISCONNECTING
}

/**
 * Angular2 STOMP Service using stomp.js
 *
 * @description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into a observable.
 */
@Injectable()
export class STOMPService {

  // State of the STOMPService
  public state: BehaviorSubject<STOMPState>;

  // Will trigger when connection is established, will trigger immediately once if already connected
  public connectObservable: Observable<number>;

  private queuedMessages: {queueName: string, message: string}[]= [];

  // Configuration structure with MQ creds
  private config: StompConfig;

  // STOMP Client from stomp.js
  private client: Stomp.Client;

  /** Constructor */
  public constructor(private _configService: StompConfigService) {
    this.state = new BehaviorSubject<STOMPState>(STOMPState.CLOSED);

    this.connectObservable = this.state
      .filter((currentState: number) => {
        return currentState === STOMPState.CONNECTED;
      });

    // Setup sending queuedMessages
    this.connectObservable.subscribe(() => {
      this.sendQueuedMessages();
    });

    // Get configuration from config service...
    this._configService.get().subscribe(
      (config: StompConfig) => {
        // ... then pass it to (and connect) STOMP:
        this.configure(config);
        this.try_connect();
      }
    );
  }

  /** Set up configuration */
  private configure(config?: StompConfig): void {

    this.config = config;

    // Connecting via SSL Websocket?
    let scheme = 'ws';
    if (this.config.ssl) {
      scheme = 'wss';
    }

    // Attempt connection, passing in a callback
    this.client = Stomp.client(`${scheme}://${this.config.host}:${this.config.port}/${this.config.path}`);

    // Configure client heartbeating
    this.client.heartbeat.incoming = this.config.heartbeat_in;
    this.client.heartbeat.outgoing = this.config.heartbeat_out;

    // Auto reconnect
    this.client.reconnect_delay = this.config.reconnect_delay;

    // Set function to debug print messages
    this.client.debug = this.config.debug || this.config.debug == null ? this.debug : null;
  }


  /**
   * Perform connection to STOMP broker
   */
  private try_connect(): void {

    // Attempt connection, passing in a callback
    this.client.connect(
      this.config.user,
      this.config.pass,
      this.on_connect,
      this.on_error
    );

    this.debug('Connecting...');
    this.state.next(STOMPState.TRYING);
  }


  /** Disconnect the STOMP client and clean up,
   * not sure how this method will get called, if ever */
  public disconnect(): void {

    // Notify observers that we are disconnecting!
    this.state.next(STOMPState.DISCONNECTING);

    // Disconnect if connected. Callback will set CLOSED state
    if (this.client && this.client.connected) {
      this.client.disconnect(
        () => this.state.next(STOMPState.CLOSED)
      );
    }
  }

  public connected(): boolean {
    return this.state.getValue() === STOMPState.CONNECTED;
  }

  /** Send a message, queue it locally if not connected */
  public publish(queueName: string, message?: string): void {
    if (this.connected()) {
      this.client.send(queueName, {}, message);
    } else {
      this.debug(`Not connected, queueing ${message}`);
      this.queuedMessages.push({queueName: queueName, message: message});
    }
  }

  /** Send queued messages */
  private sendQueuedMessages(): void {
    const queuedMessages = this.queuedMessages;
    this.queuedMessages = [];

    this.debug(`Will try sending queued messages ${queuedMessages}`);

    for (const queuedMessage of queuedMessages) {
      this.debug(`Attempting to send ${queuedMessage}`);
      this.publish(queuedMessage.queueName, queuedMessage.message);
    }
  }

  /** Subscribe to server message queues */
  public subscribe(queueName: string): Observable<Stomp.Message> {

    /** Well the logic is complicated but works beautifully. RxJS is indeed wonderful.
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

    const coldObservable = Observable.create(
      (messages: Observer<Stomp.Message>) => {
        /**
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
              {ack: 'auto'});
          });

        return () => { /* cleanup function, will be called when no subscribers are left */
          this.debug(`Stop watching connection state (for ${queueName})`);
          stompConnectedSubscription.unsubscribe();

          if (this.state.getValue() === STOMPState.CONNECTED) {
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
  private debug = (args: any): void => {
      console.log(new Date(), args);
  }

  // Callback run on successfully connecting to server
  private on_connect = () => {

    this.debug('Connected');

    // Indicate our connected state to observers
    this.state.next(STOMPState.CONNECTED);
  }

  // Handle errors from stomp.js
  private on_error = (error: string | Stomp.Message) => {

    if (typeof error === 'object') {
      error = (<Stomp.Message>error).body;
    }

    console.error(`Error: ${error}`);

    // Check for dropped connection and try reconnecting
    if (!this.client.connected) {
      // Reset state indicator
      this.state.next(STOMPState.CLOSED);
    }
  }
}

