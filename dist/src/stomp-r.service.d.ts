import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StompConfig } from './stomp.config';
import * as Stomp from '@stomp/stompjs';
import { StompHeaders } from './stomp-headers';
import { StompState } from './stomp-state';
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
    /** It will initialize STOMP Client. */
    protected initStompClient(): void;
    /**
     * It will connect to the STOMP broker.
     */
    initAndConnect(): void;
    /**
     * It will disconnect from the STOMP broker.
     */
    disconnect(): void;
    /**
     * It will return `true` if STOMP broker is connected and `false` otherwise.
     */
    connected(): boolean;
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
    publish(queueName: string, message: string, headers?: StompHeaders): void;
    /** It will send queued messages. */
    protected sendQueuedMessages(): void;
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
    subscribe(queueName: string, headers?: StompHeaders): Observable<Stomp.Message>;
    /**
     * It will handle messages received in the default queue. Messages that would not be handled otherwise
     * get delivered to the default queue.
     */
    protected setupOnReceive(): void;
    /**
     * It will emit all receipts.
     */
    protected setupReceipts(): void;
    /**
     * Wait for receipt, this indicates that server has carried out the related operation
     */
    waitForReceipt(receiptId: string, callback: (frame: Stomp.Frame) => void): void;
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
