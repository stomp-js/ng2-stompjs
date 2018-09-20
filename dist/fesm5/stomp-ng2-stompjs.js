import { __extends, __values } from 'tslib';
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
var StompState = {
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
var StompRService = /** @class */ (function () {
    function StompRService() {
        var _this = this;
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
        this.debug = function (args) {
            console.log(new Date(), args);
        };
        /**
         * Callback run on successfully connecting to server
         */
        this.on_connect = function (frame) {
            _this.debug('Connected');
            _this._serverHeadersBehaviourSubject.next(frame.headers);
            // Indicate our connected state to observers
            // Indicate our connected state to observers
            _this.state.next(StompState.CONNECTED);
        };
        /**
         * Handle errors from stomp.js
         */
        this.on_error = function (error) {
            // Trigger the error subject
            // Trigger the error subject
            _this.errorSubject.next(error);
            if (typeof error === 'object') {
                error = (/** @type {?} */ (error)).body;
            }
            _this.debug("Error: " + error);
            // Check for dropped connection and try reconnecting
            if (!_this.client.connected) {
                // Reset state indicator
                // Reset state indicator
                _this.state.next(StompState.CLOSED);
            }
        };
        this.state = new BehaviorSubject(StompState.CLOSED);
        this.connectObservable = this.state.pipe(filter(function (currentState) {
            return currentState === StompState.CONNECTED;
        }));
        // Setup sending queuedMessages
        this.connectObservable.subscribe(function () {
            _this.sendQueuedMessages();
        });
        this._serverHeadersBehaviourSubject = new BehaviorSubject(null);
        this.serverHeadersObservable = this._serverHeadersBehaviourSubject.pipe(filter(function (headers) {
            return headers !== null;
        }));
        this.errorSubject = new Subject();
    }
    Object.defineProperty(StompRService.prototype, "config", {
        /** Set configuration */
        set: /**
         * Set configuration
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._config = value;
        },
        enumerable: true,
        configurable: true
    });
    /** It will initialize STOMP Client. */
    /**
     * It will initialize STOMP Client.
     * @return {?}
     */
    StompRService.prototype.initStompClient = /**
     * It will initialize STOMP Client.
     * @return {?}
     */
    function () {
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
    };
    /**
     * It will connect to the STOMP broker.
     * @return {?}
     */
    StompRService.prototype.initAndConnect = /**
     * It will connect to the STOMP broker.
     * @return {?}
     */
    function () {
        this.initStompClient();
        if (!this._config.headers) {
            this._config.headers = {};
        }
        // Attempt connection, passing in a callback
        this.client.connect(this._config.headers, this.on_connect, this.on_error);
        this.debug('Connecting...');
        this.state.next(StompState.TRYING);
    };
    /**
     * It will disconnect from the STOMP broker.
     * @return {?}
     */
    StompRService.prototype.disconnect = /**
     * It will disconnect from the STOMP broker.
     * @return {?}
     */
    function () {
        var _this = this;
        // Disconnect if connected. Callback will set CLOSED state
        if (this.client) {
            if (!this.client.connected) {
                // Nothing to do
                this.state.next(StompState.CLOSED);
                return;
            }
            // Notify observers that we are disconnecting!
            this.state.next(StompState.DISCONNECTING);
            this.client.disconnect(function () { return _this.state.next(StompState.CLOSED); });
        }
    };
    /**
     * It will return `true` if STOMP broker is connected and `false` otherwise.
     * @return {?}
     */
    StompRService.prototype.connected = /**
     * It will return `true` if STOMP broker is connected and `false` otherwise.
     * @return {?}
     */
    function () {
        return this.state.getValue() === StompState.CONNECTED;
    };
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
    StompRService.prototype.publish = /**
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
    function (queueName, message, headers) {
        if (headers === void 0) { headers = {}; }
        if (this.connected()) {
            this.client.send(queueName, headers, message);
        }
        else {
            this.debug("Not connected, queueing " + message);
            this.queuedMessages.push({ queueName: /** @type {?} */ (queueName), message: /** @type {?} */ (message), headers: headers });
        }
    };
    /** It will send queued messages. */
    /**
     * It will send queued messages.
     * @return {?}
     */
    StompRService.prototype.sendQueuedMessages = /**
     * It will send queued messages.
     * @return {?}
     */
    function () {
        var /** @type {?} */ queuedMessages = this.queuedMessages;
        this.queuedMessages = [];
        this.debug("Will try sending queued messages " + queuedMessages);
        try {
            for (var queuedMessages_1 = __values(queuedMessages), queuedMessages_1_1 = queuedMessages_1.next(); !queuedMessages_1_1.done; queuedMessages_1_1 = queuedMessages_1.next()) {
                var queuedMessage = queuedMessages_1_1.value;
                this.debug("Attempting to send " + queuedMessage);
                this.publish(queuedMessage.queueName, queuedMessage.message, queuedMessage.headers);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (queuedMessages_1_1 && !queuedMessages_1_1.done && (_a = queuedMessages_1.return)) _a.call(queuedMessages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
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
    StompRService.prototype.subscribe = /**
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
    function (queueName, headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
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
        this.debug("Request to subscribe " + queueName);
        // By default auto acknowledgement of messages
        if (!headers['ack']) {
            headers['ack'] = 'auto';
        }
        var /** @type {?} */ coldObservable = Observable.create(function (messages) {
            /*
                     * These variables will be used as part of the closure and work their magic during unsubscribe
                     */
            var /** @type {?} */ stompSubscription;
            var /** @type {?} */ stompConnectedSubscription;
            stompConnectedSubscription = _this.connectObservable
                .subscribe(function () {
                _this.debug("Will subscribe to " + queueName);
                stompSubscription = _this.client.subscribe(queueName, function (message) {
                    messages.next(message);
                }, headers);
            });
            return function () {
                /* cleanup function, will be called when no subscribers are left */
                _this.debug("Stop watching connection state (for " + queueName + ")");
                stompConnectedSubscription.unsubscribe();
                if (_this.state.getValue() === StompState.CONNECTED) {
                    _this.debug("Will unsubscribe from " + queueName + " at Stomp");
                    stompSubscription.unsubscribe();
                }
                else {
                    _this.debug("Stomp not connected, no need to unsubscribe from " + queueName + " at Stomp");
                }
            };
        });
        /**
             * Important - convert it to hot Observable - otherwise, if the user code subscribes
             * to this observable twice, it will subscribe twice to Stomp broker. (This was happening in the current example).
             * A long but good explanatory article at https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339
             */
        return coldObservable.pipe(share());
    };
    /**
     * It will handle messages received in the default queue. Messages that would not be handled otherwise
     * get delivered to the default queue.
     */
    /**
     * It will handle messages received in the default queue. Messages that would not be handled otherwise
     * get delivered to the default queue.
     * @return {?}
     */
    StompRService.prototype.setupOnReceive = /**
     * It will handle messages received in the default queue. Messages that would not be handled otherwise
     * get delivered to the default queue.
     * @return {?}
     */
    function () {
        var _this = this;
        this.defaultMessagesObservable = new Subject();
        this.client.onreceive = function (message) {
            _this.defaultMessagesObservable.next(message);
        };
    };
    /**
     * It will emit all receipts.
     */
    /**
     * It will emit all receipts.
     * @return {?}
     */
    StompRService.prototype.setupReceipts = /**
     * It will emit all receipts.
     * @return {?}
     */
    function () {
        var _this = this;
        this.receiptsObservable = new Subject();
        this.client.onreceipt = function (frame) {
            _this.receiptsObservable.next(frame);
        };
    };
    /**
     * Wait for receipt, this indicates that server has carried out the related operation
     * @param {?} receiptId
     * @param {?} callback
     * @return {?}
     */
    StompRService.prototype.waitForReceipt = /**
     * Wait for receipt, this indicates that server has carried out the related operation
     * @param {?} receiptId
     * @param {?} callback
     * @return {?}
     */
    function (receiptId, callback) {
        this.receiptsObservable.pipe(filter(function (frame) {
            return frame.headers['receipt-id'] === receiptId;
        }), first()).subscribe(function (frame) {
            callback(frame);
        });
    };
    StompRService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StompRService.ctorParameters = function () { return []; };
    return StompRService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Represents a configuration object for the
 * STOMPService to connect to.
 */
var StompConfig = /** @class */ (function () {
    function StompConfig() {
    }
    StompConfig.decorators = [
        { type: Injectable }
    ];
    return StompConfig;
}());

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
var StompService = /** @class */ (function (_super) {
    __extends(StompService, _super);
    function StompService(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.initAndConnect();
        return _this;
    }
    StompService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StompService.ctorParameters = function () { return [
        { type: StompConfig, },
    ]; };
    return StompService;
}(StompRService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var StompRPCService = /** @class */ (function () {
    function StompRPCService(stompService) {
        this.stompService = stompService;
        this.replyQueue = 'rpc-replies';
        this.messagesObservable = this.stompService.defaultMessagesObservable;
    }
    /**
     * @param {?} serviceEndPoint
     * @param {?} payload
     * @return {?}
     */
    StompRPCService.prototype.rpc = /**
     * @param {?} serviceEndPoint
     * @param {?} payload
     * @return {?}
     */
    function (serviceEndPoint, payload) {
        // We know there will be only one message in reply
        return this.stream(serviceEndPoint, payload).pipe(first());
    };
    /**
     * @param {?} serviceEndPoint
     * @param {?} payload
     * @return {?}
     */
    StompRPCService.prototype.stream = /**
     * @param {?} serviceEndPoint
     * @param {?} payload
     * @return {?}
     */
    function (serviceEndPoint, payload) {
        var _this = this;
        return Observable.create(function (rpcObserver) {
            var /** @type {?} */ defaultMessagesSubscription;
            var /** @type {?} */ correlationId = UUID.UUID();
            defaultMessagesSubscription = _this.messagesObservable.pipe(filter(function (message) {
                return message.headers['correlation-id'] === correlationId;
            })).subscribe(function (message) {
                rpcObserver.next(message);
            });
            // send an RPC request
            var /** @type {?} */ headers = {
                'reply-to': "/temp-queue/" + _this.replyQueue,
                'correlation-id': correlationId
            };
            _this.stompService.publish(serviceEndPoint, payload, headers);
            return function () {
                // Cleanup
                defaultMessagesSubscription.unsubscribe();
            };
        });
    };
    StompRPCService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StompRPCService.ctorParameters = function () { return [
        { type: StompService, },
    ]; };
    return StompRPCService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { StompRService, StompService, StompState, StompConfig, StompRPCService };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAtci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLmNvbmZpZy50cyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9zdG9tcC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLXJwYy5zZXJ2aWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcnN0LCBmaWx0ZXIsIHNoYXJlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0ICwgIE9ic2VydmFibGUgLCAgT2JzZXJ2ZXIgLCAgU3ViamVjdCAsICBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgU3RvbXBDb25maWcgfSBmcm9tICcuL3N0b21wLmNvbmZpZyc7XG5cbmltcG9ydCAqIGFzIFN0b21wIGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcbmltcG9ydCB7IEZyYW1lLCBTdG9tcFN1YnNjcmlwdGlvbiB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJy4vc3RvbXAtaGVhZGVycyc7XG5pbXBvcnQgeyBTdG9tcFN0YXRlIH0gZnJvbSAnLi9zdG9tcC1zdGF0ZSc7XG5cbi8qKlxuICogQW5ndWxhcjIgU1RPTVAgUmF3IFNlcnZpY2UgdXNpbmcgQHN0b21wL3N0b21wLmpzXG4gKlxuICogWW91IHdpbGwgb25seSBuZWVkIHRoZSBwdWJsaWMgcHJvcGVydGllcyBhbmRcbiAqIG1ldGhvZHMgbGlzdGVkIHVubGVzcyB5b3UgYXJlIGFuIGFkdmFuY2VkIHVzZXIuIFRoaXMgc2VydmljZSBoYW5kbGVzIHN1YnNjcmliaW5nIHRvIGFcbiAqIG1lc3NhZ2UgcXVldWUgdXNpbmcgdGhlIHN0b21wLmpzIGxpYnJhcnksIGFuZCByZXR1cm5zXG4gKiB2YWx1ZXMgdmlhIHRoZSBFUzYgT2JzZXJ2YWJsZSBzcGVjaWZpY2F0aW9uIGZvclxuICogYXN5bmNocm9ub3VzIHZhbHVlIHN0cmVhbWluZyBieSB3aXJpbmcgdGhlIFNUT01QXG4gKiBtZXNzYWdlcyBpbnRvIGFuIG9ic2VydmFibGUuXG4gKlxuICogSWYgeW91IHdpbGwgbGlrZSB0byBwYXNzIHRoZSBjb25maWd1cmF0aW9uIGFzIGEgZGVwZW5kZW5jeSxcbiAqIHBsZWFzZSB1c2UgU3RvbXBTZXJ2aWNlIGNsYXNzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSU2VydmljZSB7XG4gIC8qKlxuICAgKiBTdGF0ZSBvZiB0aGUgU1RPTVBTZXJ2aWNlXG4gICAqXG4gICAqIEl0IGlzIGEgQmVoYXZpb3JTdWJqZWN0IGFuZCB3aWxsIGVtaXQgY3VycmVudCBzdGF0dXMgaW1tZWRpYXRlbHkuIFRoaXMgd2lsbCB0eXBpY2FsbHkgZ2V0XG4gICAqIHVzZWQgdG8gc2hvdyBjdXJyZW50IHN0YXR1cyB0byB0aGUgZW5kIHVzZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGU6IEJlaGF2aW9yU3ViamVjdDxTdG9tcFN0YXRlPjtcblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZC4gVXNlIHRoaXMgdG8gY2Fycnkgb3V0IGluaXRpYWxpemF0aW9uLlxuICAgKiBJdCB3aWxsIHRyaWdnZXIgZXZlcnkgdGltZSBhIChyZSljb25uZWN0aW9uIG9jY3Vycy4gSWYgaXQgaXMgYWxyZWFkeSBjb25uZWN0ZWRcbiAgICogaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LiBZb3UgY2FuIHNhZmVseSBpZ25vcmUgdGhlIHZhbHVlLCBhcyBpdCB3aWxsIGFsd2F5cyBiZVxuICAgKiBTdG9tcFN0YXRlLkNPTk5FQ1RFRFxuICAgKi9cbiAgcHVibGljIGNvbm5lY3RPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFN0b21wU3RhdGU+O1xuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBoZWFkZXJzIGZyb20gbW9zdCByZWNlbnQgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyIGFzIHJldHVybiBieSB0aGUgQ09OTkVDVEVEXG4gICAqIGZyYW1lLlxuICAgKiBJZiB0aGUgU1RPTVAgY29ubmVjdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGVzdGFibGlzaGVkIGl0IHdpbGwgdHJpZ2dlciBpbW1lZGlhdGVseS5cbiAgICogSXQgd2lsbCBhZGRpdGlvbmFsbHkgdHJpZ2dlciBpbiBldmVudCBvZiByZWNvbm5lY3Rpb24sIHRoZSB2YWx1ZSB3aWxsIGJlIHNldCBvZiBoZWFkZXJzIGZyb21cbiAgICogdGhlIHJlY2VudCBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAqL1xuICBwdWJsaWMgc2VydmVySGVhZGVyc09ic2VydmFibGU6IE9ic2VydmFibGU8U3RvbXBIZWFkZXJzPjtcblxuICBwcml2YXRlIF9zZXJ2ZXJIZWFkZXJzQmVoYXZpb3VyU3ViamVjdDogQmVoYXZpb3JTdWJqZWN0PG51bGwgfCBTdG9tcEhlYWRlcnM+O1xuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIG1lc3NhZ2VzIHRvIHRoZSBkZWZhdWx0IHF1ZXVlIChhbnkgbWVzc2FnZSB0aGF0IGFyZSBub3QgaGFuZGxlZCBieSBhIHN1YnNjcmlwdGlvbilcbiAgICovXG4gIHB1YmxpYyBkZWZhdWx0TWVzc2FnZXNPYnNlcnZhYmxlOiBTdWJqZWN0PFN0b21wLk1lc3NhZ2U+O1xuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIHJlY2VpcHRzXG4gICAqL1xuICBwdWJsaWMgcmVjZWlwdHNPYnNlcnZhYmxlOiBTdWJqZWN0PFN0b21wLkZyYW1lPjtcblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gYW4gZXJyb3Igb2NjdXJzLiBUaGlzIFN1YmplY3QgY2FuIGJlIHVzZWQgdG8gaGFuZGxlIGVycm9ycyBmcm9tXG4gICAqIHRoZSBzdG9tcCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgZXJyb3JTdWJqZWN0OiBTdWJqZWN0PHN0cmluZyB8IFN0b21wLk1lc3NhZ2U+O1xuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBhcnJheSB0byBob2xkIGxvY2FsbHkgcXVldWVkIG1lc3NhZ2VzIHdoZW4gU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgcXVldWVkTWVzc2FnZXM6IHsgcXVldWVOYW1lOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzIH1bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jb25maWc6IFN0b21wQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBTVE9NUCBDbGllbnQgZnJvbSBAc3RvbXAvc3RvbXAuanNcbiAgICovXG4gIHByb3RlY3RlZCBjbGllbnQ6IFN0b21wLkNsaWVudDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogU2VlIFJFQURNRSBhbmQgc2FtcGxlcyBmb3IgY29uZmlndXJhdGlvbiBleGFtcGxlc1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+KFN0b21wU3RhdGUuQ0xPU0VEKTtcblxuICAgIHRoaXMuY29ubmVjdE9ic2VydmFibGUgPSB0aGlzLnN0YXRlLnBpcGUoXG4gICAgICBmaWx0ZXIoKGN1cnJlbnRTdGF0ZTogU3RvbXBTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gY3VycmVudFN0YXRlID09PSBTdG9tcFN0YXRlLkNPTk5FQ1RFRDtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIFNldHVwIHNlbmRpbmcgcXVldWVkTWVzc2FnZXNcbiAgICB0aGlzLmNvbm5lY3RPYnNlcnZhYmxlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNlbmRRdWV1ZWRNZXNzYWdlcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VydmVySGVhZGVyc0JlaGF2aW91clN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bGwgfCBTdG9tcEhlYWRlcnM+KG51bGwpO1xuXG4gICAgdGhpcy5zZXJ2ZXJIZWFkZXJzT2JzZXJ2YWJsZSA9IHRoaXMuX3NlcnZlckhlYWRlcnNCZWhhdmlvdXJTdWJqZWN0LnBpcGUoXG4gICAgICBmaWx0ZXIoKGhlYWRlcnM6IG51bGwgfCBTdG9tcEhlYWRlcnMpID0+IHtcbiAgICAgICAgcmV0dXJuIGhlYWRlcnMgIT09IG51bGw7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLmVycm9yU3ViamVjdCA9IG5ldyBTdWJqZWN0KCk7XG4gIH1cblxuICAvKiogU2V0IGNvbmZpZ3VyYXRpb24gKi9cbiAgc2V0IGNvbmZpZyh2YWx1ZTogU3RvbXBDb25maWcpIHtcbiAgICB0aGlzLl9jb25maWcgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBJdCB3aWxsIGluaXRpYWxpemUgU1RPTVAgQ2xpZW50LiAqL1xuICBwcm90ZWN0ZWQgaW5pdFN0b21wQ2xpZW50KCk6IHZvaWQge1xuICAgIC8vIGRpc2Nvbm5lY3QgaWYgY29ubmVjdGVkXG4gICAgdGhpcy5kaXNjb25uZWN0KCk7XG5cbiAgICAvLyB1cmwgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHNvY2tldEZuXG4gICAgaWYgKHR5cGVvZih0aGlzLl9jb25maWcudXJsKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuY2xpZW50ID0gU3RvbXAuY2xpZW50KHRoaXMuX2NvbmZpZy51cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsaWVudCA9IFN0b21wLm92ZXIodGhpcy5fY29uZmlnLnVybCk7XG4gICAgfVxuXG4gICAgLy8gQ29uZmlndXJlIGNsaWVudCBoZWFydC1iZWF0aW5nXG4gICAgdGhpcy5jbGllbnQuaGVhcnRiZWF0LmluY29taW5nID0gdGhpcy5fY29uZmlnLmhlYXJ0YmVhdF9pbjtcbiAgICB0aGlzLmNsaWVudC5oZWFydGJlYXQub3V0Z29pbmcgPSB0aGlzLl9jb25maWcuaGVhcnRiZWF0X291dDtcblxuICAgIC8vIEF1dG8gcmVjb25uZWN0XG4gICAgdGhpcy5jbGllbnQucmVjb25uZWN0X2RlbGF5ID0gdGhpcy5fY29uZmlnLnJlY29ubmVjdF9kZWxheTtcblxuICAgIGlmICghdGhpcy5fY29uZmlnLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnID0gZnVuY3Rpb24gKCkge1xuICAgICAgfTtcbiAgICB9XG4gICAgLy8gU2V0IGZ1bmN0aW9uIHRvIGRlYnVnIHByaW50IG1lc3NhZ2VzXG4gICAgdGhpcy5jbGllbnQuZGVidWcgPSB0aGlzLmRlYnVnO1xuXG4gICAgLy8gRGVmYXVsdCBtZXNzYWdlc1xuICAgIHRoaXMuc2V0dXBPblJlY2VpdmUoKTtcblxuICAgIC8vIFJlY2VpcHRzXG4gICAgdGhpcy5zZXR1cFJlY2VpcHRzKCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGNvbm5lY3QgdG8gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBpbml0QW5kQ29ubmVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRTdG9tcENsaWVudCgpO1xuXG4gICAgaWYgKCF0aGlzLl9jb25maWcuaGVhZGVycykge1xuICAgICAgdGhpcy5fY29uZmlnLmhlYWRlcnMgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBBdHRlbXB0IGNvbm5lY3Rpb24sIHBhc3NpbmcgaW4gYSBjYWxsYmFja1xuICAgIHRoaXMuY2xpZW50LmNvbm5lY3QoXG4gICAgICB0aGlzLl9jb25maWcuaGVhZGVycyxcbiAgICAgIHRoaXMub25fY29ubmVjdCxcbiAgICAgIHRoaXMub25fZXJyb3JcbiAgICApO1xuXG4gICAgdGhpcy5kZWJ1ZygnQ29ubmVjdGluZy4uLicpO1xuICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLlRSWUlORyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGRpc2Nvbm5lY3QgZnJvbSB0aGUgU1RPTVAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGRpc2Nvbm5lY3QoKTogdm9pZCB7XG5cbiAgICAvLyBEaXNjb25uZWN0IGlmIGNvbm5lY3RlZC4gQ2FsbGJhY2sgd2lsbCBzZXQgQ0xPU0VEIHN0YXRlXG4gICAgaWYgKHRoaXMuY2xpZW50KSB7XG4gICAgICBpZiAoIXRoaXMuY2xpZW50LmNvbm5lY3RlZCkge1xuICAgICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLkNMT1NFRCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gTm90aWZ5IG9ic2VydmVycyB0aGF0IHdlIGFyZSBkaXNjb25uZWN0aW5nIVxuICAgICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuRElTQ09OTkVDVElORyk7XG5cbiAgICAgIHRoaXMuY2xpZW50LmRpc2Nvbm5lY3QoXG4gICAgICAgICgpID0+IHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLkNMT1NFRClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgcmV0dXJuIGB0cnVlYCBpZiBTVE9NUCBicm9rZXIgaXMgY29ubmVjdGVkIGFuZCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIHB1YmxpYyBjb25uZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZ2V0VmFsdWUoKSA9PT0gU3RvbXBTdGF0ZS5DT05ORUNURUQ7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBzZW5kIGEgbWVzc2FnZSB0byBhIG5hbWVkIGRlc3RpbmF0aW9uLiBUaGUgbWVzc2FnZSBtdXN0IGJlIGBzdHJpbmdgLlxuICAgKlxuICAgKiBUaGUgbWVzc2FnZSB3aWxsIGdldCBsb2NhbGx5IHF1ZXVlZCBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuIEl0IHdpbGwgYXR0ZW1wdCB0b1xuICAgKiBwdWJsaXNoIHF1ZXVlZCBtZXNzYWdlcyBhcyBzb29uIGFzIHRoZSBicm9rZXIgZ2V0cyBjb25uZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBxdWV1ZU5hbWVcbiAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICogQHBhcmFtIGhlYWRlcnNcbiAgICovXG4gIHB1YmxpYyBwdWJsaXNoKHF1ZXVlTmFtZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGhlYWRlcnM6IFN0b21wSGVhZGVycyA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGVkKCkpIHtcbiAgICAgIHRoaXMuY2xpZW50LnNlbmQocXVldWVOYW1lLCBoZWFkZXJzLCBtZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWJ1ZyhgTm90IGNvbm5lY3RlZCwgcXVldWVpbmcgJHttZXNzYWdlfWApO1xuICAgICAgdGhpcy5xdWV1ZWRNZXNzYWdlcy5wdXNoKHtxdWV1ZU5hbWU6IDxzdHJpbmc+cXVldWVOYW1lLCBtZXNzYWdlOiA8c3RyaW5nPm1lc3NhZ2UsIGhlYWRlcnM6IGhlYWRlcnN9KTtcbiAgICB9XG4gIH1cblxuICAvKiogSXQgd2lsbCBzZW5kIHF1ZXVlZCBtZXNzYWdlcy4gKi9cbiAgcHJvdGVjdGVkIHNlbmRRdWV1ZWRNZXNzYWdlcygpOiB2b2lkIHtcbiAgICBjb25zdCBxdWV1ZWRNZXNzYWdlcyA9IHRoaXMucXVldWVkTWVzc2FnZXM7XG4gICAgdGhpcy5xdWV1ZWRNZXNzYWdlcyA9IFtdO1xuXG4gICAgdGhpcy5kZWJ1ZyhgV2lsbCB0cnkgc2VuZGluZyBxdWV1ZWQgbWVzc2FnZXMgJHtxdWV1ZWRNZXNzYWdlc31gKTtcblxuICAgIGZvciAoY29uc3QgcXVldWVkTWVzc2FnZSBvZiBxdWV1ZWRNZXNzYWdlcykge1xuICAgICAgdGhpcy5kZWJ1ZyhgQXR0ZW1wdGluZyB0byBzZW5kICR7cXVldWVkTWVzc2FnZX1gKTtcbiAgICAgIHRoaXMucHVibGlzaChxdWV1ZWRNZXNzYWdlLnF1ZXVlTmFtZSwgcXVldWVkTWVzc2FnZS5tZXNzYWdlLCBxdWV1ZWRNZXNzYWdlLmhlYWRlcnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHN1YnNjcmliZSB0byBzZXJ2ZXIgbWVzc2FnZSBxdWV1ZXNcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHNhZmVseSBjYWxsZWQgZXZlbiBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuXG4gICAqIElmIHRoZSB1bmRlcmx5aW5nIFNUT01QIGNvbm5lY3Rpb24gZHJvcHMgYW5kIHJlY29ubmVjdHMsIGl0IHdpbGwgcmVzdWJzY3JpYmUgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogSWYgYSBoZWFkZXIgZmllbGQgJ2FjaycgaXMgbm90IGV4cGxpY2l0bHkgcGFzc2VkLCAnYWNrJyB3aWxsIGJlIHNldCB0byAnYXV0bycuIElmIHlvdVxuICAgKiBkbyBub3QgdW5kZXJzdGFuZCB3aGF0IGl0IG1lYW5zLCBwbGVhc2UgbGVhdmUgaXQgYXMgaXMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB3aGVuIHdvcmtpbmcgd2l0aCB0ZW1wb3JhcnkgcXVldWVzIHdoZXJlIHRoZSBzdWJzY3JpcHRpb24gcmVxdWVzdFxuICAgKiBjcmVhdGVzIHRoZVxuICAgKiB1bmRlcmx5aW5nIHF1ZXVlLCBtc3NhZ2VzIG1pZ2h0IGJlIG1pc3NlZCBkdXJpbmcgcmVjb25uZWN0LiBUaGlzIGlzc3VlIGlzIG5vdCBzcGVjaWZpY1xuICAgKiB0byB0aGlzIGxpYnJhcnkgYnV0IHRoZSB3YXkgU1RPTVAgYnJva2VycyBhcmUgZGVzaWduZWQgdG8gd29yay5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHN1YnNjcmliZShxdWV1ZU5hbWU6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pOiBPYnNlcnZhYmxlPFN0b21wLk1lc3NhZ2U+IHtcblxuICAgIC8qIFdlbGwgdGhlIGxvZ2ljIGlzIGNvbXBsaWNhdGVkIGJ1dCB3b3JrcyBiZWF1dGlmdWxseS4gUnhKUyBpcyBpbmRlZWQgd29uZGVyZnVsLlxuICAgICAqXG4gICAgICogV2UgbmVlZCB0byBhY3RpdmF0ZSB0aGUgdW5kZXJseWluZyBzdWJzY3JpcHRpb24gaW1tZWRpYXRlbHkgaWYgU3RvbXAgaXMgY29ubmVjdGVkLiBJZiBub3QgaXQgc2hvdWxkXG4gICAgICogc3Vic2NyaWJlIHdoZW4gaXQgZ2V0cyBuZXh0IGNvbm5lY3RlZC4gRnVydGhlciBpdCBzaG91bGQgcmUgZXN0YWJsaXNoIHRoZSBzdWJzY3JpcHRpb24gd2hlbmV2ZXIgU3RvbXBcbiAgICAgKiBzdWNjZXNzZnVsbHkgcmVjb25uZWN0cy5cbiAgICAgKlxuICAgICAqIEFjdHVhbCBpbXBsZW1lbnRhdGlvbiBpcyBzaW1wbGUsIHdlIGZpbHRlciB0aGUgQmVoYXZpb3VyU3ViamVjdCAnc3RhdGUnIHNvIHRoYXQgd2UgY2FuIHRyaWdnZXIgd2hlbmV2ZXIgU3RvbXAgaXNcbiAgICAgKiBjb25uZWN0ZWQuIFNpbmNlICdzdGF0ZScgaXMgYSBCZWhhdmlvdXJTdWJqZWN0LCBpZiBTdG9tcCBpcyBhbHJlYWR5IGNvbm5lY3RlZCwgaXQgd2lsbCBpbW1lZGlhdGVseSB0cmlnZ2VyLlxuICAgICAqXG4gICAgICogVGhlIG9ic2VydmFibGUgdGhhdCB3ZSByZXR1cm4gdG8gY2FsbGVyIHJlbWFpbnMgc2FtZSBhY3Jvc3MgYWxsIHJlY29ubmVjdHMsIHNvIG5vIHNwZWNpYWwgaGFuZGxpbmcgbmVlZGVkIGF0XG4gICAgICogdGhlIG1lc3NhZ2Ugc3Vic2NyaWJlci5cbiAgICAgKi9cbiAgICB0aGlzLmRlYnVnKGBSZXF1ZXN0IHRvIHN1YnNjcmliZSAke3F1ZXVlTmFtZX1gKTtcblxuICAgIC8vIEJ5IGRlZmF1bHQgYXV0byBhY2tub3dsZWRnZW1lbnQgb2YgbWVzc2FnZXNcbiAgICBpZiAoIWhlYWRlcnNbJ2FjayddKSB7XG4gICAgICBoZWFkZXJzWydhY2snXSA9ICdhdXRvJztcbiAgICB9XG5cbiAgICBjb25zdCBjb2xkT2JzZXJ2YWJsZSA9IE9ic2VydmFibGUuY3JlYXRlKFxuICAgICAgKG1lc3NhZ2VzOiBPYnNlcnZlcjxTdG9tcC5NZXNzYWdlPikgPT4ge1xuICAgICAgICAvKlxuICAgICAgICAgKiBUaGVzZSB2YXJpYWJsZXMgd2lsbCBiZSB1c2VkIGFzIHBhcnQgb2YgdGhlIGNsb3N1cmUgYW5kIHdvcmsgdGhlaXIgbWFnaWMgZHVyaW5nIHVuc3Vic2NyaWJlXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgc3RvbXBTdWJzY3JpcHRpb246IFN0b21wU3Vic2NyaXB0aW9uO1xuXG4gICAgICAgIGxldCBzdG9tcENvbm5lY3RlZFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgICAgIHN0b21wQ29ubmVjdGVkU3Vic2NyaXB0aW9uID0gdGhpcy5jb25uZWN0T2JzZXJ2YWJsZVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgV2lsbCBzdWJzY3JpYmUgdG8gJHtxdWV1ZU5hbWV9YCk7XG4gICAgICAgICAgICBzdG9tcFN1YnNjcmlwdGlvbiA9IHRoaXMuY2xpZW50LnN1YnNjcmliZShxdWV1ZU5hbWUsIChtZXNzYWdlOiBTdG9tcC5NZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMubmV4dChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaGVhZGVycyk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHsgLyogY2xlYW51cCBmdW5jdGlvbiwgd2lsbCBiZSBjYWxsZWQgd2hlbiBubyBzdWJzY3JpYmVycyBhcmUgbGVmdCAqL1xuICAgICAgICAgIHRoaXMuZGVidWcoYFN0b3Agd2F0Y2hpbmcgY29ubmVjdGlvbiBzdGF0ZSAoZm9yICR7cXVldWVOYW1lfSlgKTtcbiAgICAgICAgICBzdG9tcENvbm5lY3RlZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZ2V0VmFsdWUoKSA9PT0gU3RvbXBTdGF0ZS5DT05ORUNURUQpIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFdpbGwgdW5zdWJzY3JpYmUgZnJvbSAke3F1ZXVlTmFtZX0gYXQgU3RvbXBgKTtcbiAgICAgICAgICAgIHN0b21wU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFN0b21wIG5vdCBjb25uZWN0ZWQsIG5vIG5lZWQgdG8gdW5zdWJzY3JpYmUgZnJvbSAke3F1ZXVlTmFtZX0gYXQgU3RvbXBgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEltcG9ydGFudCAtIGNvbnZlcnQgaXQgdG8gaG90IE9ic2VydmFibGUgLSBvdGhlcndpc2UsIGlmIHRoZSB1c2VyIGNvZGUgc3Vic2NyaWJlc1xuICAgICAqIHRvIHRoaXMgb2JzZXJ2YWJsZSB0d2ljZSwgaXQgd2lsbCBzdWJzY3JpYmUgdHdpY2UgdG8gU3RvbXAgYnJva2VyLiAoVGhpcyB3YXMgaGFwcGVuaW5nIGluIHRoZSBjdXJyZW50IGV4YW1wbGUpLlxuICAgICAqIEEgbG9uZyBidXQgZ29vZCBleHBsYW5hdG9yeSBhcnRpY2xlIGF0IGh0dHBzOi8vbWVkaXVtLmNvbS9AYmVubGVzaC9ob3QtdnMtY29sZC1vYnNlcnZhYmxlcy1mODA5NGVkNTMzMzlcbiAgICAgKi9cbiAgICByZXR1cm4gY29sZE9ic2VydmFibGUucGlwZShzaGFyZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGhhbmRsZSBtZXNzYWdlcyByZWNlaXZlZCBpbiB0aGUgZGVmYXVsdCBxdWV1ZS4gTWVzc2FnZXMgdGhhdCB3b3VsZCBub3QgYmUgaGFuZGxlZCBvdGhlcndpc2VcbiAgICogZ2V0IGRlbGl2ZXJlZCB0byB0aGUgZGVmYXVsdCBxdWV1ZS5cbiAgICovXG4gIHByb3RlY3RlZCBzZXR1cE9uUmVjZWl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlZmF1bHRNZXNzYWdlc09ic2VydmFibGUgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgdGhpcy5jbGllbnQub25yZWNlaXZlID0gKG1lc3NhZ2U6IFN0b21wLk1lc3NhZ2UpID0+IHtcbiAgICAgIHRoaXMuZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZS5uZXh0KG1lc3NhZ2UpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBlbWl0IGFsbCByZWNlaXB0cy5cbiAgICovXG4gIHByb3RlY3RlZCBzZXR1cFJlY2VpcHRzKCk6IHZvaWQge1xuICAgIHRoaXMucmVjZWlwdHNPYnNlcnZhYmxlID0gbmV3IFN1YmplY3QoKTtcblxuICAgIHRoaXMuY2xpZW50Lm9ucmVjZWlwdCA9IChmcmFtZTogU3RvbXAuRnJhbWUpID0+IHtcbiAgICAgIHRoaXMucmVjZWlwdHNPYnNlcnZhYmxlLm5leHQoZnJhbWUpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogV2FpdCBmb3IgcmVjZWlwdCwgdGhpcyBpbmRpY2F0ZXMgdGhhdCBzZXJ2ZXIgaGFzIGNhcnJpZWQgb3V0IHRoZSByZWxhdGVkIG9wZXJhdGlvblxuICAgKi9cbiAgcHVibGljIHdhaXRGb3JSZWNlaXB0KHJlY2VpcHRJZDogc3RyaW5nLCBjYWxsYmFjazogKGZyYW1lOiBTdG9tcC5GcmFtZSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMucmVjZWlwdHNPYnNlcnZhYmxlLnBpcGUoXG4gICAgICBmaWx0ZXIoKGZyYW1lOiBTdG9tcC5GcmFtZSkgPT4ge1xuICAgICAgICByZXR1cm4gZnJhbWUuaGVhZGVyc1sncmVjZWlwdC1pZCddID09PSByZWNlaXB0SWQ7XG4gICAgICB9KSxcbiAgICAgIGZpcnN0KClcbiAgICApLnN1YnNjcmliZSgoZnJhbWU6IFN0b21wLkZyYW1lKSA9PiB7XG4gICAgICBjYWxsYmFjayhmcmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgRnVuY3Rpb25zXG4gICAqXG4gICAqIE5vdGUgdGhlIG1ldGhvZCBzaWduYXR1cmU6ICgpID0+IHByZXNlcnZlcyBsZXhpY2FsIHNjb3BlXG4gICAqIGlmIHdlIG5lZWQgdG8gdXNlIHRoaXMueCBpbnNpZGUgdGhlIGZ1bmN0aW9uXG4gICAqL1xuICBwcm90ZWN0ZWQgZGVidWcgPSAoYXJnczogYW55KTogdm9pZCA9PiB7XG4gICAgY29uc29sZS5sb2cobmV3IERhdGUoKSwgYXJncyk7XG4gIH1cblxuICAvKiogQ2FsbGJhY2sgcnVuIG9uIHN1Y2Nlc3NmdWxseSBjb25uZWN0aW5nIHRvIHNlcnZlciAqL1xuICBwcm90ZWN0ZWQgb25fY29ubmVjdCA9IChmcmFtZTogRnJhbWUpID0+IHtcblxuICAgIHRoaXMuZGVidWcoJ0Nvbm5lY3RlZCcpO1xuXG4gICAgdGhpcy5fc2VydmVySGVhZGVyc0JlaGF2aW91clN1YmplY3QubmV4dChmcmFtZS5oZWFkZXJzKTtcblxuICAgIC8vIEluZGljYXRlIG91ciBjb25uZWN0ZWQgc3RhdGUgdG8gb2JzZXJ2ZXJzXG4gICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuQ09OTkVDVEVEKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgZXJyb3JzIGZyb20gc3RvbXAuanMgKi9cbiAgcHJvdGVjdGVkIG9uX2Vycm9yID0gKGVycm9yOiBzdHJpbmcgfCBTdG9tcC5NZXNzYWdlKSA9PiB7XG5cbiAgICAvLyBUcmlnZ2VyIHRoZSBlcnJvciBzdWJqZWN0XG4gICAgdGhpcy5lcnJvclN1YmplY3QubmV4dChlcnJvcik7XG5cbiAgICBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0Jykge1xuICAgICAgZXJyb3IgPSAoPFN0b21wLk1lc3NhZ2U+ZXJyb3IpLmJvZHk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1ZyhgRXJyb3I6ICR7ZXJyb3J9YCk7XG5cbiAgICAvLyBDaGVjayBmb3IgZHJvcHBlZCBjb25uZWN0aW9uIGFuZCB0cnkgcmVjb25uZWN0aW5nXG4gICAgaWYgKCF0aGlzLmNsaWVudC5jb25uZWN0ZWQpIHtcbiAgICAgIC8vIFJlc2V0IHN0YXRlIGluZGljYXRvclxuICAgICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuQ0xPU0VEKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJy4vc3RvbXAtaGVhZGVycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4vKipcbiAqIFJlcHJlc2VudHMgYSBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlXG4gKiBTVE9NUFNlcnZpY2UgdG8gY29ubmVjdCB0by5cbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBDb25maWcge1xuICAvKipcbiAgICogU2VydmVyIFVSTCB0byBjb25uZWN0IHRvLiBQbGVhc2UgcmVmZXIgdG8geW91ciBTVE9NUCBicm9rZXIgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscy5cbiAgICpcbiAgICogRXhhbXBsZTogd3M6Ly8xMjcuMC4wLjE6MTU2NzQvd3MgKGZvciBhIFJhYmJpdE1RIGRlZmF1bHQgc2V0dXAgcnVubmluZyBvbiBsb2NhbGhvc3QpXG4gICAqXG4gICAqIEFsdGVybmF0aXZlbHkgdGhpcyBwYXJhbWV0ZXIgY2FuIGJlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIG9iamVjdCBzaW1pbGFyIHRvIFdlYlNvY2tldFxuICAgKiAodHlwaWNhbGx5IFNvY2tKUyBpbnN0YW5jZSkuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqICgpID0+IHtcbiAgICogICByZXR1cm4gbmV3IFNvY2tKUygnaHR0cDovLzEyNy4wLjAuMToxNTY3NC9zdG9tcCcpO1xuICAgKiB9XG4gICAqL1xuICB1cmw6IHN0cmluZyB8ICgoKSA9PiBhbnkpO1xuXG4gIC8qKlxuICAgKiBIZWFkZXJzXG4gICAqIFR5cGljYWwga2V5czogbG9naW46IHN0cmluZywgcGFzc2NvZGU6IHN0cmluZy5cbiAgICogaG9zdDpzdHJpbmcgd2lsbCBuZWVlZCB0byBiZSBwYXNzZWQgZm9yIHZpcnR1YWwgaG9zdHMgaW4gUmFiYml0TVFcbiAgICovXG4gIGhlYWRlcnM6IFN0b21wSGVhZGVycztcblxuICAvKiogSG93IG9mdGVuIHRvIGluY29taW5nIGhlYXJ0YmVhdD9cbiAgICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLCBzZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgMCAtIGRpc2FibGVkXG4gICAqL1xuICBoZWFydGJlYXRfaW46IG51bWJlcjtcblxuICAvKipcbiAgICogSG93IG9mdGVuIHRvIG91dGdvaW5nIGhlYXJ0YmVhdD9cbiAgICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLCBzZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgMjAwMDAgLSBldmVyeSAyMCBzZWNvbmRzXG4gICAqL1xuICBoZWFydGJlYXRfb3V0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdhaXQgaW4gbWlsbGlzZWNvbmRzIGJlZm9yZSBhdHRlbXB0aW5nIGF1dG8gcmVjb25uZWN0XG4gICAqIFNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSA1MDAwICg1IHNlY29uZHMpXG4gICAqL1xuICByZWNvbm5lY3RfZGVsYXk6IG51bWJlcjtcblxuICAvKiogRW5hYmxlIGNsaWVudCBkZWJ1Z2dpbmc/ICovXG4gIGRlYnVnOiBib29sZWFuO1xufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTdG9tcENvbmZpZyB9IGZyb20gJy4vc3RvbXAuY29uZmlnJztcblxuaW1wb3J0IHsgU3RvbXBSU2VydmljZSB9IGZyb20gJy4vc3RvbXAtci5zZXJ2aWNlJztcblxuLyoqXG4gKiBBbmd1bGFyMiBTVE9NUCBTZXJ2aWNlIHVzaW5nIEBzdG9tcC9zdG9tcC5qc1xuICpcbiAqIEBkZXNjcmlwdGlvbiBUaGlzIHNlcnZpY2UgaGFuZGxlcyBzdWJzY3JpYmluZyB0byBhXG4gKiBtZXNzYWdlIHF1ZXVlIHVzaW5nIHRoZSBzdG9tcC5qcyBsaWJyYXJ5LCBhbmQgcmV0dXJuc1xuICogdmFsdWVzIHZpYSB0aGUgRVM2IE9ic2VydmFibGUgc3BlY2lmaWNhdGlvbiBmb3JcbiAqIGFzeW5jaHJvbm91cyB2YWx1ZSBzdHJlYW1pbmcgYnkgd2lyaW5nIHRoZSBTVE9NUFxuICogbWVzc2FnZXMgaW50byBhbiBvYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSB3YW50IHRvIG1hbnVhbGx5IGNvbmZpZ3VyZSBhbmQgaW5pdGlhbGl6ZSB0aGUgc2VydmljZVxuICogcGxlYXNlIHVzZSBTdG9tcFJTZXJ2aWNlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFNlcnZpY2UgZXh0ZW5kcyBTdG9tcFJTZXJ2aWNlIHtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogU2VlIFJFQURNRSBhbmQgc2FtcGxlcyBmb3IgY29uZmlndXJhdGlvbiBleGFtcGxlc1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogU3RvbXBDb25maWcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5pbml0QW5kQ29ubmVjdCgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdG9tcFNlcnZpY2UgfSBmcm9tICcuL3N0b21wLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICdhbmd1bGFyMi11dWlkJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSUENTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIHJlcGx5UXVldWUgPSAncnBjLXJlcGxpZXMnO1xuXG4gIHByb3RlY3RlZCBtZXNzYWdlc09ic2VydmFibGU6IFN1YmplY3Q8TWVzc2FnZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdG9tcFNlcnZpY2U6IFN0b21wU2VydmljZSkge1xuICAgIHRoaXMubWVzc2FnZXNPYnNlcnZhYmxlID0gdGhpcy5zdG9tcFNlcnZpY2UuZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHB1YmxpYyBycGMoc2VydmljZUVuZFBvaW50OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZyk6IE9ic2VydmFibGU8TWVzc2FnZT4ge1xuICAgIC8vIFdlIGtub3cgdGhlcmUgd2lsbCBiZSBvbmx5IG9uZSBtZXNzYWdlIGluIHJlcGx5XG4gICAgcmV0dXJuIHRoaXMuc3RyZWFtKHNlcnZpY2VFbmRQb2ludCwgcGF5bG9hZCkucGlwZShmaXJzdCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyZWFtKHNlcnZpY2VFbmRQb2ludDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jcmVhdGUoXG4gICAgICAocnBjT2JzZXJ2ZXI6IE9ic2VydmVyPE1lc3NhZ2U+KSA9PiB7XG4gICAgICAgIGxldCBkZWZhdWx0TWVzc2FnZXNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgICAgICBjb25zdCBjb3JyZWxhdGlvbklkID0gVVVJRC5VVUlEKCk7XG5cbiAgICAgICAgZGVmYXVsdE1lc3NhZ2VzU3Vic2NyaXB0aW9uID0gdGhpcy5tZXNzYWdlc09ic2VydmFibGUucGlwZShmaWx0ZXIoKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IHtcbiAgICAgICAgICByZXR1cm4gbWVzc2FnZS5oZWFkZXJzWydjb3JyZWxhdGlvbi1pZCddID09PSBjb3JyZWxhdGlvbklkO1xuICAgICAgICB9KSkuc3Vic2NyaWJlKChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgcnBjT2JzZXJ2ZXIubmV4dChtZXNzYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2VuZCBhbiBSUEMgcmVxdWVzdFxuICAgICAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgICAgICdyZXBseS10byc6IGAvdGVtcC1xdWV1ZS8ke3RoaXMucmVwbHlRdWV1ZX1gLFxuICAgICAgICAgICdjb3JyZWxhdGlvbi1pZCc6IGNvcnJlbGF0aW9uSWRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnN0b21wU2VydmljZS5wdWJsaXNoKHNlcnZpY2VFbmRQb2ludCwgcGF5bG9hZCwgaGVhZGVycyk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHsgLy8gQ2xlYW51cFxuICAgICAgICAgIGRlZmF1bHRNZXNzYWdlc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJTdG9tcC5jbGllbnQiLCJTdG9tcC5vdmVyIiwidHNsaWJfMS5fX3ZhbHVlcyIsInRzbGliXzEuX19leHRlbmRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhCQXdFOEYsRUFBRTs7Ozs7OztxQkE0UjVFLFVBQUMsSUFBUztZQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDL0I7Ozs7MEJBR3NCLFVBQUMsS0FBWTtZQUVsQyxLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcs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