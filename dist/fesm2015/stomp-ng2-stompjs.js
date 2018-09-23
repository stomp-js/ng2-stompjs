import { first, filter, share } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { client, over } from '@stomp/stompjs';
import { UUID } from 'angular2-uuid';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {number} */
const StompState = {
    CLOSED: 0,
    TRYING: 1,
    CONNECTED: 2,
    DISCONNECTING: 3,
};
StompState[StompState.CLOSED] = "CLOSED";
StompState[StompState.TRYING] = "TRYING";
StompState[StompState.CONNECTED] = "CONNECTED";
StompState[StompState.DISCONNECTING] = "DISCONNECTING";

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Angular2 STOMP Raw Service using \@stomp/stomp.js
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
class StompRService {
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     */
    constructor() {
        /**
         * Internal array to hold locally queued messages when STOMP broker is not connected.
         */
        this.queuedMessages = [];
        /**
         * Callback Functions
         *
         * Note the method signature: () => preserves lexical scope
         * if we need to use this.x inside the function
         */
        this.debug = (args) => {
            console.log(new Date(), args);
        };
        /**
         * Callback run on successfully connecting to server
         */
        this.on_connect = (frame) => {
            this.debug('Connected');
            this._serverHeadersBehaviourSubject.next(frame.headers);
            // Indicate our connected state to observers
            this.state.next(StompState.CONNECTED);
        };
        /**
         * Handle errors from stomp.js
         */
        this.on_error = (error) => {
            // Trigger the error subject
            this.errorSubject.next(error);
            if (typeof error === 'object') {
                error = (/** @type {?} */ (error)).body;
            }
            this.debug(`Error: ${error}`);
            // Check for dropped connection and try reconnecting
            if (!this.client.connected) {
                // Reset state indicator
                this.state.next(StompState.CLOSED);
            }
        };
        this.state = new BehaviorSubject(StompState.CLOSED);
        this.connectObservable = this.state.pipe(filter((currentState) => {
            return currentState === StompState.CONNECTED;
        }));
        // Setup sending queuedMessages
        this.connectObservable.subscribe(() => {
            this.sendQueuedMessages();
        });
        this._serverHeadersBehaviourSubject = new BehaviorSubject(null);
        this.serverHeadersObservable = this._serverHeadersBehaviourSubject.pipe(filter((headers) => {
            return headers !== null;
        }));
        this.errorSubject = new Subject();
    }
    /**
     * Set configuration
     * @param {?} value
     * @return {?}
     */
    set config(value) {
        this._config = value;
    }
    /**
     * It will initialize STOMP Client.
     * @return {?}
     */
    initStompClient() {
        // disconnect if connected
        this.disconnect();
        // url takes precedence over socketFn
        if (typeof (this._config.url) === 'string') {
            this.client = client(this._config.url);
        }
        else {
            this.client = over(this._config.url);
        }
        // Configure client heart-beating
        this.client.heartbeat.incoming = this._config.heartbeat_in;
        this.client.heartbeat.outgoing = this._config.heartbeat_out;
        // Auto reconnect
        this.client.reconnect_delay = this._config.reconnect_delay;
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
     * @return {?}
     */
    initAndConnect() {
        this.initStompClient();
        if (!this._config.headers) {
            this._config.headers = {};
        }
        // Attempt connection, passing in a callback
        this.client.connect(this._config.headers, this.on_connect, this.on_error);
        this.debug('Connecting...');
        this.state.next(StompState.TRYING);
    }
    /**
     * It will disconnect from the STOMP broker.
     * @return {?}
     */
    disconnect() {
        // Disconnect if connected. Callback will set CLOSED state
        if (this.client) {
            if (!this.client.connected) {
                // Nothing to do
                this.state.next(StompState.CLOSED);
                return;
            }
            // Notify observers that we are disconnecting!
            this.state.next(StompState.DISCONNECTING);
            this.client.disconnect(() => this.state.next(StompState.CLOSED));
        }
    }
    /**
     * It will return `true` if STOMP broker is connected and `false` otherwise.
     * @return {?}
     */
    connected() {
        return this.state.getValue() === StompState.CONNECTED;
    }
    /**
     * It will send a message to a named destination. The message must be `string`.
     *
     * The message will get locally queued if the STOMP broker is not connected. It will attempt to
     * publish queued messages as soon as the broker gets connected.
     *
     * @param {?} queueName
     * @param {?} message
     * @param {?=} headers
     * @return {?}
     */
    publish(queueName, message, headers = {}) {
        if (this.connected()) {
            this.client.send(queueName, headers, message);
        }
        else {
            this.debug(`Not connected, queueing ${message}`);
            this.queuedMessages.push({ queueName: /** @type {?} */ (queueName), message: /** @type {?} */ (message), headers: headers });
        }
    }
    /**
     * It will send queued messages.
     * @return {?}
     */
    sendQueuedMessages() {
        const /** @type {?} */ queuedMessages = this.queuedMessages;
        this.queuedMessages = [];
        this.debug(`Will try sending queued messages ${queuedMessages}`);
        for (const /** @type {?} */ queuedMessage of queuedMessages) {
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
     * @param {?} queueName
     * @param {?=} headers
     * @return {?}
     */
    subscribe(queueName, headers = {}) {
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
        const /** @type {?} */ coldObservable = Observable.create((messages) => {
            /*
                     * These variables will be used as part of the closure and work their magic during unsubscribe
                     */
            let /** @type {?} */ stompSubscription;
            let /** @type {?} */ stompConnectedSubscription;
            stompConnectedSubscription = this.connectObservable
                .subscribe(() => {
                this.debug(`Will subscribe to ${queueName}`);
                stompSubscription = this.client.subscribe(queueName, (message) => {
                    messages.next(message);
                }, headers);
            });
            return () => {
                /* cleanup function, will be called when no subscribers are left */
                this.debug(`Stop watching connection state (for ${queueName})`);
                stompConnectedSubscription.unsubscribe();
                if (this.state.getValue() === StompState.CONNECTED) {
                    this.debug(`Will unsubscribe from ${queueName} at Stomp`);
                    stompSubscription.unsubscribe();
                }
                else {
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
     * @return {?}
     */
    setupOnReceive() {
        this.defaultMessagesObservable = new Subject();
        this.client.onreceive = (message) => {
            this.defaultMessagesObservable.next(message);
        };
    }
    /**
     * It will emit all receipts.
     * @return {?}
     */
    setupReceipts() {
        this.receiptsObservable = new Subject();
        this.client.onreceipt = (frame) => {
            this.receiptsObservable.next(frame);
        };
    }
    /**
     * Wait for receipt, this indicates that server has carried out the related operation
     * @param {?} receiptId
     * @param {?} callback
     * @return {?}
     */
    waitForReceipt(receiptId, callback) {
        this.receiptsObservable.pipe(filter((frame) => {
            return frame.headers['receipt-id'] === receiptId;
        }), first()).subscribe((frame) => {
            callback(frame);
        });
    }
}
StompRService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StompRService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Represents a configuration object for the
 * STOMPService to connect to.
 */
class StompConfig {
}
StompConfig.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Angular2 STOMP Service using \@stomp/stomp.js
 *
 * \@description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 *
 * If you want to manually configure and initialize the service
 * please use StompRService
 */
class StompService extends StompRService {
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     * @param {?} config
     */
    constructor(config) {
        super();
        this.config = config;
        this.initAndConnect();
    }
}
StompService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StompService.ctorParameters = () => [
    { type: StompConfig, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * RPC Config. See the guide for example.
 */
class StompRPCConfig {
}
StompRPCConfig.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * An implementation of RPC service using messaging.
 *
 * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
 */
class StompRPCService {
    /**
     * Create an instance, see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
     * @param {?} stompService
     * @param {?=} stompRPCConfig
     */
    constructor(stompService, stompRPCConfig) {
        this.stompService = stompService;
        this.stompRPCConfig = stompRPCConfig;
        this._replyQueueName = '/temp-queue/rpc-replies';
        this._setupReplyQueue = () => {
            return this.stompService.defaultMessagesObservable;
        };
        if (stompRPCConfig) {
            if (stompRPCConfig.replyQueueName) {
                this._replyQueueName = stompRPCConfig.replyQueueName;
            }
            if (stompRPCConfig.setupReplyQueue) {
                this._setupReplyQueue = stompRPCConfig.setupReplyQueue;
            }
        }
    }
    /**
     * Make an RPC request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html) for example.
     * @param {?} serviceEndPoint
     * @param {?} payload
     * @param {?=} headers
     * @return {?}
     */
    rpc(serviceEndPoint, payload, headers) {
        // We know there will be only one message in reply
        return this.stream(serviceEndPoint, payload, headers).pipe(first());
    }
    /**
     * Make an RPC stream request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html).
     * @param {?} serviceEndPoint
     * @param {?} payload
     * @param {?=} headers
     * @return {?}
     */
    stream(serviceEndPoint, payload, headers = {}) {
        if (!this._repliesObservable) {
            this._repliesObservable = this._setupReplyQueue(this._replyQueueName, this.stompService);
        }
        return Observable.create((rpcObserver) => {
            let /** @type {?} */ defaultMessagesSubscription;
            const /** @type {?} */ correlationId = UUID.UUID();
            defaultMessagesSubscription = this._repliesObservable.pipe(filter((message) => {
                return message.headers['correlation-id'] === correlationId;
            })).subscribe((message) => {
                rpcObserver.next(message);
            });
            // send an RPC request
            headers['reply-to'] = this._replyQueueName;
            headers['correlation-id'] = correlationId;
            this.stompService.publish(serviceEndPoint, payload, headers);
            return () => {
                // Cleanup
                defaultMessagesSubscription.unsubscribe();
            };
        });
    }
}
StompRPCService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StompRPCService.ctorParameters = () => [
    { type: StompRService, },
    { type: StompRPCConfig, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { StompRService, StompService, StompState, StompConfig, StompRPCService, StompRPCConfig as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAtci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLmNvbmZpZy50cyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9zdG9tcC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLXJwYy5jb25maWcudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAtcnBjLnNlcnZpY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmlyc3QsIGZpbHRlciwgc2hhcmUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgLCAgT2JzZXJ2YWJsZSAsICBPYnNlcnZlciAsICBTdWJqZWN0ICwgIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBTdG9tcENvbmZpZyB9IGZyb20gJy4vc3RvbXAuY29uZmlnJztcblxuaW1wb3J0ICogYXMgU3RvbXAgZnJvbSAnQHN0b21wL3N0b21wanMnO1xuaW1wb3J0IHsgRnJhbWUsIFN0b21wU3Vic2NyaXB0aW9uIH0gZnJvbSAnQHN0b21wL3N0b21wanMnO1xuaW1wb3J0IHsgU3RvbXBIZWFkZXJzIH0gZnJvbSAnLi9zdG9tcC1oZWFkZXJzJztcbmltcG9ydCB7IFN0b21wU3RhdGUgfSBmcm9tICcuL3N0b21wLXN0YXRlJztcblxuLyoqXG4gKiBBbmd1bGFyMiBTVE9NUCBSYXcgU2VydmljZSB1c2luZyBAc3RvbXAvc3RvbXAuanNcbiAqXG4gKiBZb3Ugd2lsbCBvbmx5IG5lZWQgdGhlIHB1YmxpYyBwcm9wZXJ0aWVzIGFuZFxuICogbWV0aG9kcyBsaXN0ZWQgdW5sZXNzIHlvdSBhcmUgYW4gYWR2YW5jZWQgdXNlci4gVGhpcyBzZXJ2aWNlIGhhbmRsZXMgc3Vic2NyaWJpbmcgdG8gYVxuICogbWVzc2FnZSBxdWV1ZSB1c2luZyB0aGUgc3RvbXAuanMgbGlicmFyeSwgYW5kIHJldHVybnNcbiAqIHZhbHVlcyB2aWEgdGhlIEVTNiBPYnNlcnZhYmxlIHNwZWNpZmljYXRpb24gZm9yXG4gKiBhc3luY2hyb25vdXMgdmFsdWUgc3RyZWFtaW5nIGJ5IHdpcmluZyB0aGUgU1RPTVBcbiAqIG1lc3NhZ2VzIGludG8gYW4gb2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3Ugd2lsbCBsaWtlIHRvIHBhc3MgdGhlIGNvbmZpZ3VyYXRpb24gYXMgYSBkZXBlbmRlbmN5LFxuICogcGxlYXNlIHVzZSBTdG9tcFNlcnZpY2UgY2xhc3MuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFJTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIFN0YXRlIG9mIHRoZSBTVE9NUFNlcnZpY2VcbiAgICpcbiAgICogSXQgaXMgYSBCZWhhdmlvclN1YmplY3QgYW5kIHdpbGwgZW1pdCBjdXJyZW50IHN0YXR1cyBpbW1lZGlhdGVseS4gVGhpcyB3aWxsIHR5cGljYWxseSBnZXRcbiAgICogdXNlZCB0byBzaG93IGN1cnJlbnQgc3RhdHVzIHRvIHRoZSBlbmQgdXNlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0ZTogQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+O1xuXG4gIC8qKlxuICAgKiBXaWxsIHRyaWdnZXIgd2hlbiBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLiBVc2UgdGhpcyB0byBjYXJyeSBvdXQgaW5pdGlhbGl6YXRpb24uXG4gICAqIEl0IHdpbGwgdHJpZ2dlciBldmVyeSB0aW1lIGEgKHJlKWNvbm5lY3Rpb24gb2NjdXJzLiBJZiBpdCBpcyBhbHJlYWR5IGNvbm5lY3RlZFxuICAgKiBpdCB3aWxsIHRyaWdnZXIgaW1tZWRpYXRlbHkuIFlvdSBjYW4gc2FmZWx5IGlnbm9yZSB0aGUgdmFsdWUsIGFzIGl0IHdpbGwgYWx3YXlzIGJlXG4gICAqIFN0b21wU3RhdGUuQ09OTkVDVEVEXG4gICAqL1xuICBwdWJsaWMgY29ubmVjdE9ic2VydmFibGU6IE9ic2VydmFibGU8U3RvbXBTdGF0ZT47XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGhlYWRlcnMgZnJvbSBtb3N0IHJlY2VudCBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgYXMgcmV0dXJuIGJ5IHRoZSBDT05ORUNURURcbiAgICogZnJhbWUuXG4gICAqIElmIHRoZSBTVE9NUCBjb25uZWN0aW9uIGhhcyBhbHJlYWR5IGJlZW4gZXN0YWJsaXNoZWQgaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LlxuICAgKiBJdCB3aWxsIGFkZGl0aW9uYWxseSB0cmlnZ2VyIGluIGV2ZW50IG9mIHJlY29ubmVjdGlvbiwgdGhlIHZhbHVlIHdpbGwgYmUgc2V0IG9mIGhlYWRlcnMgZnJvbVxuICAgKiB0aGUgcmVjZW50IHNlcnZlciByZXNwb25zZS5cbiAgICovXG4gIHB1YmxpYyBzZXJ2ZXJIZWFkZXJzT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxTdG9tcEhlYWRlcnM+O1xuXG4gIHByaXZhdGUgX3NlcnZlckhlYWRlcnNCZWhhdmlvdXJTdWJqZWN0OiBCZWhhdmlvclN1YmplY3Q8bnVsbCB8IFN0b21wSGVhZGVycz47XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgbWVzc2FnZXMgdG8gdGhlIGRlZmF1bHQgcXVldWUgKGFueSBtZXNzYWdlIHRoYXQgYXJlIG5vdCBoYW5kbGVkIGJ5IGEgc3Vic2NyaXB0aW9uKVxuICAgKi9cbiAgcHVibGljIGRlZmF1bHRNZXNzYWdlc09ic2VydmFibGU6IFN1YmplY3Q8U3RvbXAuTWVzc2FnZT47XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgcmVjZWlwdHNcbiAgICovXG4gIHB1YmxpYyByZWNlaXB0c09ic2VydmFibGU6IFN1YmplY3Q8U3RvbXAuRnJhbWU+O1xuXG4gIC8qKlxuICAgKiBXaWxsIHRyaWdnZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMuIFRoaXMgU3ViamVjdCBjYW4gYmUgdXNlZCB0byBoYW5kbGUgZXJyb3JzIGZyb21cbiAgICogdGhlIHN0b21wIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBlcnJvclN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nIHwgU3RvbXAuTWVzc2FnZT47XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGFycmF5IHRvIGhvbGQgbG9jYWxseSBxdWV1ZWQgbWVzc2FnZXMgd2hlbiBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC5cbiAgICovXG4gIHByb3RlY3RlZCBxdWV1ZWRNZXNzYWdlczogeyBxdWV1ZU5hbWU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgfVtdID0gW107XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb25cbiAgICovXG4gIHByaXZhdGUgX2NvbmZpZzogU3RvbXBDb25maWc7XG5cbiAgLyoqXG4gICAqIFNUT01QIENsaWVudCBmcm9tIEBzdG9tcC9zdG9tcC5qc1xuICAgKi9cbiAgcHJvdGVjdGVkIGNsaWVudDogU3RvbXAuQ2xpZW50O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBTZWUgUkVBRE1FIGFuZCBzYW1wbGVzIGZvciBjb25maWd1cmF0aW9uIGV4YW1wbGVzXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U3RvbXBTdGF0ZT4oU3RvbXBTdGF0ZS5DTE9TRUQpO1xuXG4gICAgdGhpcy5jb25uZWN0T2JzZXJ2YWJsZSA9IHRoaXMuc3RhdGUucGlwZShcbiAgICAgIGZpbHRlcigoY3VycmVudFN0YXRlOiBTdG9tcFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBjdXJyZW50U3RhdGUgPT09IFN0b21wU3RhdGUuQ09OTkVDVEVEO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gU2V0dXAgc2VuZGluZyBxdWV1ZWRNZXNzYWdlc1xuICAgIHRoaXMuY29ubmVjdE9ic2VydmFibGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuc2VuZFF1ZXVlZE1lc3NhZ2VzKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZXJ2ZXJIZWFkZXJzQmVoYXZpb3VyU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVsbCB8IFN0b21wSGVhZGVycz4obnVsbCk7XG5cbiAgICB0aGlzLnNlcnZlckhlYWRlcnNPYnNlcnZhYmxlID0gdGhpcy5fc2VydmVySGVhZGVyc0JlaGF2aW91clN1YmplY3QucGlwZShcbiAgICAgIGZpbHRlcigoaGVhZGVyczogbnVsbCB8IFN0b21wSGVhZGVycykgPT4ge1xuICAgICAgICByZXR1cm4gaGVhZGVycyAhPT0gbnVsbDtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuZXJyb3JTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcbiAgfVxuXG4gIC8qKiBTZXQgY29uZmlndXJhdGlvbiAqL1xuICBzZXQgY29uZmlnKHZhbHVlOiBTdG9tcENvbmZpZykge1xuICAgIHRoaXMuX2NvbmZpZyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIEl0IHdpbGwgaW5pdGlhbGl6ZSBTVE9NUCBDbGllbnQuICovXG4gIHByb3RlY3RlZCBpbml0U3RvbXBDbGllbnQoKTogdm9pZCB7XG4gICAgLy8gZGlzY29ubmVjdCBpZiBjb25uZWN0ZWRcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcblxuICAgIC8vIHVybCB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgc29ja2V0Rm5cbiAgICBpZiAodHlwZW9mKHRoaXMuX2NvbmZpZy51cmwpID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5jbGllbnQgPSBTdG9tcC5jbGllbnQodGhpcy5fY29uZmlnLnVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xpZW50ID0gU3RvbXAub3Zlcih0aGlzLl9jb25maWcudXJsKTtcbiAgICB9XG5cbiAgICAvLyBDb25maWd1cmUgY2xpZW50IGhlYXJ0LWJlYXRpbmdcbiAgICB0aGlzLmNsaWVudC5oZWFydGJlYXQuaW5jb21pbmcgPSB0aGlzLl9jb25maWcuaGVhcnRiZWF0X2luO1xuICAgIHRoaXMuY2xpZW50LmhlYXJ0YmVhdC5vdXRnb2luZyA9IHRoaXMuX2NvbmZpZy5oZWFydGJlYXRfb3V0O1xuXG4gICAgLy8gQXV0byByZWNvbm5lY3RcbiAgICB0aGlzLmNsaWVudC5yZWNvbm5lY3RfZGVsYXkgPSB0aGlzLl9jb25maWcucmVjb25uZWN0X2RlbGF5O1xuXG4gICAgaWYgKCF0aGlzLl9jb25maWcuZGVidWcpIHtcbiAgICAgIHRoaXMuZGVidWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBTZXQgZnVuY3Rpb24gdG8gZGVidWcgcHJpbnQgbWVzc2FnZXNcbiAgICB0aGlzLmNsaWVudC5kZWJ1ZyA9IHRoaXMuZGVidWc7XG5cbiAgICAvLyBEZWZhdWx0IG1lc3NhZ2VzXG4gICAgdGhpcy5zZXR1cE9uUmVjZWl2ZSgpO1xuXG4gICAgLy8gUmVjZWlwdHNcbiAgICB0aGlzLnNldHVwUmVjZWlwdHMoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgY29ubmVjdCB0byB0aGUgU1RPTVAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGluaXRBbmRDb25uZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdFN0b21wQ2xpZW50KCk7XG5cbiAgICBpZiAoIXRoaXMuX2NvbmZpZy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLl9jb25maWcuaGVhZGVycyA9IHt9O1xuICAgIH1cblxuICAgIC8vIEF0dGVtcHQgY29ubmVjdGlvbiwgcGFzc2luZyBpbiBhIGNhbGxiYWNrXG4gICAgdGhpcy5jbGllbnQuY29ubmVjdChcbiAgICAgIHRoaXMuX2NvbmZpZy5oZWFkZXJzLFxuICAgICAgdGhpcy5vbl9jb25uZWN0LFxuICAgICAgdGhpcy5vbl9lcnJvclxuICAgICk7XG5cbiAgICB0aGlzLmRlYnVnKCdDb25uZWN0aW5nLi4uJyk7XG4gICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuVFJZSU5HKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgZGlzY29ubmVjdCgpOiB2b2lkIHtcblxuICAgIC8vIERpc2Nvbm5lY3QgaWYgY29ubmVjdGVkLiBDYWxsYmFjayB3aWxsIHNldCBDTE9TRUQgc3RhdGVcbiAgICBpZiAodGhpcy5jbGllbnQpIHtcbiAgICAgIGlmICghdGhpcy5jbGllbnQuY29ubmVjdGVkKSB7XG4gICAgICAgIC8vIE5vdGhpbmcgdG8gZG9cbiAgICAgICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuQ0xPU0VEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3RpZnkgb2JzZXJ2ZXJzIHRoYXQgd2UgYXJlIGRpc2Nvbm5lY3RpbmchXG4gICAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5ESVNDT05ORUNUSU5HKTtcblxuICAgICAgdGhpcy5jbGllbnQuZGlzY29ubmVjdChcbiAgICAgICAgKCkgPT4gdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuQ0xPU0VEKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCByZXR1cm4gYHRydWVgIGlmIFNUT01QIGJyb2tlciBpcyBjb25uZWN0ZWQgYW5kIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcHVibGljIGNvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5nZXRWYWx1ZSgpID09PSBTdG9tcFN0YXRlLkNPTk5FQ1RFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHNlbmQgYSBtZXNzYWdlIHRvIGEgbmFtZWQgZGVzdGluYXRpb24uIFRoZSBtZXNzYWdlIG11c3QgYmUgYHN0cmluZ2AuXG4gICAqXG4gICAqIFRoZSBtZXNzYWdlIHdpbGwgZ2V0IGxvY2FsbHkgcXVldWVkIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC4gSXQgd2lsbCBhdHRlbXB0IHRvXG4gICAqIHB1Ymxpc2ggcXVldWVkIG1lc3NhZ2VzIGFzIHNvb24gYXMgdGhlIGJyb2tlciBnZXRzIGNvbm5lY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHB1Ymxpc2gocXVldWVOYW1lOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb25uZWN0ZWQoKSkge1xuICAgICAgdGhpcy5jbGllbnQuc2VuZChxdWV1ZU5hbWUsIGhlYWRlcnMsIG1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlYnVnKGBOb3QgY29ubmVjdGVkLCBxdWV1ZWluZyAke21lc3NhZ2V9YCk7XG4gICAgICB0aGlzLnF1ZXVlZE1lc3NhZ2VzLnB1c2goe3F1ZXVlTmFtZTogPHN0cmluZz5xdWV1ZU5hbWUsIG1lc3NhZ2U6IDxzdHJpbmc+bWVzc2FnZSwgaGVhZGVyczogaGVhZGVyc30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJdCB3aWxsIHNlbmQgcXVldWVkIG1lc3NhZ2VzLiAqL1xuICBwcm90ZWN0ZWQgc2VuZFF1ZXVlZE1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIGNvbnN0IHF1ZXVlZE1lc3NhZ2VzID0gdGhpcy5xdWV1ZWRNZXNzYWdlcztcbiAgICB0aGlzLnF1ZXVlZE1lc3NhZ2VzID0gW107XG5cbiAgICB0aGlzLmRlYnVnKGBXaWxsIHRyeSBzZW5kaW5nIHF1ZXVlZCBtZXNzYWdlcyAke3F1ZXVlZE1lc3NhZ2VzfWApO1xuXG4gICAgZm9yIChjb25zdCBxdWV1ZWRNZXNzYWdlIG9mIHF1ZXVlZE1lc3NhZ2VzKSB7XG4gICAgICB0aGlzLmRlYnVnKGBBdHRlbXB0aW5nIHRvIHNlbmQgJHtxdWV1ZWRNZXNzYWdlfWApO1xuICAgICAgdGhpcy5wdWJsaXNoKHF1ZXVlZE1lc3NhZ2UucXVldWVOYW1lLCBxdWV1ZWRNZXNzYWdlLm1lc3NhZ2UsIHF1ZXVlZE1lc3NhZ2UuaGVhZGVycyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgc3Vic2NyaWJlIHRvIHNlcnZlciBtZXNzYWdlIHF1ZXVlc1xuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgc2FmZWx5IGNhbGxlZCBldmVuIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC5cbiAgICogSWYgdGhlIHVuZGVybHlpbmcgU1RPTVAgY29ubmVjdGlvbiBkcm9wcyBhbmQgcmVjb25uZWN0cywgaXQgd2lsbCByZXN1YnNjcmliZSBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBJZiBhIGhlYWRlciBmaWVsZCAnYWNrJyBpcyBub3QgZXhwbGljaXRseSBwYXNzZWQsICdhY2snIHdpbGwgYmUgc2V0IHRvICdhdXRvJy4gSWYgeW91XG4gICAqIGRvIG5vdCB1bmRlcnN0YW5kIHdoYXQgaXQgbWVhbnMsIHBsZWFzZSBsZWF2ZSBpdCBhcyBpcy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHdoZW4gd29ya2luZyB3aXRoIHRlbXBvcmFyeSBxdWV1ZXMgd2hlcmUgdGhlIHN1YnNjcmlwdGlvbiByZXF1ZXN0XG4gICAqIGNyZWF0ZXMgdGhlXG4gICAqIHVuZGVybHlpbmcgcXVldWUsIG1zc2FnZXMgbWlnaHQgYmUgbWlzc2VkIGR1cmluZyByZWNvbm5lY3QuIFRoaXMgaXNzdWUgaXMgbm90IHNwZWNpZmljXG4gICAqIHRvIHRoaXMgbGlicmFyeSBidXQgdGhlIHdheSBTVE9NUCBicm9rZXJzIGFyZSBkZXNpZ25lZCB0byB3b3JrLlxuICAgKlxuICAgKiBAcGFyYW0gcXVldWVOYW1lXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBwdWJsaWMgc3Vic2NyaWJlKHF1ZXVlTmFtZTogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fSk6IE9ic2VydmFibGU8U3RvbXAuTWVzc2FnZT4ge1xuXG4gICAgLyogV2VsbCB0aGUgbG9naWMgaXMgY29tcGxpY2F0ZWQgYnV0IHdvcmtzIGJlYXV0aWZ1bGx5LiBSeEpTIGlzIGluZGVlZCB3b25kZXJmdWwuXG4gICAgICpcbiAgICAgKiBXZSBuZWVkIHRvIGFjdGl2YXRlIHRoZSB1bmRlcmx5aW5nIHN1YnNjcmlwdGlvbiBpbW1lZGlhdGVseSBpZiBTdG9tcCBpcyBjb25uZWN0ZWQuIElmIG5vdCBpdCBzaG91bGRcbiAgICAgKiBzdWJzY3JpYmUgd2hlbiBpdCBnZXRzIG5leHQgY29ubmVjdGVkLiBGdXJ0aGVyIGl0IHNob3VsZCByZSBlc3RhYmxpc2ggdGhlIHN1YnNjcmlwdGlvbiB3aGVuZXZlciBTdG9tcFxuICAgICAqIHN1Y2Nlc3NmdWxseSByZWNvbm5lY3RzLlxuICAgICAqXG4gICAgICogQWN0dWFsIGltcGxlbWVudGF0aW9uIGlzIHNpbXBsZSwgd2UgZmlsdGVyIHRoZSBCZWhhdmlvdXJTdWJqZWN0ICdzdGF0ZScgc28gdGhhdCB3ZSBjYW4gdHJpZ2dlciB3aGVuZXZlciBTdG9tcCBpc1xuICAgICAqIGNvbm5lY3RlZC4gU2luY2UgJ3N0YXRlJyBpcyBhIEJlaGF2aW91clN1YmplY3QsIGlmIFN0b21wIGlzIGFscmVhZHkgY29ubmVjdGVkLCBpdCB3aWxsIGltbWVkaWF0ZWx5IHRyaWdnZXIuXG4gICAgICpcbiAgICAgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IHdlIHJldHVybiB0byBjYWxsZXIgcmVtYWlucyBzYW1lIGFjcm9zcyBhbGwgcmVjb25uZWN0cywgc28gbm8gc3BlY2lhbCBoYW5kbGluZyBuZWVkZWQgYXRcbiAgICAgKiB0aGUgbWVzc2FnZSBzdWJzY3JpYmVyLlxuICAgICAqL1xuICAgIHRoaXMuZGVidWcoYFJlcXVlc3QgdG8gc3Vic2NyaWJlICR7cXVldWVOYW1lfWApO1xuXG4gICAgLy8gQnkgZGVmYXVsdCBhdXRvIGFja25vd2xlZGdlbWVudCBvZiBtZXNzYWdlc1xuICAgIGlmICghaGVhZGVyc1snYWNrJ10pIHtcbiAgICAgIGhlYWRlcnNbJ2FjayddID0gJ2F1dG8nO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbGRPYnNlcnZhYmxlID0gT2JzZXJ2YWJsZS5jcmVhdGUoXG4gICAgICAobWVzc2FnZXM6IE9ic2VydmVyPFN0b21wLk1lc3NhZ2U+KSA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFRoZXNlIHZhcmlhYmxlcyB3aWxsIGJlIHVzZWQgYXMgcGFydCBvZiB0aGUgY2xvc3VyZSBhbmQgd29yayB0aGVpciBtYWdpYyBkdXJpbmcgdW5zdWJzY3JpYmVcbiAgICAgICAgICovXG4gICAgICAgIGxldCBzdG9tcFN1YnNjcmlwdGlvbjogU3RvbXBTdWJzY3JpcHRpb247XG5cbiAgICAgICAgbGV0IHN0b21wQ29ubmVjdGVkU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICAgICAgc3RvbXBDb25uZWN0ZWRTdWJzY3JpcHRpb24gPSB0aGlzLmNvbm5lY3RPYnNlcnZhYmxlXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBXaWxsIHN1YnNjcmliZSB0byAke3F1ZXVlTmFtZX1gKTtcbiAgICAgICAgICAgIHN0b21wU3Vic2NyaXB0aW9uID0gdGhpcy5jbGllbnQuc3Vic2NyaWJlKHF1ZXVlTmFtZSwgKG1lc3NhZ2U6IFN0b21wLk1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5uZXh0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBoZWFkZXJzKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4geyAvKiBjbGVhbnVwIGZ1bmN0aW9uLCB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vIHN1YnNjcmliZXJzIGFyZSBsZWZ0ICovXG4gICAgICAgICAgdGhpcy5kZWJ1ZyhgU3RvcCB3YXRjaGluZyBjb25uZWN0aW9uIHN0YXRlIChmb3IgJHtxdWV1ZU5hbWV9KWApO1xuICAgICAgICAgIHN0b21wQ29ubmVjdGVkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5nZXRWYWx1ZSgpID09PSBTdG9tcFN0YXRlLkNPTk5FQ1RFRCkge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgV2lsbCB1bnN1YnNjcmliZSBmcm9tICR7cXVldWVOYW1lfSBhdCBTdG9tcGApO1xuICAgICAgICAgICAgc3RvbXBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU3RvbXAgbm90IGNvbm5lY3RlZCwgbm8gbmVlZCB0byB1bnN1YnNjcmliZSBmcm9tICR7cXVldWVOYW1lfSBhdCBTdG9tcGApO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogSW1wb3J0YW50IC0gY29udmVydCBpdCB0byBob3QgT2JzZXJ2YWJsZSAtIG90aGVyd2lzZSwgaWYgdGhlIHVzZXIgY29kZSBzdWJzY3JpYmVzXG4gICAgICogdG8gdGhpcyBvYnNlcnZhYmxlIHR3aWNlLCBpdCB3aWxsIHN1YnNjcmliZSB0d2ljZSB0byBTdG9tcCBicm9rZXIuIChUaGlzIHdhcyBoYXBwZW5pbmcgaW4gdGhlIGN1cnJlbnQgZXhhbXBsZSkuXG4gICAgICogQSBsb25nIGJ1dCBnb29kIGV4cGxhbmF0b3J5IGFydGljbGUgYXQgaHR0cHM6Ly9tZWRpdW0uY29tL0BiZW5sZXNoL2hvdC12cy1jb2xkLW9ic2VydmFibGVzLWY4MDk0ZWQ1MzMzOVxuICAgICAqL1xuICAgIHJldHVybiBjb2xkT2JzZXJ2YWJsZS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgaGFuZGxlIG1lc3NhZ2VzIHJlY2VpdmVkIGluIHRoZSBkZWZhdWx0IHF1ZXVlLiBNZXNzYWdlcyB0aGF0IHdvdWxkIG5vdCBiZSBoYW5kbGVkIG90aGVyd2lzZVxuICAgKiBnZXQgZGVsaXZlcmVkIHRvIHRoZSBkZWZhdWx0IHF1ZXVlLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldHVwT25SZWNlaXZlKCk6IHZvaWQge1xuICAgIHRoaXMuZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZSA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgICB0aGlzLmNsaWVudC5vbnJlY2VpdmUgPSAobWVzc2FnZTogU3RvbXAuTWVzc2FnZSkgPT4ge1xuICAgICAgdGhpcy5kZWZhdWx0TWVzc2FnZXNPYnNlcnZhYmxlLm5leHQobWVzc2FnZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGVtaXQgYWxsIHJlY2VpcHRzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldHVwUmVjZWlwdHMoKTogdm9pZCB7XG4gICAgdGhpcy5yZWNlaXB0c09ic2VydmFibGUgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgdGhpcy5jbGllbnQub25yZWNlaXB0ID0gKGZyYW1lOiBTdG9tcC5GcmFtZSkgPT4ge1xuICAgICAgdGhpcy5yZWNlaXB0c09ic2VydmFibGUubmV4dChmcmFtZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0IGZvciByZWNlaXB0LCB0aGlzIGluZGljYXRlcyB0aGF0IHNlcnZlciBoYXMgY2FycmllZCBvdXQgdGhlIHJlbGF0ZWQgb3BlcmF0aW9uXG4gICAqL1xuICBwdWJsaWMgd2FpdEZvclJlY2VpcHQocmVjZWlwdElkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZnJhbWU6IFN0b21wLkZyYW1lKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5yZWNlaXB0c09ic2VydmFibGUucGlwZShcbiAgICAgIGZpbHRlcigoZnJhbWU6IFN0b21wLkZyYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiBmcmFtZS5oZWFkZXJzWydyZWNlaXB0LWlkJ10gPT09IHJlY2VpcHRJZDtcbiAgICAgIH0pLFxuICAgICAgZmlyc3QoKVxuICAgICkuc3Vic2NyaWJlKChmcmFtZTogU3RvbXAuRnJhbWUpID0+IHtcbiAgICAgIGNhbGxiYWNrKGZyYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBGdW5jdGlvbnNcbiAgICpcbiAgICogTm90ZSB0aGUgbWV0aG9kIHNpZ25hdHVyZTogKCkgPT4gcHJlc2VydmVzIGxleGljYWwgc2NvcGVcbiAgICogaWYgd2UgbmVlZCB0byB1c2UgdGhpcy54IGluc2lkZSB0aGUgZnVuY3Rpb25cbiAgICovXG4gIHByb3RlY3RlZCBkZWJ1ZyA9IChhcmdzOiBhbnkpOiB2b2lkID0+IHtcbiAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpLCBhcmdzKTtcbiAgfVxuXG4gIC8qKiBDYWxsYmFjayBydW4gb24gc3VjY2Vzc2Z1bGx5IGNvbm5lY3RpbmcgdG8gc2VydmVyICovXG4gIHByb3RlY3RlZCBvbl9jb25uZWN0ID0gKGZyYW1lOiBGcmFtZSkgPT4ge1xuXG4gICAgdGhpcy5kZWJ1ZygnQ29ubmVjdGVkJyk7XG5cbiAgICB0aGlzLl9zZXJ2ZXJIZWFkZXJzQmVoYXZpb3VyU3ViamVjdC5uZXh0KGZyYW1lLmhlYWRlcnMpO1xuXG4gICAgLy8gSW5kaWNhdGUgb3VyIGNvbm5lY3RlZCBzdGF0ZSB0byBvYnNlcnZlcnNcbiAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5DT05ORUNURUQpO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBlcnJvcnMgZnJvbSBzdG9tcC5qcyAqL1xuICBwcm90ZWN0ZWQgb25fZXJyb3IgPSAoZXJyb3I6IHN0cmluZyB8IFN0b21wLk1lc3NhZ2UpID0+IHtcblxuICAgIC8vIFRyaWdnZXIgdGhlIGVycm9yIHN1YmplY3RcbiAgICB0aGlzLmVycm9yU3ViamVjdC5uZXh0KGVycm9yKTtcblxuICAgIGlmICh0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICBlcnJvciA9ICg8U3RvbXAuTWVzc2FnZT5lcnJvcikuYm9keTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnKGBFcnJvcjogJHtlcnJvcn1gKTtcblxuICAgIC8vIENoZWNrIGZvciBkcm9wcGVkIGNvbm5lY3Rpb24gYW5kIHRyeSByZWNvbm5lY3RpbmdcbiAgICBpZiAoIXRoaXMuY2xpZW50LmNvbm5lY3RlZCkge1xuICAgICAgLy8gUmVzZXQgc3RhdGUgaW5kaWNhdG9yXG4gICAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5DTE9TRUQpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgU3RvbXBIZWFkZXJzIH0gZnJvbSAnLi9zdG9tcC1oZWFkZXJzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbi8qKlxuICogUmVwcmVzZW50cyBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB0aGVcbiAqIFNUT01QU2VydmljZSB0byBjb25uZWN0IHRvLlxuICovXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcENvbmZpZyB7XG4gIC8qKlxuICAgKiBTZXJ2ZXIgVVJMIHRvIGNvbm5lY3QgdG8uIFBsZWFzZSByZWZlciB0byB5b3VyIFNUT01QIGJyb2tlciBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzLlxuICAgKlxuICAgKiBFeGFtcGxlOiB3czovLzEyNy4wLjAuMToxNTY3NC93cyAoZm9yIGEgUmFiYml0TVEgZGVmYXVsdCBzZXR1cCBydW5uaW5nIG9uIGxvY2FsaG9zdClcbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSB0aGlzIHBhcmFtZXRlciBjYW4gYmUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gb2JqZWN0IHNpbWlsYXIgdG8gV2ViU29ja2V0XG4gICAqICh0eXBpY2FsbHkgU29ja0pTIGluc3RhbmNlKS5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICpcbiAgICogKCkgPT4ge1xuICAgKiAgIHJldHVybiBuZXcgU29ja0pTKCdodHRwOi8vMTI3LjAuMC4xOjE1Njc0L3N0b21wJyk7XG4gICAqIH1cbiAgICovXG4gIHVybDogc3RyaW5nIHwgKCgpID0+IGFueSk7XG5cbiAgLyoqXG4gICAqIEhlYWRlcnNcbiAgICogVHlwaWNhbCBrZXlzOiBsb2dpbjogc3RyaW5nLCBwYXNzY29kZTogc3RyaW5nLlxuICAgKiBob3N0OnN0cmluZyB3aWxsIG5lZWVkIHRvIGJlIHBhc3NlZCBmb3IgdmlydHVhbCBob3N0cyBpbiBSYWJiaXRNUVxuICAgKi9cbiAgaGVhZGVyczogU3RvbXBIZWFkZXJzO1xuXG4gIC8qKiBIb3cgb2Z0ZW4gdG8gaW5jb21pbmcgaGVhcnRiZWF0P1xuICAgKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMsIHNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSAwIC0gZGlzYWJsZWRcbiAgICovXG4gIGhlYXJ0YmVhdF9pbjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIb3cgb2Z0ZW4gdG8gb3V0Z29pbmcgaGVhcnRiZWF0P1xuICAgKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMsIHNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSAyMDAwMCAtIGV2ZXJ5IDIwIHNlY29uZHNcbiAgICovXG4gIGhlYXJ0YmVhdF9vdXQ6IG51bWJlcjtcblxuICAvKipcbiAgICogV2FpdCBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIGF0dGVtcHRpbmcgYXV0byByZWNvbm5lY3RcbiAgICogU2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDUwMDAgKDUgc2Vjb25kcylcbiAgICovXG4gIHJlY29ubmVjdF9kZWxheTogbnVtYmVyO1xuXG4gIC8qKiBFbmFibGUgY2xpZW50IGRlYnVnZ2luZz8gKi9cbiAgZGVidWc6IGJvb2xlYW47XG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFN0b21wQ29uZmlnIH0gZnJvbSAnLi9zdG9tcC5jb25maWcnO1xuXG5pbXBvcnQgeyBTdG9tcFJTZXJ2aWNlIH0gZnJvbSAnLi9zdG9tcC1yLnNlcnZpY2UnO1xuXG4vKipcbiAqIEFuZ3VsYXIyIFNUT01QIFNlcnZpY2UgdXNpbmcgQHN0b21wL3N0b21wLmpzXG4gKlxuICogQGRlc2NyaXB0aW9uIFRoaXMgc2VydmljZSBoYW5kbGVzIHN1YnNjcmliaW5nIHRvIGFcbiAqIG1lc3NhZ2UgcXVldWUgdXNpbmcgdGhlIHN0b21wLmpzIGxpYnJhcnksIGFuZCByZXR1cm5zXG4gKiB2YWx1ZXMgdmlhIHRoZSBFUzYgT2JzZXJ2YWJsZSBzcGVjaWZpY2F0aW9uIGZvclxuICogYXN5bmNocm9ub3VzIHZhbHVlIHN0cmVhbWluZyBieSB3aXJpbmcgdGhlIFNUT01QXG4gKiBtZXNzYWdlcyBpbnRvIGFuIG9ic2VydmFibGUuXG4gKlxuICogSWYgeW91IHdhbnQgdG8gbWFudWFsbHkgY29uZmlndXJlIGFuZCBpbml0aWFsaXplIHRoZSBzZXJ2aWNlXG4gKiBwbGVhc2UgdXNlIFN0b21wUlNlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wU2VydmljZSBleHRlbmRzIFN0b21wUlNlcnZpY2Uge1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBTZWUgUkVBRE1FIGFuZCBzYW1wbGVzIGZvciBjb25maWd1cmF0aW9uIGV4YW1wbGVzXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoY29uZmlnOiBTdG9tcENvbmZpZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmluaXRBbmRDb25uZWN0KCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gXCJAc3RvbXAvc3RvbXBqc1wiO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtTdG9tcFJTZXJ2aWNlfSBmcm9tIFwiLi9zdG9tcC1yLnNlcnZpY2VcIjtcblxuLyoqXG4gKiBTZWUgdGhlIGd1aWRlIGZvciBleGFtcGxlXG4gKi9cbmV4cG9ydCB0eXBlIHNldHVwUmVwbHlRdWV1ZUZuVHlwZSA9IChyZXBseVF1ZXVlTmFtZTogc3RyaW5nLCBzdG9tcFNlcnZpY2U6IFN0b21wUlNlcnZpY2UpID0+IE9ic2VydmFibGU8TWVzc2FnZT47XG5cbi8qKlxuICogUlBDIENvbmZpZy4gU2VlIHRoZSBndWlkZSBmb3IgZXhhbXBsZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlBDQ29uZmlnIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIHJlcGx5IHF1ZXVlXG4gICAqL1xuICByZXBseVF1ZXVlTmFtZT86IHN0cmluZztcbiAgLyoqXG4gICAqIFNldHVwIHRoZSByZXBseSBxdWV1ZVxuICAgKi9cbiAgc2V0dXBSZXBseVF1ZXVlPzogc2V0dXBSZXBseVF1ZXVlRm5UeXBlO1xufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWVzc2FnZSwgU3RvbXBIZWFkZXJzfSBmcm9tICdAc3RvbXAvc3RvbXBqcyc7XG5pbXBvcnQge1VVSUR9IGZyb20gJ2FuZ3VsYXIyLXV1aWQnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBPYnNlcnZlciwgU3Vic2NyaXB0aW9ufSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHtmaWx0ZXIsIGZpcnN0fSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcbmltcG9ydCB7U3RvbXBSU2VydmljZX0gZnJvbSBcIi4vc3RvbXAtci5zZXJ2aWNlXCI7XG5pbXBvcnQge3NldHVwUmVwbHlRdWV1ZUZuVHlwZSwgU3RvbXBSUENDb25maWd9IGZyb20gXCIuL3N0b21wLXJwYy5jb25maWdcIjtcblxuLyoqXG4gKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiBSUEMgc2VydmljZSB1c2luZyBtZXNzYWdpbmcuXG4gKlxuICogUGxlYXNlIHNlZSB0aGUgW2d1aWRlXSguLi9hZGRpdGlvbmFsLWRvY3VtZW50YXRpb24vcnBjLS0tcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWwpIGZvciBkZXRhaWxzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSUENTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfcmVwbHlRdWV1ZU5hbWUgPSAnL3RlbXAtcXVldWUvcnBjLXJlcGxpZXMnO1xuXG4gIHByaXZhdGUgX3NldHVwUmVwbHlRdWV1ZTogc2V0dXBSZXBseVF1ZXVlRm5UeXBlID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnN0b21wU2VydmljZS5kZWZhdWx0TWVzc2FnZXNPYnNlcnZhYmxlO1xuICB9O1xuXG4gIHByaXZhdGUgX3JlcGxpZXNPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPE1lc3NhZ2U+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gaW5zdGFuY2UsIHNlZSB0aGUgW2d1aWRlXSguLi9hZGRpdGlvbmFsLWRvY3VtZW50YXRpb24vcnBjLS0tcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWwpIGZvciBkZXRhaWxzLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdG9tcFNlcnZpY2U6IFN0b21wUlNlcnZpY2UsIHByaXZhdGUgc3RvbXBSUENDb25maWc/OiBTdG9tcFJQQ0NvbmZpZykge1xuICAgIGlmIChzdG9tcFJQQ0NvbmZpZykge1xuICAgICAgaWYgKHN0b21wUlBDQ29uZmlnLnJlcGx5UXVldWVOYW1lKSB7XG4gICAgICAgIHRoaXMuX3JlcGx5UXVldWVOYW1lID0gc3RvbXBSUENDb25maWcucmVwbHlRdWV1ZU5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoc3RvbXBSUENDb25maWcuc2V0dXBSZXBseVF1ZXVlKSB7XG4gICAgICAgIHRoaXMuX3NldHVwUmVwbHlRdWV1ZSA9IHN0b21wUlBDQ29uZmlnLnNldHVwUmVwbHlRdWV1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBSUEMgcmVxdWVzdC4gU2VlIHRoZSBbZ3VpZGVdKC4uL2FkZGl0aW9uYWwtZG9jdW1lbnRhdGlvbi9ycGMtLS1yZW1vdGUtcHJvY2VkdXJlLWNhbGwuaHRtbCkgZm9yIGV4YW1wbGUuXG4gICAqL1xuICBwdWJsaWMgcnBjKHNlcnZpY2VFbmRQb2ludDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcsIGhlYWRlcnM/OiBTdG9tcEhlYWRlcnMpOiBPYnNlcnZhYmxlPE1lc3NhZ2U+IHtcbiAgICAvLyBXZSBrbm93IHRoZXJlIHdpbGwgYmUgb25seSBvbmUgbWVzc2FnZSBpbiByZXBseVxuICAgIHJldHVybiB0aGlzLnN0cmVhbShzZXJ2aWNlRW5kUG9pbnQsIHBheWxvYWQsIGhlYWRlcnMpLnBpcGUoZmlyc3QoKSk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBSUEMgc3RyZWFtIHJlcXVlc3QuIFNlZSB0aGUgW2d1aWRlXSguLi9hZGRpdGlvbmFsLWRvY3VtZW50YXRpb24vcnBjLS0tcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWwpLlxuICAgKi9cbiAgcHVibGljIHN0cmVhbShzZXJ2aWNlRW5kUG9pbnQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fSkge1xuICAgIGlmICghdGhpcy5fcmVwbGllc09ic2VydmFibGUpIHtcbiAgICAgIHRoaXMuX3JlcGxpZXNPYnNlcnZhYmxlID0gdGhpcy5fc2V0dXBSZXBseVF1ZXVlKHRoaXMuX3JlcGx5UXVldWVOYW1lLCB0aGlzLnN0b21wU2VydmljZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKFxuICAgICAgKHJwY09ic2VydmVyOiBPYnNlcnZlcjxNZXNzYWdlPikgPT4ge1xuICAgICAgICBsZXQgZGVmYXVsdE1lc3NhZ2VzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICAgICAgY29uc3QgY29ycmVsYXRpb25JZCA9IFVVSUQuVVVJRCgpO1xuXG4gICAgICAgIGRlZmF1bHRNZXNzYWdlc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3JlcGxpZXNPYnNlcnZhYmxlLnBpcGUoZmlsdGVyKChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2UuaGVhZGVyc1snY29ycmVsYXRpb24taWQnXSA9PT0gY29ycmVsYXRpb25JZDtcbiAgICAgICAgfSkpLnN1YnNjcmliZSgobWVzc2FnZTogTWVzc2FnZSkgPT4ge1xuICAgICAgICAgIHJwY09ic2VydmVyLm5leHQobWVzc2FnZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNlbmQgYW4gUlBDIHJlcXVlc3RcbiAgICAgICAgaGVhZGVyc1sncmVwbHktdG8nXSA9IHRoaXMuX3JlcGx5UXVldWVOYW1lO1xuICAgICAgICBoZWFkZXJzWydjb3JyZWxhdGlvbi1pZCddID0gY29ycmVsYXRpb25JZDtcblxuICAgICAgICB0aGlzLnN0b21wU2VydmljZS5wdWJsaXNoKHNlcnZpY2VFbmRQb2ludCwgcGF5bG9hZCwgaGVhZGVycyk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHsgLy8gQ2xlYW51cFxuICAgICAgICAgIGRlZmF1bHRNZXNzYWdlc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJTdG9tcC5jbGllbnQiLCJTdG9tcC5vdmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7Ozs7OzhCQStDOEYsRUFBRTs7Ozs7OztxQkE0UjVFLENBQUMsSUFBUztZQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDL0I7Ozs7MEJBR3NCLENBQUMsS0FBWTtZQUVsQyxJQUFJLENBQUMsS0FBSyxDQUFD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