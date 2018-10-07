(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/operators'), require('@angular/core'), require('rxjs'), require('@stomp/stompjs'), require('angular2-uuid')) :
    typeof define === 'function' && define.amd ? define('@stomp/ng2-stompjs', ['exports', 'rxjs/operators', '@angular/core', 'rxjs', '@stomp/stompjs', 'angular2-uuid'], factory) :
    (factory((global.stomp = global.stomp || {}, global.stomp['ng2-stompjs'] = {}),global.rxjs.operators,global.ng.core,global.rxjs,global.Stomp,global.angular2Uuid));
}(this, (function (exports,operators,core,rxjs,Stomp,angular2Uuid) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

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
    var StompRService = (function () {
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
                    error = ((error)).body;
                }
                _this.debug("Error: " + error);
                // Check for dropped connection and try reconnecting
                if (!_this.client.connected) {
                    // Reset state indicator
                    // Reset state indicator
                    _this.state.next(StompState.CLOSED);
                }
            };
            this.state = new rxjs.BehaviorSubject(StompState.CLOSED);
            this.connectObservable = this.state.pipe(operators.filter(function (currentState) {
                return currentState === StompState.CONNECTED;
            }));
            // Setup sending queuedMessages
            this.connectObservable.subscribe(function () {
                _this.sendQueuedMessages();
            });
            this._serverHeadersBehaviourSubject = new rxjs.BehaviorSubject(null);
            this.serverHeadersObservable = this._serverHeadersBehaviourSubject.pipe(operators.filter(function (headers) {
                return headers !== null;
            }));
            this.errorSubject = new rxjs.Subject();
        }
        Object.defineProperty(StompRService.prototype, "config", {
            /** Set configuration */
            set: /**
             * Set configuration
             * @param {?} value
             * @return {?}
             */ function (value) {
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
                if (headers === void 0) {
                    headers = {};
                }
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
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (queuedMessages_1_1 && !queuedMessages_1_1.done && (_a = queuedMessages_1.return))
                            _a.call(queuedMessages_1);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
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
                if (headers === void 0) {
                    headers = {};
                }
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
                var /** @type {?} */ coldObservable = rxjs.Observable.create(function (messages) {
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
                return coldObservable.pipe(operators.share());
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
                this.defaultMessagesObservable = new rxjs.Subject();
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
                this.receiptsObservable = new rxjs.Subject();
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
                this.receiptsObservable.pipe(operators.filter(function (frame) {
                    return frame.headers['receipt-id'] === receiptId;
                }), operators.first()).subscribe(function (frame) {
                    callback(frame);
                });
            };
        StompRService.decorators = [
            { type: core.Injectable }
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
    var StompConfig = (function () {
        function StompConfig() {
        }
        StompConfig.decorators = [
            { type: core.Injectable }
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
    var StompService = (function (_super) {
        __extends(StompService, _super);
        function StompService(config) {
            var _this = _super.call(this) || this;
            _this.config = config;
            _this.initAndConnect();
            return _this;
        }
        StompService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        StompService.ctorParameters = function () {
            return [
                { type: StompConfig, },
            ];
        };
        return StompService;
    }(StompRService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * RPC Config. See the guide for example.
     */
    var StompRPCConfig = (function () {
        function StompRPCConfig() {
        }
        StompRPCConfig.decorators = [
            { type: core.Injectable }
        ];
        return StompRPCConfig;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * An implementation of RPC service using messaging.
     *
     * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
     */
    var StompRPCService = (function () {
        /**
         * Create an instance, see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
         */
        function StompRPCService(stompService, stompRPCConfig) {
            var _this = this;
            this.stompService = stompService;
            this.stompRPCConfig = stompRPCConfig;
            this._replyQueueName = '/temp-queue/rpc-replies';
            this._setupReplyQueue = function () {
                return _this.stompService.defaultMessagesObservable;
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
        StompRPCService.prototype.rpc = /**
         * Make an RPC request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html) for example.
         * @param {?} serviceEndPoint
         * @param {?} payload
         * @param {?=} headers
         * @return {?}
         */
            function (serviceEndPoint, payload, headers) {
                // We know there will be only one message in reply
                return this.stream(serviceEndPoint, payload, headers).pipe(operators.first());
            };
        /**
         * Make an RPC stream request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html).
         * @param {?} serviceEndPoint
         * @param {?} payload
         * @param {?=} headers
         * @return {?}
         */
        StompRPCService.prototype.stream = /**
         * Make an RPC stream request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html).
         * @param {?} serviceEndPoint
         * @param {?} payload
         * @param {?=} headers
         * @return {?}
         */
            function (serviceEndPoint, payload, headers) {
                var _this = this;
                if (headers === void 0) {
                    headers = {};
                }
                if (!this._repliesObservable) {
                    this._repliesObservable = this._setupReplyQueue(this._replyQueueName, this.stompService);
                }
                return rxjs.Observable.create(function (rpcObserver) {
                    var /** @type {?} */ defaultMessagesSubscription;
                    var /** @type {?} */ correlationId = angular2Uuid.UUID.UUID();
                    defaultMessagesSubscription = _this._repliesObservable.pipe(operators.filter(function (message) {
                        return message.headers['correlation-id'] === correlationId;
                    })).subscribe(function (message) {
                        rpcObserver.next(message);
                    });
                    // send an RPC request
                    headers['reply-to'] = _this._replyQueueName;
                    headers['correlation-id'] = correlationId;
                    _this.stompService.publish(serviceEndPoint, payload, headers);
                    return function () {
                        // Cleanup
                        defaultMessagesSubscription.unsubscribe();
                    };
                });
            };
        StompRPCService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        StompRPCService.ctorParameters = function () {
            return [
                { type: StompRService, },
                { type: StompRPCConfig, },
            ];
        };
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

    exports.StompRService = StompRService;
    exports.StompService = StompService;
    exports.StompState = StompState;
    exports.StompConfig = StompConfig;
    exports.StompRPCService = StompRPCService;
    exports.StompRPCConfig = StompRPCConfig;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9zdG9tcC1yLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAuY29uZmlnLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAtcnBjLmNvbmZpZy50cyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9zdG9tcC1ycGMuc2VydmljZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7IGZpcnN0LCBmaWx0ZXIsIHNoYXJlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0ICwgIE9ic2VydmFibGUgLCAgT2JzZXJ2ZXIgLCAgU3ViamVjdCAsICBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgU3RvbXBDb25maWcgfSBmcm9tICcuL3N0b21wLmNvbmZpZyc7XG5cbmltcG9ydCAqIGFzIFN0b21wIGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcbmltcG9ydCB7IEZyYW1lLCBTdG9tcFN1YnNjcmlwdGlvbiB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJy4vc3RvbXAtaGVhZGVycyc7XG5pbXBvcnQgeyBTdG9tcFN0YXRlIH0gZnJvbSAnLi9zdG9tcC1zdGF0ZSc7XG5cbi8qKlxuICogQW5ndWxhcjIgU1RPTVAgUmF3IFNlcnZpY2UgdXNpbmcgQHN0b21wL3N0b21wLmpzXG4gKlxuICogWW91IHdpbGwgb25seSBuZWVkIHRoZSBwdWJsaWMgcHJvcGVydGllcyBhbmRcbiAqIG1ldGhvZHMgbGlzdGVkIHVubGVzcyB5b3UgYXJlIGFuIGFkdmFuY2VkIHVzZXIuIFRoaXMgc2VydmljZSBoYW5kbGVzIHN1YnNjcmliaW5nIHRvIGFcbiAqIG1lc3NhZ2UgcXVldWUgdXNpbmcgdGhlIHN0b21wLmpzIGxpYnJhcnksIGFuZCByZXR1cm5zXG4gKiB2YWx1ZXMgdmlhIHRoZSBFUzYgT2JzZXJ2YWJsZSBzcGVjaWZpY2F0aW9uIGZvclxuICogYXN5bmNocm9ub3VzIHZhbHVlIHN0cmVhbWluZyBieSB3aXJpbmcgdGhlIFNUT01QXG4gKiBtZXNzYWdlcyBpbnRvIGFuIG9ic2VydmFibGUuXG4gKlxuICogSWYgeW91IHdpbGwgbGlrZSB0byBwYXNzIHRoZSBjb25maWd1cmF0aW9uIGFzIGEgZGVwZW5kZW5jeSxcbiAqIHBsZWFzZSB1c2UgU3RvbXBTZXJ2aWNlIGNsYXNzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSU2VydmljZSB7XG4gIC8qKlxuICAgKiBTdGF0ZSBvZiB0aGUgU1RPTVBTZXJ2aWNlXG4gICAqXG4gICAqIEl0IGlzIGEgQmVoYXZpb3JTdWJqZWN0IGFuZCB3aWxsIGVtaXQgY3VycmVudCBzdGF0dXMgaW1tZWRpYXRlbHkuIFRoaXMgd2lsbCB0eXBpY2FsbHkgZ2V0XG4gICAqIHVzZWQgdG8gc2hvdyBjdXJyZW50IHN0YXR1cyB0byB0aGUgZW5kIHVzZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGU6IEJlaGF2aW9yU3ViamVjdDxTdG9tcFN0YXRlPjtcblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZC4gVXNlIHRoaXMgdG8gY2Fycnkgb3V0IGluaXRpYWxpemF0aW9uLlxuICAgKiBJdCB3aWxsIHRyaWdnZXIgZXZlcnkgdGltZSBhIChyZSljb25uZWN0aW9uIG9jY3Vycy4gSWYgaXQgaXMgYWxyZWFkeSBjb25uZWN0ZWRcbiAgICogaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LiBZb3UgY2FuIHNhZmVseSBpZ25vcmUgdGhlIHZhbHVlLCBhcyBpdCB3aWxsIGFsd2F5cyBiZVxuICAgKiBTdG9tcFN0YXRlLkNPTk5FQ1RFRFxuICAgKi9cbiAgcHVibGljIGNvbm5lY3RPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFN0b21wU3RhdGU+O1xuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBoZWFkZXJzIGZyb20gbW9zdCByZWNlbnQgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyIGFzIHJldHVybiBieSB0aGUgQ09OTkVDVEVEXG4gICAqIGZyYW1lLlxuICAgKiBJZiB0aGUgU1RPTVAgY29ubmVjdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGVzdGFibGlzaGVkIGl0IHdpbGwgdHJpZ2dlciBpbW1lZGlhdGVseS5cbiAgICogSXQgd2lsbCBhZGRpdGlvbmFsbHkgdHJpZ2dlciBpbiBldmVudCBvZiByZWNvbm5lY3Rpb24sIHRoZSB2YWx1ZSB3aWxsIGJlIHNldCBvZiBoZWFkZXJzIGZyb21cbiAgICogdGhlIHJlY2VudCBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAqL1xuICBwdWJsaWMgc2VydmVySGVhZGVyc09ic2VydmFibGU6IE9ic2VydmFibGU8U3RvbXBIZWFkZXJzPjtcblxuICBwcml2YXRlIF9zZXJ2ZXJIZWFkZXJzQmVoYXZpb3VyU3ViamVjdDogQmVoYXZpb3JTdWJqZWN0PG51bGwgfCBTdG9tcEhlYWRlcnM+O1xuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIG1lc3NhZ2VzIHRvIHRoZSBkZWZhdWx0IHF1ZXVlIChhbnkgbWVzc2FnZSB0aGF0IGFyZSBub3QgaGFuZGxlZCBieSBhIHN1YnNjcmlwdGlvbilcbiAgICovXG4gIHB1YmxpYyBkZWZhdWx0TWVzc2FnZXNPYnNlcnZhYmxlOiBTdWJqZWN0PFN0b21wLk1lc3NhZ2U+O1xuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIHJlY2VpcHRzXG4gICAqL1xuICBwdWJsaWMgcmVjZWlwdHNPYnNlcnZhYmxlOiBTdWJqZWN0PFN0b21wLkZyYW1lPjtcblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gYW4gZXJyb3Igb2NjdXJzLiBUaGlzIFN1YmplY3QgY2FuIGJlIHVzZWQgdG8gaGFuZGxlIGVycm9ycyBmcm9tXG4gICAqIHRoZSBzdG9tcCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgZXJyb3JTdWJqZWN0OiBTdWJqZWN0PHN0cmluZyB8IFN0b21wLk1lc3NhZ2U+O1xuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBhcnJheSB0byBob2xkIGxvY2FsbHkgcXVldWVkIG1lc3NhZ2VzIHdoZW4gU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgcXVldWVkTWVzc2FnZXM6IHsgcXVldWVOYW1lOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzIH1bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jb25maWc6IFN0b21wQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBTVE9NUCBDbGllbnQgZnJvbSBAc3RvbXAvc3RvbXAuanNcbiAgICovXG4gIHByb3RlY3RlZCBjbGllbnQ6IFN0b21wLkNsaWVudDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogU2VlIFJFQURNRSBhbmQgc2FtcGxlcyBmb3IgY29uZmlndXJhdGlvbiBleGFtcGxlc1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+KFN0b21wU3RhdGUuQ0xPU0VEKTtcblxuICAgIHRoaXMuY29ubmVjdE9ic2VydmFibGUgPSB0aGlzLnN0YXRlLnBpcGUoXG4gICAgICBmaWx0ZXIoKGN1cnJlbnRTdGF0ZTogU3RvbXBTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gY3VycmVudFN0YXRlID09PSBTdG9tcFN0YXRlLkNPTk5FQ1RFRDtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIFNldHVwIHNlbmRpbmcgcXVldWVkTWVzc2FnZXNcbiAgICB0aGlzLmNvbm5lY3RPYnNlcnZhYmxlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNlbmRRdWV1ZWRNZXNzYWdlcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VydmVySGVhZGVyc0JlaGF2aW91clN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bGwgfCBTdG9tcEhlYWRlcnM+KG51bGwpO1xuXG4gICAgdGhpcy5zZXJ2ZXJIZWFkZXJzT2JzZXJ2YWJsZSA9IHRoaXMuX3NlcnZlckhlYWRlcnNCZWhhdmlvdXJTdWJqZWN0LnBpcGUoXG4gICAgICBmaWx0ZXIoKGhlYWRlcnM6IG51bGwgfCBTdG9tcEhlYWRlcnMpID0+IHtcbiAgICAgICAgcmV0dXJuIGhlYWRlcnMgIT09IG51bGw7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLmVycm9yU3ViamVjdCA9IG5ldyBTdWJqZWN0KCk7XG4gIH1cblxuICAvKiogU2V0IGNvbmZpZ3VyYXRpb24gKi9cbiAgc2V0IGNvbmZpZyh2YWx1ZTogU3RvbXBDb25maWcpIHtcbiAgICB0aGlzLl9jb25maWcgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBJdCB3aWxsIGluaXRpYWxpemUgU1RPTVAgQ2xpZW50LiAqL1xuICBwcm90ZWN0ZWQgaW5pdFN0b21wQ2xpZW50KCk6IHZvaWQge1xuICAgIC8vIGRpc2Nvbm5lY3QgaWYgY29ubmVjdGVkXG4gICAgdGhpcy5kaXNjb25uZWN0KCk7XG5cbiAgICAvLyB1cmwgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHNvY2tldEZuXG4gICAgaWYgKHR5cGVvZih0aGlzLl9jb25maWcudXJsKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuY2xpZW50ID0gU3RvbXAuY2xpZW50KHRoaXMuX2NvbmZpZy51cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsaWVudCA9IFN0b21wLm92ZXIodGhpcy5fY29uZmlnLnVybCk7XG4gICAgfVxuXG4gICAgLy8gQ29uZmlndXJlIGNsaWVudCBoZWFydC1iZWF0aW5nXG4gICAgdGhpcy5jbGllbnQuaGVhcnRiZWF0LmluY29taW5nID0gdGhpcy5fY29uZmlnLmhlYXJ0YmVhdF9pbjtcbiAgICB0aGlzLmNsaWVudC5oZWFydGJlYXQub3V0Z29pbmcgPSB0aGlzLl9jb25maWcuaGVhcnRiZWF0X291dDtcblxuICAgIC8vIEF1dG8gcmVjb25uZWN0XG4gICAgdGhpcy5jbGllbnQucmVjb25uZWN0X2RlbGF5ID0gdGhpcy5fY29uZmlnLnJlY29ubmVjdF9kZWxheTtcblxuICAgIGlmICghdGhpcy5fY29uZmlnLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnID0gZnVuY3Rpb24gKCkge1xuICAgICAgfTtcbiAgICB9XG4gICAgLy8gU2V0IGZ1bmN0aW9uIHRvIGRlYnVnIHByaW50IG1lc3NhZ2VzXG4gICAgdGhpcy5jbGllbnQuZGVidWcgPSB0aGlzLmRlYnVnO1xuXG4gICAgLy8gRGVmYXVsdCBtZXNzYWdlc1xuICAgIHRoaXMuc2V0dXBPblJlY2VpdmUoKTtcblxuICAgIC8vIFJlY2VpcHRzXG4gICAgdGhpcy5zZXR1cFJlY2VpcHRzKCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGNvbm5lY3QgdG8gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBpbml0QW5kQ29ubmVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRTdG9tcENsaWVudCgpO1xuXG4gICAgaWYgKCF0aGlzLl9jb25maWcuaGVhZGVycykge1xuICAgICAgdGhpcy5fY29uZmlnLmhlYWRlcnMgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBBdHRlbXB0IGNvbm5lY3Rpb24sIHBhc3NpbmcgaW4gYSBjYWxsYmFja1xuICAgIHRoaXMuY2xpZW50LmNvbm5lY3QoXG4gICAgICB0aGlzLl9jb25maWcuaGVhZGVycyxcbiAgICAgIHRoaXMub25fY29ubmVjdCxcbiAgICAgIHRoaXMub25fZXJyb3JcbiAgICApO1xuXG4gICAgdGhpcy5kZWJ1ZygnQ29ubmVjdGluZy4uLicpO1xuICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLlRSWUlORyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGRpc2Nvbm5lY3QgZnJvbSB0aGUgU1RPTVAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGRpc2Nvbm5lY3QoKTogdm9pZCB7XG5cbiAgICAvLyBEaXNjb25uZWN0IGlmIGNvbm5lY3RlZC4gQ2FsbGJhY2sgd2lsbCBzZXQgQ0xPU0VEIHN0YXRlXG4gICAgaWYgKHRoaXMuY2xpZW50KSB7XG4gICAgICBpZiAoIXRoaXMuY2xpZW50LmNvbm5lY3RlZCkge1xuICAgICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLkNMT1NFRCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gTm90aWZ5IG9ic2VydmVycyB0aGF0IHdlIGFyZSBkaXNjb25uZWN0aW5nIVxuICAgICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuRElTQ09OTkVDVElORyk7XG5cbiAgICAgIHRoaXMuY2xpZW50LmRpc2Nvbm5lY3QoXG4gICAgICAgICgpID0+IHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLkNMT1NFRClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgcmV0dXJuIGB0cnVlYCBpZiBTVE9NUCBicm9rZXIgaXMgY29ubmVjdGVkIGFuZCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIHB1YmxpYyBjb25uZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZ2V0VmFsdWUoKSA9PT0gU3RvbXBTdGF0ZS5DT05ORUNURUQ7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBzZW5kIGEgbWVzc2FnZSB0byBhIG5hbWVkIGRlc3RpbmF0aW9uLiBUaGUgbWVzc2FnZSBtdXN0IGJlIGBzdHJpbmdgLlxuICAgKlxuICAgKiBUaGUgbWVzc2FnZSB3aWxsIGdldCBsb2NhbGx5IHF1ZXVlZCBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuIEl0IHdpbGwgYXR0ZW1wdCB0b1xuICAgKiBwdWJsaXNoIHF1ZXVlZCBtZXNzYWdlcyBhcyBzb29uIGFzIHRoZSBicm9rZXIgZ2V0cyBjb25uZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBxdWV1ZU5hbWVcbiAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICogQHBhcmFtIGhlYWRlcnNcbiAgICovXG4gIHB1YmxpYyBwdWJsaXNoKHF1ZXVlTmFtZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGhlYWRlcnM6IFN0b21wSGVhZGVycyA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGVkKCkpIHtcbiAgICAgIHRoaXMuY2xpZW50LnNlbmQocXVldWVOYW1lLCBoZWFkZXJzLCBtZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWJ1ZyhgTm90IGNvbm5lY3RlZCwgcXVldWVpbmcgJHttZXNzYWdlfWApO1xuICAgICAgdGhpcy5xdWV1ZWRNZXNzYWdlcy5wdXNoKHtxdWV1ZU5hbWU6IDxzdHJpbmc+cXVldWVOYW1lLCBtZXNzYWdlOiA8c3RyaW5nPm1lc3NhZ2UsIGhlYWRlcnM6IGhlYWRlcnN9KTtcbiAgICB9XG4gIH1cblxuICAvKiogSXQgd2lsbCBzZW5kIHF1ZXVlZCBtZXNzYWdlcy4gKi9cbiAgcHJvdGVjdGVkIHNlbmRRdWV1ZWRNZXNzYWdlcygpOiB2b2lkIHtcbiAgICBjb25zdCBxdWV1ZWRNZXNzYWdlcyA9IHRoaXMucXVldWVkTWVzc2FnZXM7XG4gICAgdGhpcy5xdWV1ZWRNZXNzYWdlcyA9IFtdO1xuXG4gICAgdGhpcy5kZWJ1ZyhgV2lsbCB0cnkgc2VuZGluZyBxdWV1ZWQgbWVzc2FnZXMgJHtxdWV1ZWRNZXNzYWdlc31gKTtcblxuICAgIGZvciAoY29uc3QgcXVldWVkTWVzc2FnZSBvZiBxdWV1ZWRNZXNzYWdlcykge1xuICAgICAgdGhpcy5kZWJ1ZyhgQXR0ZW1wdGluZyB0byBzZW5kICR7cXVldWVkTWVzc2FnZX1gKTtcbiAgICAgIHRoaXMucHVibGlzaChxdWV1ZWRNZXNzYWdlLnF1ZXVlTmFtZSwgcXVldWVkTWVzc2FnZS5tZXNzYWdlLCBxdWV1ZWRNZXNzYWdlLmhlYWRlcnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHN1YnNjcmliZSB0byBzZXJ2ZXIgbWVzc2FnZSBxdWV1ZXNcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHNhZmVseSBjYWxsZWQgZXZlbiBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuXG4gICAqIElmIHRoZSB1bmRlcmx5aW5nIFNUT01QIGNvbm5lY3Rpb24gZHJvcHMgYW5kIHJlY29ubmVjdHMsIGl0IHdpbGwgcmVzdWJzY3JpYmUgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogSWYgYSBoZWFkZXIgZmllbGQgJ2FjaycgaXMgbm90IGV4cGxpY2l0bHkgcGFzc2VkLCAnYWNrJyB3aWxsIGJlIHNldCB0byAnYXV0bycuIElmIHlvdVxuICAgKiBkbyBub3QgdW5kZXJzdGFuZCB3aGF0IGl0IG1lYW5zLCBwbGVhc2UgbGVhdmUgaXQgYXMgaXMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB3aGVuIHdvcmtpbmcgd2l0aCB0ZW1wb3JhcnkgcXVldWVzIHdoZXJlIHRoZSBzdWJzY3JpcHRpb24gcmVxdWVzdFxuICAgKiBjcmVhdGVzIHRoZVxuICAgKiB1bmRlcmx5aW5nIHF1ZXVlLCBtc3NhZ2VzIG1pZ2h0IGJlIG1pc3NlZCBkdXJpbmcgcmVjb25uZWN0LiBUaGlzIGlzc3VlIGlzIG5vdCBzcGVjaWZpY1xuICAgKiB0byB0aGlzIGxpYnJhcnkgYnV0IHRoZSB3YXkgU1RPTVAgYnJva2VycyBhcmUgZGVzaWduZWQgdG8gd29yay5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHN1YnNjcmliZShxdWV1ZU5hbWU6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pOiBPYnNlcnZhYmxlPFN0b21wLk1lc3NhZ2U+IHtcblxuICAgIC8qIFdlbGwgdGhlIGxvZ2ljIGlzIGNvbXBsaWNhdGVkIGJ1dCB3b3JrcyBiZWF1dGlmdWxseS4gUnhKUyBpcyBpbmRlZWQgd29uZGVyZnVsLlxuICAgICAqXG4gICAgICogV2UgbmVlZCB0byBhY3RpdmF0ZSB0aGUgdW5kZXJseWluZyBzdWJzY3JpcHRpb24gaW1tZWRpYXRlbHkgaWYgU3RvbXAgaXMgY29ubmVjdGVkLiBJZiBub3QgaXQgc2hvdWxkXG4gICAgICogc3Vic2NyaWJlIHdoZW4gaXQgZ2V0cyBuZXh0IGNvbm5lY3RlZC4gRnVydGhlciBpdCBzaG91bGQgcmUgZXN0YWJsaXNoIHRoZSBzdWJzY3JpcHRpb24gd2hlbmV2ZXIgU3RvbXBcbiAgICAgKiBzdWNjZXNzZnVsbHkgcmVjb25uZWN0cy5cbiAgICAgKlxuICAgICAqIEFjdHVhbCBpbXBsZW1lbnRhdGlvbiBpcyBzaW1wbGUsIHdlIGZpbHRlciB0aGUgQmVoYXZpb3VyU3ViamVjdCAnc3RhdGUnIHNvIHRoYXQgd2UgY2FuIHRyaWdnZXIgd2hlbmV2ZXIgU3RvbXAgaXNcbiAgICAgKiBjb25uZWN0ZWQuIFNpbmNlICdzdGF0ZScgaXMgYSBCZWhhdmlvdXJTdWJqZWN0LCBpZiBTdG9tcCBpcyBhbHJlYWR5IGNvbm5lY3RlZCwgaXQgd2lsbCBpbW1lZGlhdGVseSB0cmlnZ2VyLlxuICAgICAqXG4gICAgICogVGhlIG9ic2VydmFibGUgdGhhdCB3ZSByZXR1cm4gdG8gY2FsbGVyIHJlbWFpbnMgc2FtZSBhY3Jvc3MgYWxsIHJlY29ubmVjdHMsIHNvIG5vIHNwZWNpYWwgaGFuZGxpbmcgbmVlZGVkIGF0XG4gICAgICogdGhlIG1lc3NhZ2Ugc3Vic2NyaWJlci5cbiAgICAgKi9cbiAgICB0aGlzLmRlYnVnKGBSZXF1ZXN0IHRvIHN1YnNjcmliZSAke3F1ZXVlTmFtZX1gKTtcblxuICAgIC8vIEJ5IGRlZmF1bHQgYXV0byBhY2tub3dsZWRnZW1lbnQgb2YgbWVzc2FnZXNcbiAgICBpZiAoIWhlYWRlcnNbJ2FjayddKSB7XG4gICAgICBoZWFkZXJzWydhY2snXSA9ICdhdXRvJztcbiAgICB9XG5cbiAgICBjb25zdCBjb2xkT2JzZXJ2YWJsZSA9IE9ic2VydmFibGUuY3JlYXRlKFxuICAgICAgKG1lc3NhZ2VzOiBPYnNlcnZlcjxTdG9tcC5NZXNzYWdlPikgPT4ge1xuICAgICAgICAvKlxuICAgICAgICAgKiBUaGVzZSB2YXJpYWJsZXMgd2lsbCBiZSB1c2VkIGFzIHBhcnQgb2YgdGhlIGNsb3N1cmUgYW5kIHdvcmsgdGhlaXIgbWFnaWMgZHVyaW5nIHVuc3Vic2NyaWJlXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgc3RvbXBTdWJzY3JpcHRpb246IFN0b21wU3Vic2NyaXB0aW9uO1xuXG4gICAgICAgIGxldCBzdG9tcENvbm5lY3RlZFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgICAgIHN0b21wQ29ubmVjdGVkU3Vic2NyaXB0aW9uID0gdGhpcy5jb25uZWN0T2JzZXJ2YWJsZVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgV2lsbCBzdWJzY3JpYmUgdG8gJHtxdWV1ZU5hbWV9YCk7XG4gICAgICAgICAgICBzdG9tcFN1YnNjcmlwdGlvbiA9IHRoaXMuY2xpZW50LnN1YnNjcmliZShxdWV1ZU5hbWUsIChtZXNzYWdlOiBTdG9tcC5NZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMubmV4dChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaGVhZGVycyk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHsgLyogY2xlYW51cCBmdW5jdGlvbiwgd2lsbCBiZSBjYWxsZWQgd2hlbiBubyBzdWJzY3JpYmVycyBhcmUgbGVmdCAqL1xuICAgICAgICAgIHRoaXMuZGVidWcoYFN0b3Agd2F0Y2hpbmcgY29ubmVjdGlvbiBzdGF0ZSAoZm9yICR7cXVldWVOYW1lfSlgKTtcbiAgICAgICAgICBzdG9tcENvbm5lY3RlZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZ2V0VmFsdWUoKSA9PT0gU3RvbXBTdGF0ZS5DT05ORUNURUQpIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFdpbGwgdW5zdWJzY3JpYmUgZnJvbSAke3F1ZXVlTmFtZX0gYXQgU3RvbXBgKTtcbiAgICAgICAgICAgIHN0b21wU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFN0b21wIG5vdCBjb25uZWN0ZWQsIG5vIG5lZWQgdG8gdW5zdWJzY3JpYmUgZnJvbSAke3F1ZXVlTmFtZX0gYXQgU3RvbXBgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEltcG9ydGFudCAtIGNvbnZlcnQgaXQgdG8gaG90IE9ic2VydmFibGUgLSBvdGhlcndpc2UsIGlmIHRoZSB1c2VyIGNvZGUgc3Vic2NyaWJlc1xuICAgICAqIHRvIHRoaXMgb2JzZXJ2YWJsZSB0d2ljZSwgaXQgd2lsbCBzdWJzY3JpYmUgdHdpY2UgdG8gU3RvbXAgYnJva2VyLiAoVGhpcyB3YXMgaGFwcGVuaW5nIGluIHRoZSBjdXJyZW50IGV4YW1wbGUpLlxuICAgICAqIEEgbG9uZyBidXQgZ29vZCBleHBsYW5hdG9yeSBhcnRpY2xlIGF0IGh0dHBzOi8vbWVkaXVtLmNvbS9AYmVubGVzaC9ob3QtdnMtY29sZC1vYnNlcnZhYmxlcy1mODA5NGVkNTMzMzlcbiAgICAgKi9cbiAgICByZXR1cm4gY29sZE9ic2VydmFibGUucGlwZShzaGFyZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGhhbmRsZSBtZXNzYWdlcyByZWNlaXZlZCBpbiB0aGUgZGVmYXVsdCBxdWV1ZS4gTWVzc2FnZXMgdGhhdCB3b3VsZCBub3QgYmUgaGFuZGxlZCBvdGhlcndpc2VcbiAgICogZ2V0IGRlbGl2ZXJlZCB0byB0aGUgZGVmYXVsdCBxdWV1ZS5cbiAgICovXG4gIHByb3RlY3RlZCBzZXR1cE9uUmVjZWl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlZmF1bHRNZXNzYWdlc09ic2VydmFibGUgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgdGhpcy5jbGllbnQub25yZWNlaXZlID0gKG1lc3NhZ2U6IFN0b21wLk1lc3NhZ2UpID0+IHtcbiAgICAgIHRoaXMuZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZS5uZXh0KG1lc3NhZ2UpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBlbWl0IGFsbCByZWNlaXB0cy5cbiAgICovXG4gIHByb3RlY3RlZCBzZXR1cFJlY2VpcHRzKCk6IHZvaWQge1xuICAgIHRoaXMucmVjZWlwdHNPYnNlcnZhYmxlID0gbmV3IFN1YmplY3QoKTtcblxuICAgIHRoaXMuY2xpZW50Lm9ucmVjZWlwdCA9IChmcmFtZTogU3RvbXAuRnJhbWUpID0+IHtcbiAgICAgIHRoaXMucmVjZWlwdHNPYnNlcnZhYmxlLm5leHQoZnJhbWUpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogV2FpdCBmb3IgcmVjZWlwdCwgdGhpcyBpbmRpY2F0ZXMgdGhhdCBzZXJ2ZXIgaGFzIGNhcnJpZWQgb3V0IHRoZSByZWxhdGVkIG9wZXJhdGlvblxuICAgKi9cbiAgcHVibGljIHdhaXRGb3JSZWNlaXB0KHJlY2VpcHRJZDogc3RyaW5nLCBjYWxsYmFjazogKGZyYW1lOiBTdG9tcC5GcmFtZSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMucmVjZWlwdHNPYnNlcnZhYmxlLnBpcGUoXG4gICAgICBmaWx0ZXIoKGZyYW1lOiBTdG9tcC5GcmFtZSkgPT4ge1xuICAgICAgICByZXR1cm4gZnJhbWUuaGVhZGVyc1sncmVjZWlwdC1pZCddID09PSByZWNlaXB0SWQ7XG4gICAgICB9KSxcbiAgICAgIGZpcnN0KClcbiAgICApLnN1YnNjcmliZSgoZnJhbWU6IFN0b21wLkZyYW1lKSA9PiB7XG4gICAgICBjYWxsYmFjayhmcmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgRnVuY3Rpb25zXG4gICAqXG4gICAqIE5vdGUgdGhlIG1ldGhvZCBzaWduYXR1cmU6ICgpID0+IHByZXNlcnZlcyBsZXhpY2FsIHNjb3BlXG4gICAqIGlmIHdlIG5lZWQgdG8gdXNlIHRoaXMueCBpbnNpZGUgdGhlIGZ1bmN0aW9uXG4gICAqL1xuICBwcm90ZWN0ZWQgZGVidWcgPSAoYXJnczogYW55KTogdm9pZCA9PiB7XG4gICAgY29uc29sZS5sb2cobmV3IERhdGUoKSwgYXJncyk7XG4gIH1cblxuICAvKiogQ2FsbGJhY2sgcnVuIG9uIHN1Y2Nlc3NmdWxseSBjb25uZWN0aW5nIHRvIHNlcnZlciAqL1xuICBwcm90ZWN0ZWQgb25fY29ubmVjdCA9IChmcmFtZTogRnJhbWUpID0+IHtcblxuICAgIHRoaXMuZGVidWcoJ0Nvbm5lY3RlZCcpO1xuXG4gICAgdGhpcy5fc2VydmVySGVhZGVyc0JlaGF2aW91clN1YmplY3QubmV4dChmcmFtZS5oZWFkZXJzKTtcblxuICAgIC8vIEluZGljYXRlIG91ciBjb25uZWN0ZWQgc3RhdGUgdG8gb2JzZXJ2ZXJzXG4gICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuQ09OTkVDVEVEKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgZXJyb3JzIGZyb20gc3RvbXAuanMgKi9cbiAgcHJvdGVjdGVkIG9uX2Vycm9yID0gKGVycm9yOiBzdHJpbmcgfCBTdG9tcC5NZXNzYWdlKSA9PiB7XG5cbiAgICAvLyBUcmlnZ2VyIHRoZSBlcnJvciBzdWJqZWN0XG4gICAgdGhpcy5lcnJvclN1YmplY3QubmV4dChlcnJvcik7XG5cbiAgICBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0Jykge1xuICAgICAgZXJyb3IgPSAoPFN0b21wLk1lc3NhZ2U+ZXJyb3IpLmJvZHk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1ZyhgRXJyb3I6ICR7ZXJyb3J9YCk7XG5cbiAgICAvLyBDaGVjayBmb3IgZHJvcHBlZCBjb25uZWN0aW9uIGFuZCB0cnkgcmVjb25uZWN0aW5nXG4gICAgaWYgKCF0aGlzLmNsaWVudC5jb25uZWN0ZWQpIHtcbiAgICAgIC8vIFJlc2V0IHN0YXRlIGluZGljYXRvclxuICAgICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wU3RhdGUuQ0xPU0VEKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJy4vc3RvbXAtaGVhZGVycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4vKipcbiAqIFJlcHJlc2VudHMgYSBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlXG4gKiBTVE9NUFNlcnZpY2UgdG8gY29ubmVjdCB0by5cbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBDb25maWcge1xuICAvKipcbiAgICogU2VydmVyIFVSTCB0byBjb25uZWN0IHRvLiBQbGVhc2UgcmVmZXIgdG8geW91ciBTVE9NUCBicm9rZXIgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscy5cbiAgICpcbiAgICogRXhhbXBsZTogd3M6Ly8xMjcuMC4wLjE6MTU2NzQvd3MgKGZvciBhIFJhYmJpdE1RIGRlZmF1bHQgc2V0dXAgcnVubmluZyBvbiBsb2NhbGhvc3QpXG4gICAqXG4gICAqIEFsdGVybmF0aXZlbHkgdGhpcyBwYXJhbWV0ZXIgY2FuIGJlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIG9iamVjdCBzaW1pbGFyIHRvIFdlYlNvY2tldFxuICAgKiAodHlwaWNhbGx5IFNvY2tKUyBpbnN0YW5jZSkuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqICgpID0+IHtcbiAgICogICByZXR1cm4gbmV3IFNvY2tKUygnaHR0cDovLzEyNy4wLjAuMToxNTY3NC9zdG9tcCcpO1xuICAgKiB9XG4gICAqL1xuICB1cmw6IHN0cmluZyB8ICgoKSA9PiBhbnkpO1xuXG4gIC8qKlxuICAgKiBIZWFkZXJzXG4gICAqIFR5cGljYWwga2V5czogbG9naW46IHN0cmluZywgcGFzc2NvZGU6IHN0cmluZy5cbiAgICogaG9zdDpzdHJpbmcgd2lsbCBuZWVlZCB0byBiZSBwYXNzZWQgZm9yIHZpcnR1YWwgaG9zdHMgaW4gUmFiYml0TVFcbiAgICovXG4gIGhlYWRlcnM6IFN0b21wSGVhZGVycztcblxuICAvKiogSG93IG9mdGVuIHRvIGluY29taW5nIGhlYXJ0YmVhdD9cbiAgICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLCBzZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgMCAtIGRpc2FibGVkXG4gICAqL1xuICBoZWFydGJlYXRfaW46IG51bWJlcjtcblxuICAvKipcbiAgICogSG93IG9mdGVuIHRvIG91dGdvaW5nIGhlYXJ0YmVhdD9cbiAgICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLCBzZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgMjAwMDAgLSBldmVyeSAyMCBzZWNvbmRzXG4gICAqL1xuICBoZWFydGJlYXRfb3V0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdhaXQgaW4gbWlsbGlzZWNvbmRzIGJlZm9yZSBhdHRlbXB0aW5nIGF1dG8gcmVjb25uZWN0XG4gICAqIFNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSA1MDAwICg1IHNlY29uZHMpXG4gICAqL1xuICByZWNvbm5lY3RfZGVsYXk6IG51bWJlcjtcblxuICAvKiogRW5hYmxlIGNsaWVudCBkZWJ1Z2dpbmc/ICovXG4gIGRlYnVnOiBib29sZWFuO1xufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTdG9tcENvbmZpZyB9IGZyb20gJy4vc3RvbXAuY29uZmlnJztcblxuaW1wb3J0IHsgU3RvbXBSU2VydmljZSB9IGZyb20gJy4vc3RvbXAtci5zZXJ2aWNlJztcblxuLyoqXG4gKiBBbmd1bGFyMiBTVE9NUCBTZXJ2aWNlIHVzaW5nIEBzdG9tcC9zdG9tcC5qc1xuICpcbiAqIEBkZXNjcmlwdGlvbiBUaGlzIHNlcnZpY2UgaGFuZGxlcyBzdWJzY3JpYmluZyB0byBhXG4gKiBtZXNzYWdlIHF1ZXVlIHVzaW5nIHRoZSBzdG9tcC5qcyBsaWJyYXJ5LCBhbmQgcmV0dXJuc1xuICogdmFsdWVzIHZpYSB0aGUgRVM2IE9ic2VydmFibGUgc3BlY2lmaWNhdGlvbiBmb3JcbiAqIGFzeW5jaHJvbm91cyB2YWx1ZSBzdHJlYW1pbmcgYnkgd2lyaW5nIHRoZSBTVE9NUFxuICogbWVzc2FnZXMgaW50byBhbiBvYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSB3YW50IHRvIG1hbnVhbGx5IGNvbmZpZ3VyZSBhbmQgaW5pdGlhbGl6ZSB0aGUgc2VydmljZVxuICogcGxlYXNlIHVzZSBTdG9tcFJTZXJ2aWNlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFNlcnZpY2UgZXh0ZW5kcyBTdG9tcFJTZXJ2aWNlIHtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogU2VlIFJFQURNRSBhbmQgc2FtcGxlcyBmb3IgY29uZmlndXJhdGlvbiBleGFtcGxlc1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogU3RvbXBDb25maWcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5pbml0QW5kQ29ubmVjdCgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tIFwiQHN0b21wL3N0b21wanNcIjtcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7U3RvbXBSU2VydmljZX0gZnJvbSBcIi4vc3RvbXAtci5zZXJ2aWNlXCI7XG5cbi8qKlxuICogU2VlIHRoZSBndWlkZSBmb3IgZXhhbXBsZVxuICovXG5leHBvcnQgdHlwZSBzZXR1cFJlcGx5UXVldWVGblR5cGUgPSAocmVwbHlRdWV1ZU5hbWU6IHN0cmluZywgc3RvbXBTZXJ2aWNlOiBTdG9tcFJTZXJ2aWNlKSA9PiBPYnNlcnZhYmxlPE1lc3NhZ2U+O1xuXG4vKipcbiAqIFJQQyBDb25maWcuIFNlZSB0aGUgZ3VpZGUgZm9yIGV4YW1wbGUuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFJQQ0NvbmZpZyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSByZXBseSBxdWV1ZVxuICAgKi9cbiAgcmVwbHlRdWV1ZU5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBTZXR1cCB0aGUgcmVwbHkgcXVldWVcbiAgICovXG4gIHNldHVwUmVwbHlRdWV1ZT86IHNldHVwUmVwbHlRdWV1ZUZuVHlwZTtcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01lc3NhZ2UsIFN0b21wSGVhZGVyc30gZnJvbSAnQHN0b21wL3N0b21wanMnO1xuaW1wb3J0IHtVVUlEfSBmcm9tICdhbmd1bGFyMi11dWlkJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIFN1YnNjcmlwdGlvbn0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7ZmlsdGVyLCBmaXJzdH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XG5pbXBvcnQge1N0b21wUlNlcnZpY2V9IGZyb20gXCIuL3N0b21wLXIuc2VydmljZVwiO1xuaW1wb3J0IHtzZXR1cFJlcGx5UXVldWVGblR5cGUsIFN0b21wUlBDQ29uZmlnfSBmcm9tIFwiLi9zdG9tcC1ycGMuY29uZmlnXCI7XG5cbi8qKlxuICogQW4gaW1wbGVtZW50YXRpb24gb2YgUlBDIHNlcnZpY2UgdXNpbmcgbWVzc2FnaW5nLlxuICpcbiAqIFBsZWFzZSBzZWUgdGhlIFtndWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3JwYy0tLXJlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sKSBmb3IgZGV0YWlscy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlBDU2VydmljZSB7XG4gIHByaXZhdGUgX3JlcGx5UXVldWVOYW1lID0gJy90ZW1wLXF1ZXVlL3JwYy1yZXBsaWVzJztcblxuICBwcml2YXRlIF9zZXR1cFJlcGx5UXVldWU6IHNldHVwUmVwbHlRdWV1ZUZuVHlwZSA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zdG9tcFNlcnZpY2UuZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZTtcbiAgfTtcblxuICBwcml2YXRlIF9yZXBsaWVzT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxNZXNzYWdlPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlLCBzZWUgdGhlIFtndWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3JwYy0tLXJlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sKSBmb3IgZGV0YWlscy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RvbXBTZXJ2aWNlOiBTdG9tcFJTZXJ2aWNlLCBwcml2YXRlIHN0b21wUlBDQ29uZmlnPzogU3RvbXBSUENDb25maWcpIHtcbiAgICBpZiAoc3RvbXBSUENDb25maWcpIHtcbiAgICAgIGlmIChzdG9tcFJQQ0NvbmZpZy5yZXBseVF1ZXVlTmFtZSkge1xuICAgICAgICB0aGlzLl9yZXBseVF1ZXVlTmFtZSA9IHN0b21wUlBDQ29uZmlnLnJlcGx5UXVldWVOYW1lO1xuICAgICAgfVxuICAgICAgaWYgKHN0b21wUlBDQ29uZmlnLnNldHVwUmVwbHlRdWV1ZSkge1xuICAgICAgICB0aGlzLl9zZXR1cFJlcGx5UXVldWUgPSBzdG9tcFJQQ0NvbmZpZy5zZXR1cFJlcGx5UXVldWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gUlBDIHJlcXVlc3QuIFNlZSB0aGUgW2d1aWRlXSguLi9hZGRpdGlvbmFsLWRvY3VtZW50YXRpb24vcnBjLS0tcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWwpIGZvciBleGFtcGxlLlxuICAgKi9cbiAgcHVibGljIHJwYyhzZXJ2aWNlRW5kUG9pbnQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nLCBoZWFkZXJzPzogU3RvbXBIZWFkZXJzKTogT2JzZXJ2YWJsZTxNZXNzYWdlPiB7XG4gICAgLy8gV2Uga25vdyB0aGVyZSB3aWxsIGJlIG9ubHkgb25lIG1lc3NhZ2UgaW4gcmVwbHlcbiAgICByZXR1cm4gdGhpcy5zdHJlYW0oc2VydmljZUVuZFBvaW50LCBwYXlsb2FkLCBoZWFkZXJzKS5waXBlKGZpcnN0KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gUlBDIHN0cmVhbSByZXF1ZXN0LiBTZWUgdGhlIFtndWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3JwYy0tLXJlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sKS5cbiAgICovXG4gIHB1YmxpYyBzdHJlYW0oc2VydmljZUVuZFBvaW50OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX3JlcGxpZXNPYnNlcnZhYmxlKSB7XG4gICAgICB0aGlzLl9yZXBsaWVzT2JzZXJ2YWJsZSA9IHRoaXMuX3NldHVwUmVwbHlRdWV1ZSh0aGlzLl9yZXBseVF1ZXVlTmFtZSwgdGhpcy5zdG9tcFNlcnZpY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShcbiAgICAgIChycGNPYnNlcnZlcjogT2JzZXJ2ZXI8TWVzc2FnZT4pID0+IHtcbiAgICAgICAgbGV0IGRlZmF1bHRNZXNzYWdlc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPSBVVUlELlVVSUQoKTtcblxuICAgICAgICBkZWZhdWx0TWVzc2FnZXNTdWJzY3JpcHRpb24gPSB0aGlzLl9yZXBsaWVzT2JzZXJ2YWJsZS5waXBlKGZpbHRlcigobWVzc2FnZTogTWVzc2FnZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlLmhlYWRlcnNbJ2NvcnJlbGF0aW9uLWlkJ10gPT09IGNvcnJlbGF0aW9uSWQ7XG4gICAgICAgIH0pKS5zdWJzY3JpYmUoKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IHtcbiAgICAgICAgICBycGNPYnNlcnZlci5uZXh0KG1lc3NhZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZW5kIGFuIFJQQyByZXF1ZXN0XG4gICAgICAgIGhlYWRlcnNbJ3JlcGx5LXRvJ10gPSB0aGlzLl9yZXBseVF1ZXVlTmFtZTtcbiAgICAgICAgaGVhZGVyc1snY29ycmVsYXRpb24taWQnXSA9IGNvcnJlbGF0aW9uSWQ7XG5cbiAgICAgICAgdGhpcy5zdG9tcFNlcnZpY2UucHVibGlzaChzZXJ2aWNlRW5kUG9pbnQsIHBheWxvYWQsIGhlYWRlcnMpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7IC8vIENsZWFudXBcbiAgICAgICAgICBkZWZhdWx0TWVzc2FnZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiQmVoYXZpb3JTdWJqZWN0IiwiZmlsdGVyIiwiU3ViamVjdCIsIlN0b21wLmNsaWVudCIsIlN0b21wLm92ZXIiLCJ0c2xpYl8xLl9fdmFsdWVzIiwiT2JzZXJ2YWJsZSIsInNoYXJlIiwiZmlyc3QiLCJJbmplY3RhYmxlIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJVVUlEIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQTtJQUVBLElBQUksYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDN0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO2FBQ2hDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVFLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvRSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBRUYsdUJBQTBCLENBQUMsRUFB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