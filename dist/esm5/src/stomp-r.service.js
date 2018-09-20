/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { first, filter, share } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as Stomp from '@stomp/stompjs';
import { StompState } from './stomp-state';
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
            this.client = Stomp.client(this._config.url);
        }
        else {
            this.client = Stomp.over(this._config.url);
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
            for (var queuedMessages_1 = tslib_1.__values(queuedMessages), queuedMessages_1_1 = queuedMessages_1.next(); !queuedMessages_1_1.done; queuedMessages_1_1 = queuedMessages_1.next()) {
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
export { StompRService };
function StompRService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StompRService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StompRService.ctorParameters;
    /**
     * State of the STOMPService
     *
     * It is a BehaviorSubject and will emit current status immediately. This will typically get
     * used to show current status to the end user.
     * @type {?}
     */
    StompRService.prototype.state;
    /**
     * Will trigger when connection is established. Use this to carry out initialization.
     * It will trigger every time a (re)connection occurs. If it is already connected
     * it will trigger immediately. You can safely ignore the value, as it will always be
     * StompState.CONNECTED
     * @type {?}
     */
    StompRService.prototype.connectObservable;
    /**
     * Provides headers from most recent connection to the server as return by the CONNECTED
     * frame.
     * If the STOMP connection has already been established it will trigger immediately.
     * It will additionally trigger in event of reconnection, the value will be set of headers from
     * the recent server response.
     * @type {?}
     */
    StompRService.prototype.serverHeadersObservable;
    /** @type {?} */
    StompRService.prototype._serverHeadersBehaviourSubject;
    /**
     * Will emit all messages to the default queue (any message that are not handled by a subscription)
     * @type {?}
     */
    StompRService.prototype.defaultMessagesObservable;
    /**
     * Will emit all receipts
     * @type {?}
     */
    StompRService.prototype.receiptsObservable;
    /**
     * Will trigger when an error occurs. This Subject can be used to handle errors from
     * the stomp broker.
     * @type {?}
     */
    StompRService.prototype.errorSubject;
    /**
     * Internal array to hold locally queued messages when STOMP broker is not connected.
     * @type {?}
     */
    StompRService.prototype.queuedMessages;
    /**
     * Configuration
     * @type {?}
     */
    StompRService.prototype._config;
    /**
     * STOMP Client from \@stomp/stomp.js
     * @type {?}
     */
    StompRService.prototype.client;
    /**
     * Callback Functions
     *
     * Note the method signature: () => preserves lexical scope
     * if we need to use this.x inside the function
     * @type {?}
     */
    StompRService.prototype.debug;
    /**
     * Callback run on successfully connecting to server
     * @type {?}
     */
    StompRService.prototype.on_connect;
    /**
     * Handle errors from stomp.js
     * @type {?}
     */
    StompRService.prototype.on_error;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN0b21wL25nMi1zdG9tcGpzLyIsInNvdXJjZXMiOlsic3JjL3N0b21wLXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBSSxVQUFVLEVBQWdCLE9BQU8sRUFBa0IsTUFBTSxNQUFNLENBQUM7QUFJNUYsT0FBTyxLQUFLLEtBQUssTUFBTSxnQkFBZ0IsQ0FBQztBQUd4QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkErRG1ELEVBQUU7Ozs7Ozs7cUJBNFI1RSxVQUFDLElBQVM7WUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9COzs7OzBCQUdzQixVQUFDLEtBQVk7WUFFbEMsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV4QixLQUFJLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzs7WUFHeEQsQUFEQSw0Q0FBNEM7WUFDNUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDOzs7O3dCQUdvQixVQUFDLEtBQTZCOztZQUdqRCxBQURBLDRCQUE0QjtZQUM1QixLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU5QixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixLQUFLLEdBQUcsbUJBQWdCLEtBQUss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QztRQUxDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBRS9DLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLFVBQUMsT0FBc0I7WUFDN0MsS0FBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QyxDQUFDO0tBQ0g7SUFFRDs7T0FFRzs7Ozs7SUFDTyxxQ0FBYTs7OztJQUF2QjtRQUFBLGlCQU1DO1FBTEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFFeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsVUFBQyxLQUFrQjtZQUN6QyxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JDLENBQUM7S0FDSDs7Ozs7OztJQUtNLHNDQUFjOzs7Ozs7Y0FBQyxTQUFpQixFQUFFLFFBQXNDO1FBQzdFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQzFCLE1BQU0sQ0FBQyxVQUFDLEtBQWtCO1lBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsQ0FBQztTQUNsRCxDQUFDLEVBQ0YsS0FBSyxFQUFFLENBQ1IsQ0FBQyxTQUFTLENBQUMsVUFBQyxLQUFrQjtZQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakIsQ0FBQyxDQUFDOzs7Z0JBblVOLFVBQVU7Ozs7d0JBeEJYOztTQXlCYSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmlyc3QsIGZpbHRlciwgc2hhcmUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgLCAgT2JzZXJ2YWJsZSAsICBPYnNlcnZlciAsICBTdWJqZWN0ICwgIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBTdG9tcENvbmZpZyB9IGZyb20gJy4vc3RvbXAuY29uZmlnJztcblxuaW1wb3J0ICogYXMgU3RvbXAgZnJvbSAnQHN0b21wL3N0b21wanMnO1xuaW1wb3J0IHsgRnJhbWUsIFN0b21wU3Vic2NyaXB0aW9uIH0gZnJvbSAnQHN0b21wL3N0b21wanMnO1xuaW1wb3J0IHsgU3RvbXBIZWFkZXJzIH0gZnJvbSAnLi9zdG9tcC1oZWFkZXJzJztcbmltcG9ydCB7IFN0b21wU3RhdGUgfSBmcm9tICcuL3N0b21wLXN0YXRlJztcblxuLyoqXG4gKiBBbmd1bGFyMiBTVE9NUCBSYXcgU2VydmljZSB1c2luZyBAc3RvbXAvc3RvbXAuanNcbiAqXG4gKiBZb3Ugd2lsbCBvbmx5IG5lZWQgdGhlIHB1YmxpYyBwcm9wZXJ0aWVzIGFuZFxuICogbWV0aG9kcyBsaXN0ZWQgdW5sZXNzIHlvdSBhcmUgYW4gYWR2YW5jZWQgdXNlci4gVGhpcyBzZXJ2aWNlIGhhbmRsZXMgc3Vic2NyaWJpbmcgdG8gYVxuICogbWVzc2FnZSBxdWV1ZSB1c2luZyB0aGUgc3RvbXAuanMgbGlicmFyeSwgYW5kIHJldHVybnNcbiAqIHZhbHVlcyB2aWEgdGhlIEVTNiBPYnNlcnZhYmxlIHNwZWNpZmljYXRpb24gZm9yXG4gKiBhc3luY2hyb25vdXMgdmFsdWUgc3RyZWFtaW5nIGJ5IHdpcmluZyB0aGUgU1RPTVBcbiAqIG1lc3NhZ2VzIGludG8gYW4gb2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3Ugd2lsbCBsaWtlIHRvIHBhc3MgdGhlIGNvbmZpZ3VyYXRpb24gYXMgYSBkZXBlbmRlbmN5LFxuICogcGxlYXNlIHVzZSBTdG9tcFNlcnZpY2UgY2xhc3MuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFJTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIFN0YXRlIG9mIHRoZSBTVE9NUFNlcnZpY2VcbiAgICpcbiAgICogSXQgaXMgYSBCZWhhdmlvclN1YmplY3QgYW5kIHdpbGwgZW1pdCBjdXJyZW50IHN0YXR1cyBpbW1lZGlhdGVseS4gVGhpcyB3aWxsIHR5cGljYWxseSBnZXRcbiAgICogdXNlZCB0byBzaG93IGN1cnJlbnQgc3RhdHVzIHRvIHRoZSBlbmQgdXNlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0ZTogQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+O1xuXG4gIC8qKlxuICAgKiBXaWxsIHRyaWdnZXIgd2hlbiBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLiBVc2UgdGhpcyB0byBjYXJyeSBvdXQgaW5pdGlhbGl6YXRpb24uXG4gICAqIEl0IHdpbGwgdHJpZ2dlciBldmVyeSB0aW1lIGEgKHJlKWNvbm5lY3Rpb24gb2NjdXJzLiBJZiBpdCBpcyBhbHJlYWR5IGNvbm5lY3RlZFxuICAgKiBpdCB3aWxsIHRyaWdnZXIgaW1tZWRpYXRlbHkuIFlvdSBjYW4gc2FmZWx5IGlnbm9yZSB0aGUgdmFsdWUsIGFzIGl0IHdpbGwgYWx3YXlzIGJlXG4gICAqIFN0b21wU3RhdGUuQ09OTkVDVEVEXG4gICAqL1xuICBwdWJsaWMgY29ubmVjdE9ic2VydmFibGU6IE9ic2VydmFibGU8U3RvbXBTdGF0ZT47XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGhlYWRlcnMgZnJvbSBtb3N0IHJlY2VudCBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgYXMgcmV0dXJuIGJ5IHRoZSBDT05ORUNURURcbiAgICogZnJhbWUuXG4gICAqIElmIHRoZSBTVE9NUCBjb25uZWN0aW9uIGhhcyBhbHJlYWR5IGJlZW4gZXN0YWJsaXNoZWQgaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LlxuICAgKiBJdCB3aWxsIGFkZGl0aW9uYWxseSB0cmlnZ2VyIGluIGV2ZW50IG9mIHJlY29ubmVjdGlvbiwgdGhlIHZhbHVlIHdpbGwgYmUgc2V0IG9mIGhlYWRlcnMgZnJvbVxuICAgKiB0aGUgcmVjZW50IHNlcnZlciByZXNwb25zZS5cbiAgICovXG4gIHB1YmxpYyBzZXJ2ZXJIZWFkZXJzT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxTdG9tcEhlYWRlcnM+O1xuXG4gIHByaXZhdGUgX3NlcnZlckhlYWRlcnNCZWhhdmlvdXJTdWJqZWN0OiBCZWhhdmlvclN1YmplY3Q8bnVsbCB8IFN0b21wSGVhZGVycz47XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgbWVzc2FnZXMgdG8gdGhlIGRlZmF1bHQgcXVldWUgKGFueSBtZXNzYWdlIHRoYXQgYXJlIG5vdCBoYW5kbGVkIGJ5IGEgc3Vic2NyaXB0aW9uKVxuICAgKi9cbiAgcHVibGljIGRlZmF1bHRNZXNzYWdlc09ic2VydmFibGU6IFN1YmplY3Q8U3RvbXAuTWVzc2FnZT47XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgcmVjZWlwdHNcbiAgICovXG4gIHB1YmxpYyByZWNlaXB0c09ic2VydmFibGU6IFN1YmplY3Q8U3RvbXAuRnJhbWU+O1xuXG4gIC8qKlxuICAgKiBXaWxsIHRyaWdnZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMuIFRoaXMgU3ViamVjdCBjYW4gYmUgdXNlZCB0byBoYW5kbGUgZXJyb3JzIGZyb21cbiAgICogdGhlIHN0b21wIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBlcnJvclN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nIHwgU3RvbXAuTWVzc2FnZT47XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGFycmF5IHRvIGhvbGQgbG9jYWxseSBxdWV1ZWQgbWVzc2FnZXMgd2hlbiBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC5cbiAgICovXG4gIHByb3RlY3RlZCBxdWV1ZWRNZXNzYWdlczogeyBxdWV1ZU5hbWU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgfVtdID0gW107XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb25cbiAgICovXG4gIHByaXZhdGUgX2NvbmZpZzogU3RvbXBDb25maWc7XG5cbiAgLyoqXG4gICAqIFNUT01QIENsaWVudCBmcm9tIEBzdG9tcC9zdG9tcC5qc1xuICAgKi9cbiAgcHJvdGVjdGVkIGNsaWVudDogU3RvbXAuQ2xpZW50O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBTZWUgUkVBRE1FIGFuZCBzYW1wbGVzIGZvciBjb25maWd1cmF0aW9uIGV4YW1wbGVzXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U3RvbXBTdGF0ZT4oU3RvbXBTdGF0ZS5DTE9TRUQpO1xuXG4gICAgdGhpcy5jb25uZWN0T2JzZXJ2YWJsZSA9IHRoaXMuc3RhdGUucGlwZShcbiAgICAgIGZpbHRlcigoY3VycmVudFN0YXRlOiBTdG9tcFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBjdXJyZW50U3RhdGUgPT09IFN0b21wU3RhdGUuQ09OTkVDVEVEO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gU2V0dXAgc2VuZGluZyBxdWV1ZWRNZXNzYWdlc1xuICAgIHRoaXMuY29ubmVjdE9ic2VydmFibGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuc2VuZFF1ZXVlZE1lc3NhZ2VzKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZXJ2ZXJIZWFkZXJzQmVoYXZpb3VyU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVsbCB8IFN0b21wSGVhZGVycz4obnVsbCk7XG5cbiAgICB0aGlzLnNlcnZlckhlYWRlcnNPYnNlcnZhYmxlID0gdGhpcy5fc2VydmVySGVhZGVyc0JlaGF2aW91clN1YmplY3QucGlwZShcbiAgICAgIGZpbHRlcigoaGVhZGVyczogbnVsbCB8IFN0b21wSGVhZGVycykgPT4ge1xuICAgICAgICByZXR1cm4gaGVhZGVycyAhPT0gbnVsbDtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuZXJyb3JTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcbiAgfVxuXG4gIC8qKiBTZXQgY29uZmlndXJhdGlvbiAqL1xuICBzZXQgY29uZmlnKHZhbHVlOiBTdG9tcENvbmZpZykge1xuICAgIHRoaXMuX2NvbmZpZyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIEl0IHdpbGwgaW5pdGlhbGl6ZSBTVE9NUCBDbGllbnQuICovXG4gIHByb3RlY3RlZCBpbml0U3RvbXBDbGllbnQoKTogdm9pZCB7XG4gICAgLy8gZGlzY29ubmVjdCBpZiBjb25uZWN0ZWRcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcblxuICAgIC8vIHVybCB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgc29ja2V0Rm5cbiAgICBpZiAodHlwZW9mKHRoaXMuX2NvbmZpZy51cmwpID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5jbGllbnQgPSBTdG9tcC5jbGllbnQodGhpcy5fY29uZmlnLnVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xpZW50ID0gU3RvbXAub3Zlcih0aGlzLl9jb25maWcudXJsKTtcbiAgICB9XG5cbiAgICAvLyBDb25maWd1cmUgY2xpZW50IGhlYXJ0LWJlYXRpbmdcbiAgICB0aGlzLmNsaWVudC5oZWFydGJlYXQuaW5jb21pbmcgPSB0aGlzLl9jb25maWcuaGVhcnRiZWF0X2luO1xuICAgIHRoaXMuY2xpZW50LmhlYXJ0YmVhdC5vdXRnb2luZyA9IHRoaXMuX2NvbmZpZy5oZWFydGJlYXRfb3V0O1xuXG4gICAgLy8gQXV0byByZWNvbm5lY3RcbiAgICB0aGlzLmNsaWVudC5yZWNvbm5lY3RfZGVsYXkgPSB0aGlzLl9jb25maWcucmVjb25uZWN0X2RlbGF5O1xuXG4gICAgaWYgKCF0aGlzLl9jb25maWcuZGVidWcpIHtcbiAgICAgIHRoaXMuZGVidWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBTZXQgZnVuY3Rpb24gdG8gZGVidWcgcHJpbnQgbWVzc2FnZXNcbiAgICB0aGlzLmNsaWVudC5kZWJ1ZyA9IHRoaXMuZGVidWc7XG5cbiAgICAvLyBEZWZhdWx0IG1lc3NhZ2VzXG4gICAgdGhpcy5zZXR1cE9uUmVjZWl2ZSgpO1xuXG4gICAgLy8gUmVjZWlwdHNcbiAgICB0aGlzLnNldHVwUmVjZWlwdHMoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgY29ubmVjdCB0byB0aGUgU1RPTVAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGluaXRBbmRDb25uZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdFN0b21wQ2xpZW50KCk7XG5cbiAgICBpZiAoIXRoaXMuX2NvbmZpZy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLl9jb25maWcuaGVhZGVycyA9IHt9O1xuICAgIH1cblxuICAgIC8vIEF0dGVtcHQgY29ubmVjdGlvbiwgcGFzc2luZyBpbiBhIGNhbGxiYWNrXG4gICAgdGhpcy5jbGllbnQuY29ubmVjdChcbiAgICAgIHRoaXMuX2NvbmZpZy5oZWFkZXJzLFxuICAgICAgdGhpcy5vbl9jb25uZWN0LFxuICAgICAgdGhpcy5vbl9lcnJvclxuICAgICk7XG5cbiAgICB0aGlzLmRlYnVnKCdDb25uZWN0aW5nLi4uJyk7XG4gICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuVFJZSU5HKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgZGlzY29ubmVjdCgpOiB2b2lkIHtcblxuICAgIC8vIERpc2Nvbm5lY3QgaWYgY29ubmVjdGVkLiBDYWxsYmFjayB3aWxsIHNldCBDTE9TRUQgc3RhdGVcbiAgICBpZiAodGhpcy5jbGllbnQpIHtcbiAgICAgIGlmICghdGhpcy5jbGllbnQuY29ubmVjdGVkKSB7XG4gICAgICAgIC8vIE5vdGhpbmcgdG8gZG9cbiAgICAgICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuQ0xPU0VEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3RpZnkgb2JzZXJ2ZXJzIHRoYXQgd2UgYXJlIGRpc2Nvbm5lY3RpbmchXG4gICAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5ESVNDT05ORUNUSU5HKTtcblxuICAgICAgdGhpcy5jbGllbnQuZGlzY29ubmVjdChcbiAgICAgICAgKCkgPT4gdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuQ0xPU0VEKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCByZXR1cm4gYHRydWVgIGlmIFNUT01QIGJyb2tlciBpcyBjb25uZWN0ZWQgYW5kIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcHVibGljIGNvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5nZXRWYWx1ZSgpID09PSBTdG9tcFN0YXRlLkNPTk5FQ1RFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHNlbmQgYSBtZXNzYWdlIHRvIGEgbmFtZWQgZGVzdGluYXRpb24uIFRoZSBtZXNzYWdlIG11c3QgYmUgYHN0cmluZ2AuXG4gICAqXG4gICAqIFRoZSBtZXNzYWdlIHdpbGwgZ2V0IGxvY2FsbHkgcXVldWVkIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC4gSXQgd2lsbCBhdHRlbXB0IHRvXG4gICAqIHB1Ymxpc2ggcXVldWVkIG1lc3NhZ2VzIGFzIHNvb24gYXMgdGhlIGJyb2tlciBnZXRzIGNvbm5lY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHB1Ymxpc2gocXVldWVOYW1lOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb25uZWN0ZWQoKSkge1xuICAgICAgdGhpcy5jbGllbnQuc2VuZChxdWV1ZU5hbWUsIGhlYWRlcnMsIG1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlYnVnKGBOb3QgY29ubmVjdGVkLCBxdWV1ZWluZyAke21lc3NhZ2V9YCk7XG4gICAgICB0aGlzLnF1ZXVlZE1lc3NhZ2VzLnB1c2goe3F1ZXVlTmFtZTogPHN0cmluZz5xdWV1ZU5hbWUsIG1lc3NhZ2U6IDxzdHJpbmc+bWVzc2FnZSwgaGVhZGVyczogaGVhZGVyc30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJdCB3aWxsIHNlbmQgcXVldWVkIG1lc3NhZ2VzLiAqL1xuICBwcm90ZWN0ZWQgc2VuZFF1ZXVlZE1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIGNvbnN0IHF1ZXVlZE1lc3NhZ2VzID0gdGhpcy5xdWV1ZWRNZXNzYWdlcztcbiAgICB0aGlzLnF1ZXVlZE1lc3NhZ2VzID0gW107XG5cbiAgICB0aGlzLmRlYnVnKGBXaWxsIHRyeSBzZW5kaW5nIHF1ZXVlZCBtZXNzYWdlcyAke3F1ZXVlZE1lc3NhZ2VzfWApO1xuXG4gICAgZm9yIChjb25zdCBxdWV1ZWRNZXNzYWdlIG9mIHF1ZXVlZE1lc3NhZ2VzKSB7XG4gICAgICB0aGlzLmRlYnVnKGBBdHRlbXB0aW5nIHRvIHNlbmQgJHtxdWV1ZWRNZXNzYWdlfWApO1xuICAgICAgdGhpcy5wdWJsaXNoKHF1ZXVlZE1lc3NhZ2UucXVldWVOYW1lLCBxdWV1ZWRNZXNzYWdlLm1lc3NhZ2UsIHF1ZXVlZE1lc3NhZ2UuaGVhZGVycyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgc3Vic2NyaWJlIHRvIHNlcnZlciBtZXNzYWdlIHF1ZXVlc1xuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgc2FmZWx5IGNhbGxlZCBldmVuIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC5cbiAgICogSWYgdGhlIHVuZGVybHlpbmcgU1RPTVAgY29ubmVjdGlvbiBkcm9wcyBhbmQgcmVjb25uZWN0cywgaXQgd2lsbCByZXN1YnNjcmliZSBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBJZiBhIGhlYWRlciBmaWVsZCAnYWNrJyBpcyBub3QgZXhwbGljaXRseSBwYXNzZWQsICdhY2snIHdpbGwgYmUgc2V0IHRvICdhdXRvJy4gSWYgeW91XG4gICAqIGRvIG5vdCB1bmRlcnN0YW5kIHdoYXQgaXQgbWVhbnMsIHBsZWFzZSBsZWF2ZSBpdCBhcyBpcy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHdoZW4gd29ya2luZyB3aXRoIHRlbXBvcmFyeSBxdWV1ZXMgd2hlcmUgdGhlIHN1YnNjcmlwdGlvbiByZXF1ZXN0XG4gICAqIGNyZWF0ZXMgdGhlXG4gICAqIHVuZGVybHlpbmcgcXVldWUsIG1zc2FnZXMgbWlnaHQgYmUgbWlzc2VkIGR1cmluZyByZWNvbm5lY3QuIFRoaXMgaXNzdWUgaXMgbm90IHNwZWNpZmljXG4gICAqIHRvIHRoaXMgbGlicmFyeSBidXQgdGhlIHdheSBTVE9NUCBicm9rZXJzIGFyZSBkZXNpZ25lZCB0byB3b3JrLlxuICAgKlxuICAgKiBAcGFyYW0gcXVldWVOYW1lXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBwdWJsaWMgc3Vic2NyaWJlKHF1ZXVlTmFtZTogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fSk6IE9ic2VydmFibGU8U3RvbXAuTWVzc2FnZT4ge1xuXG4gICAgLyogV2VsbCB0aGUgbG9naWMgaXMgY29tcGxpY2F0ZWQgYnV0IHdvcmtzIGJlYXV0aWZ1bGx5LiBSeEpTIGlzIGluZGVlZCB3b25kZXJmdWwuXG4gICAgICpcbiAgICAgKiBXZSBuZWVkIHRvIGFjdGl2YXRlIHRoZSB1bmRlcmx5aW5nIHN1YnNjcmlwdGlvbiBpbW1lZGlhdGVseSBpZiBTdG9tcCBpcyBjb25uZWN0ZWQuIElmIG5vdCBpdCBzaG91bGRcbiAgICAgKiBzdWJzY3JpYmUgd2hlbiBpdCBnZXRzIG5leHQgY29ubmVjdGVkLiBGdXJ0aGVyIGl0IHNob3VsZCByZSBlc3RhYmxpc2ggdGhlIHN1YnNjcmlwdGlvbiB3aGVuZXZlciBTdG9tcFxuICAgICAqIHN1Y2Nlc3NmdWxseSByZWNvbm5lY3RzLlxuICAgICAqXG4gICAgICogQWN0dWFsIGltcGxlbWVudGF0aW9uIGlzIHNpbXBsZSwgd2UgZmlsdGVyIHRoZSBCZWhhdmlvdXJTdWJqZWN0ICdzdGF0ZScgc28gdGhhdCB3ZSBjYW4gdHJpZ2dlciB3aGVuZXZlciBTdG9tcCBpc1xuICAgICAqIGNvbm5lY3RlZC4gU2luY2UgJ3N0YXRlJyBpcyBhIEJlaGF2aW91clN1YmplY3QsIGlmIFN0b21wIGlzIGFscmVhZHkgY29ubmVjdGVkLCBpdCB3aWxsIGltbWVkaWF0ZWx5IHRyaWdnZXIuXG4gICAgICpcbiAgICAgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IHdlIHJldHVybiB0byBjYWxsZXIgcmVtYWlucyBzYW1lIGFjcm9zcyBhbGwgcmVjb25uZWN0cywgc28gbm8gc3BlY2lhbCBoYW5kbGluZyBuZWVkZWQgYXRcbiAgICAgKiB0aGUgbWVzc2FnZSBzdWJzY3JpYmVyLlxuICAgICAqL1xuICAgIHRoaXMuZGVidWcoYFJlcXVlc3QgdG8gc3Vic2NyaWJlICR7cXVldWVOYW1lfWApO1xuXG4gICAgLy8gQnkgZGVmYXVsdCBhdXRvIGFja25vd2xlZGdlbWVudCBvZiBtZXNzYWdlc1xuICAgIGlmICghaGVhZGVyc1snYWNrJ10pIHtcbiAgICAgIGhlYWRlcnNbJ2FjayddID0gJ2F1dG8nO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbGRPYnNlcnZhYmxlID0gT2JzZXJ2YWJsZS5jcmVhdGUoXG4gICAgICAobWVzc2FnZXM6IE9ic2VydmVyPFN0b21wLk1lc3NhZ2U+KSA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFRoZXNlIHZhcmlhYmxlcyB3aWxsIGJlIHVzZWQgYXMgcGFydCBvZiB0aGUgY2xvc3VyZSBhbmQgd29yayB0aGVpciBtYWdpYyBkdXJpbmcgdW5zdWJzY3JpYmVcbiAgICAgICAgICovXG4gICAgICAgIGxldCBzdG9tcFN1YnNjcmlwdGlvbjogU3RvbXBTdWJzY3JpcHRpb247XG5cbiAgICAgICAgbGV0IHN0b21wQ29ubmVjdGVkU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICAgICAgc3RvbXBDb25uZWN0ZWRTdWJzY3JpcHRpb24gPSB0aGlzLmNvbm5lY3RPYnNlcnZhYmxlXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBXaWxsIHN1YnNjcmliZSB0byAke3F1ZXVlTmFtZX1gKTtcbiAgICAgICAgICAgIHN0b21wU3Vic2NyaXB0aW9uID0gdGhpcy5jbGllbnQuc3Vic2NyaWJlKHF1ZXVlTmFtZSwgKG1lc3NhZ2U6IFN0b21wLk1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5uZXh0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBoZWFkZXJzKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4geyAvKiBjbGVhbnVwIGZ1bmN0aW9uLCB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vIHN1YnNjcmliZXJzIGFyZSBsZWZ0ICovXG4gICAgICAgICAgdGhpcy5kZWJ1ZyhgU3RvcCB3YXRjaGluZyBjb25uZWN0aW9uIHN0YXRlIChmb3IgJHtxdWV1ZU5hbWV9KWApO1xuICAgICAgICAgIHN0b21wQ29ubmVjdGVkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5nZXRWYWx1ZSgpID09PSBTdG9tcFN0YXRlLkNPTk5FQ1RFRCkge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgV2lsbCB1bnN1YnNjcmliZSBmcm9tICR7cXVldWVOYW1lfSBhdCBTdG9tcGApO1xuICAgICAgICAgICAgc3RvbXBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU3RvbXAgbm90IGNvbm5lY3RlZCwgbm8gbmVlZCB0byB1bnN1YnNjcmliZSBmcm9tICR7cXVldWVOYW1lfSBhdCBTdG9tcGApO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogSW1wb3J0YW50IC0gY29udmVydCBpdCB0byBob3QgT2JzZXJ2YWJsZSAtIG90aGVyd2lzZSwgaWYgdGhlIHVzZXIgY29kZSBzdWJzY3JpYmVzXG4gICAgICogdG8gdGhpcyBvYnNlcnZhYmxlIHR3aWNlLCBpdCB3aWxsIHN1YnNjcmliZSB0d2ljZSB0byBTdG9tcCBicm9rZXIuIChUaGlzIHdhcyBoYXBwZW5pbmcgaW4gdGhlIGN1cnJlbnQgZXhhbXBsZSkuXG4gICAgICogQSBsb25nIGJ1dCBnb29kIGV4cGxhbmF0b3J5IGFydGljbGUgYXQgaHR0cHM6Ly9tZWRpdW0uY29tL0BiZW5sZXNoL2hvdC12cy1jb2xkLW9ic2VydmFibGVzLWY4MDk0ZWQ1MzMzOVxuICAgICAqL1xuICAgIHJldHVybiBjb2xkT2JzZXJ2YWJsZS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgaGFuZGxlIG1lc3NhZ2VzIHJlY2VpdmVkIGluIHRoZSBkZWZhdWx0IHF1ZXVlLiBNZXNzYWdlcyB0aGF0IHdvdWxkIG5vdCBiZSBoYW5kbGVkIG90aGVyd2lzZVxuICAgKiBnZXQgZGVsaXZlcmVkIHRvIHRoZSBkZWZhdWx0IHF1ZXVlLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldHVwT25SZWNlaXZlKCk6IHZvaWQge1xuICAgIHRoaXMuZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZSA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgICB0aGlzLmNsaWVudC5vbnJlY2VpdmUgPSAobWVzc2FnZTogU3RvbXAuTWVzc2FnZSkgPT4ge1xuICAgICAgdGhpcy5kZWZhdWx0TWVzc2FnZXNPYnNlcnZhYmxlLm5leHQobWVzc2FnZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGVtaXQgYWxsIHJlY2VpcHRzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldHVwUmVjZWlwdHMoKTogdm9pZCB7XG4gICAgdGhpcy5yZWNlaXB0c09ic2VydmFibGUgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgdGhpcy5jbGllbnQub25yZWNlaXB0ID0gKGZyYW1lOiBTdG9tcC5GcmFtZSkgPT4ge1xuICAgICAgdGhpcy5yZWNlaXB0c09ic2VydmFibGUubmV4dChmcmFtZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0IGZvciByZWNlaXB0LCB0aGlzIGluZGljYXRlcyB0aGF0IHNlcnZlciBoYXMgY2FycmllZCBvdXQgdGhlIHJlbGF0ZWQgb3BlcmF0aW9uXG4gICAqL1xuICBwdWJsaWMgd2FpdEZvclJlY2VpcHQocmVjZWlwdElkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZnJhbWU6IFN0b21wLkZyYW1lKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5yZWNlaXB0c09ic2VydmFibGUucGlwZShcbiAgICAgIGZpbHRlcigoZnJhbWU6IFN0b21wLkZyYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiBmcmFtZS5oZWFkZXJzWydyZWNlaXB0LWlkJ10gPT09IHJlY2VpcHRJZDtcbiAgICAgIH0pLFxuICAgICAgZmlyc3QoKVxuICAgICkuc3Vic2NyaWJlKChmcmFtZTogU3RvbXAuRnJhbWUpID0+IHtcbiAgICAgIGNhbGxiYWNrKGZyYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBGdW5jdGlvbnNcbiAgICpcbiAgICogTm90ZSB0aGUgbWV0aG9kIHNpZ25hdHVyZTogKCkgPT4gcHJlc2VydmVzIGxleGljYWwgc2NvcGVcbiAgICogaWYgd2UgbmVlZCB0byB1c2UgdGhpcy54IGluc2lkZSB0aGUgZnVuY3Rpb25cbiAgICovXG4gIHByb3RlY3RlZCBkZWJ1ZyA9IChhcmdzOiBhbnkpOiB2b2lkID0+IHtcbiAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpLCBhcmdzKTtcbiAgfVxuXG4gIC8qKiBDYWxsYmFjayBydW4gb24gc3VjY2Vzc2Z1bGx5IGNvbm5lY3RpbmcgdG8gc2VydmVyICovXG4gIHByb3RlY3RlZCBvbl9jb25uZWN0ID0gKGZyYW1lOiBGcmFtZSkgPT4ge1xuXG4gICAgdGhpcy5kZWJ1ZygnQ29ubmVjdGVkJyk7XG5cbiAgICB0aGlzLl9zZXJ2ZXJIZWFkZXJzQmVoYXZpb3VyU3ViamVjdC5uZXh0KGZyYW1lLmhlYWRlcnMpO1xuXG4gICAgLy8gSW5kaWNhdGUgb3VyIGNvbm5lY3RlZCBzdGF0ZSB0byBvYnNlcnZlcnNcbiAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5DT05ORUNURUQpO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBlcnJvcnMgZnJvbSBzdG9tcC5qcyAqL1xuICBwcm90ZWN0ZWQgb25fZXJyb3IgPSAoZXJyb3I6IHN0cmluZyB8IFN0b21wLk1lc3NhZ2UpID0+IHtcblxuICAgIC8vIFRyaWdnZXIgdGhlIGVycm9yIHN1YmplY3RcbiAgICB0aGlzLmVycm9yU3ViamVjdC5uZXh0KGVycm9yKTtcblxuICAgIGlmICh0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICBlcnJvciA9ICg8U3RvbXAuTWVzc2FnZT5lcnJvcikuYm9keTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnKGBFcnJvcjogJHtlcnJvcn1gKTtcblxuICAgIC8vIENoZWNrIGZvciBkcm9wcGVkIGNvbm5lY3Rpb24gYW5kIHRyeSByZWNvbm5lY3RpbmdcbiAgICBpZiAoIXRoaXMuY2xpZW50LmNvbm5lY3RlZCkge1xuICAgICAgLy8gUmVzZXQgc3RhdGUgaW5kaWNhdG9yXG4gICAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5DTE9TRUQpO1xuICAgIH1cbiAgfVxufVxuIl19