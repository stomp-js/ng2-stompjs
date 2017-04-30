import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Stomp from '@stomp/stompjs';
import { StompConfigService } from './stomp-config.service';
import { StompHeaders } from './stomp-headers';
/**
 * Possible states for the STOMP service
 */
export declare enum StompState {
    CLOSED = 0,
    TRYING = 1,
    CONNECTED = 2,
    DISCONNECTING = 3,
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
export declare class StompService {
    private _configService;
    /**
     * State of the STOMPService
     *
     * It is a BehaviorSubject and will emit current status immediately. This will typically get
     * used to show current status to the end user.
     */
    state: BehaviorSubject<StompState>;
    /**
     * Will trigger when connection is established. Use this to carry out initialization.
     * It will trigger every time a (re)connection occurs. If it is already connected
     * it will trigger immediately. You can safely ignore the value, as it will always be
     * StompState.CONNECTED
     */
    connectObservable: Observable<StompState>;
    /**
     * Internal array to hold locallly queued messages when STOMP broker is not connected.
     */
    private queuedMessages;
    /**
     * Configuration
     */
    private config;
    /**
     * STOMP Client from @stomp/stomp.js
     */
    private client;
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     */
    constructor(_configService: StompConfigService);
    /** Set up configuration */
    private configure(config);
    /**
     * Perform connection to STOMP broker
     */
    private try_connect();
    /**
     * Disconnect the connection to the STOMP broker and clean up,
     * not sure how this method will get called, if ever.
     * Call this method only if you know what you are doing.
     */
    disconnect(): void;
    /**
     * The current connection status with the STOMP broker
     * @returns {boolean}
     */
    connected(): boolean;
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
    publish(queueName: string, message: string, headers?: StompHeaders): void;
    /** Send queued messages */
    private sendQueuedMessages();
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
    subscribe(queueName: string, headers?: StompHeaders): Observable<Stomp.Message>;
    /**
     * Callback Functions
     *
     * Note the method signature: () => preserves lexical scope
     * if we need to use this.x inside the function
     */
    private debug;
    /** Callback run on successfully connecting to server */
    private on_connect;
    /** Handle errors from stomp.js */
    private on_error;
}
