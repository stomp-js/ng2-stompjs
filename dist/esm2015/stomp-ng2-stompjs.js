import { first, filter, share } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { client, over } from '@stomp/stompjs';

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
    { type: Injectable },
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
    { type: Injectable },
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
    { type: Injectable },
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
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { StompRService, StompService, StompState, StompConfig };
//# sourceMappingURL=stomp-ng2-stompjs.js.map
