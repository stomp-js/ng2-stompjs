import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/share';
import { StompConfig } from './stomp.config';
import * as Stomp from '@stomp/stompjs';
import { StompHeaders } from './stomp-headers';
import { StompState } from './stomp-state';
/**
 * Angular2 STOMP Raw Service using @stomp/stomp.js
 *
 * @description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 *
 * If you will like to pass the configuration as a dependency,
 * please use StompService class.
 */
export declare class StompRService {
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
     * Provides headers from most recent connection to the server as return by the CONNECTED
     * frame.
     * If the STOMP connection has already been established it will trigger immediately.
     * It will additionally trigger in event of reconnection, the value will be set of headers from
     * the recent server response.
     */
    serverHeadersObservable: Observable<StompHeaders>;
    private _serverHeadersBehaviourSubject;
    /**
     * Will emit all messages to the default queue (any message that are not handled by a subscription)
     */
    defaultMessagesObservable: Subject<Stomp.Message>;
    /**
     * Will emit all receipts
     */
    receiptsObservable: Subject<Stomp.Frame>;
    /**
     * Will trigger when an error occurs. This Subject can be used to handle errors from
     * the stomp broker.
     */
    errorSubject: Subject<string | Stomp.Message>;
    /**
     * Internal array to hold locally queued messages when STOMP broker is not connected.
     */
    protected queuedMessages: {
        queueName: string;
        message: string;
        headers: StompHeaders;
    }[];
    /**
     * Configuration
     */
    private _config;
    /**
     * STOMP Client from @stomp/stomp.js
     */
    protected client: Stomp.Client;
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     */
    constructor();
    /** Set configuration */
    config: StompConfig;
    /** Initialize STOMP Client */
    protected initStompClient(): void;
    /**
     * Perform connection to STOMP broker
     */
    initAndConnect(): void;
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
    protected sendQueuedMessages(): void;
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
     * Handle messages to default queue, it will include any unhandled messages. We can use this for
     * RPC type communications.
     */
    protected setupOnReceive(): void;
    /**
     * Emit all receipts.
     */
    protected setupReceipts(): void;
    /**
     * Wait for receipt, this indicates that server has carried out the related operation
     */
    waitForReceipt(receiptId: string, callback: () => void): void;
    /**
     * Callback Functions
     *
     * Note the method signature: () => preserves lexical scope
     * if we need to use this.x inside the function
     */
    protected debug: (args: any) => void;
    /** Callback run on successfully connecting to server */
    protected on_connect: (frame: Stomp.Frame) => void;
    /** Handle errors from stomp.js */
    protected on_error: (error: string | Stomp.Message) => void;
}
