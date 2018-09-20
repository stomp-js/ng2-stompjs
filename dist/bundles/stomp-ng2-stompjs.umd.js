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
    var StompRPCService = (function () {
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
                return this.stream(serviceEndPoint, payload).pipe(operators.first());
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
                return rxjs.Observable.create(function (rpcObserver) {
                    var /** @type {?} */ defaultMessagesSubscription;
                    var /** @type {?} */ correlationId = angular2Uuid.UUID.UUID();
                    defaultMessagesSubscription = _this.messagesObservable.pipe(operators.filter(function (message) {
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        StompRPCService.ctorParameters = function () {
            return [
                { type: StompService, },
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

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9zdG9tcC1yLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAuY29uZmlnLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAtcnBjLnNlcnZpY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBmaXJzdCwgZmlsdGVyLCBzaGFyZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCAsICBPYnNlcnZhYmxlICwgIE9ic2VydmVyICwgIFN1YmplY3QgLCAgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFN0b21wQ29uZmlnIH0gZnJvbSAnLi9zdG9tcC5jb25maWcnO1xuXG5pbXBvcnQgKiBhcyBTdG9tcCBmcm9tICdAc3RvbXAvc3RvbXBqcyc7XG5pbXBvcnQgeyBGcmFtZSwgU3RvbXBTdWJzY3JpcHRpb24gfSBmcm9tICdAc3RvbXAvc3RvbXBqcyc7XG5pbXBvcnQgeyBTdG9tcEhlYWRlcnMgfSBmcm9tICcuL3N0b21wLWhlYWRlcnMnO1xuaW1wb3J0IHsgU3RvbXBTdGF0ZSB9IGZyb20gJy4vc3RvbXAtc3RhdGUnO1xuXG4vKipcbiAqIEFuZ3VsYXIyIFNUT01QIFJhdyBTZXJ2aWNlIHVzaW5nIEBzdG9tcC9zdG9tcC5qc1xuICpcbiAqIFlvdSB3aWxsIG9ubHkgbmVlZCB0aGUgcHVibGljIHByb3BlcnRpZXMgYW5kXG4gKiBtZXRob2RzIGxpc3RlZCB1bmxlc3MgeW91IGFyZSBhbiBhZHZhbmNlZCB1c2VyLiBUaGlzIHNlcnZpY2UgaGFuZGxlcyBzdWJzY3JpYmluZyB0byBhXG4gKiBtZXNzYWdlIHF1ZXVlIHVzaW5nIHRoZSBzdG9tcC5qcyBsaWJyYXJ5LCBhbmQgcmV0dXJuc1xuICogdmFsdWVzIHZpYSB0aGUgRVM2IE9ic2VydmFibGUgc3BlY2lmaWNhdGlvbiBmb3JcbiAqIGFzeW5jaHJvbm91cyB2YWx1ZSBzdHJlYW1pbmcgYnkgd2lyaW5nIHRoZSBTVE9NUFxuICogbWVzc2FnZXMgaW50byBhbiBvYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSB3aWxsIGxpa2UgdG8gcGFzcyB0aGUgY29uZmlndXJhdGlvbiBhcyBhIGRlcGVuZGVuY3ksXG4gKiBwbGVhc2UgdXNlIFN0b21wU2VydmljZSBjbGFzcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlNlcnZpY2Uge1xuICAvKipcbiAgICogU3RhdGUgb2YgdGhlIFNUT01QU2VydmljZVxuICAgKlxuICAgKiBJdCBpcyBhIEJlaGF2aW9yU3ViamVjdCBhbmQgd2lsbCBlbWl0IGN1cnJlbnQgc3RhdHVzIGltbWVkaWF0ZWx5LiBUaGlzIHdpbGwgdHlwaWNhbGx5IGdldFxuICAgKiB1c2VkIHRvIHNob3cgY3VycmVudCBzdGF0dXMgdG8gdGhlIGVuZCB1c2VyLlxuICAgKi9cbiAgcHVibGljIHN0YXRlOiBCZWhhdmlvclN1YmplY3Q8U3RvbXBTdGF0ZT47XG5cbiAgLyoqXG4gICAqIFdpbGwgdHJpZ2dlciB3aGVuIGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQuIFVzZSB0aGlzIHRvIGNhcnJ5IG91dCBpbml0aWFsaXphdGlvbi5cbiAgICogSXQgd2lsbCB0cmlnZ2VyIGV2ZXJ5IHRpbWUgYSAocmUpY29ubmVjdGlvbiBvY2N1cnMuIElmIGl0IGlzIGFscmVhZHkgY29ubmVjdGVkXG4gICAqIGl0IHdpbGwgdHJpZ2dlciBpbW1lZGlhdGVseS4gWW91IGNhbiBzYWZlbHkgaWdub3JlIHRoZSB2YWx1ZSwgYXMgaXQgd2lsbCBhbHdheXMgYmVcbiAgICogU3RvbXBTdGF0ZS5DT05ORUNURURcbiAgICovXG4gIHB1YmxpYyBjb25uZWN0T2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxTdG9tcFN0YXRlPjtcblxuICAvKipcbiAgICogUHJvdmlkZXMgaGVhZGVycyBmcm9tIG1vc3QgcmVjZW50IGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBhcyByZXR1cm4gYnkgdGhlIENPTk5FQ1RFRFxuICAgKiBmcmFtZS5cbiAgICogSWYgdGhlIFNUT01QIGNvbm5lY3Rpb24gaGFzIGFscmVhZHkgYmVlbiBlc3RhYmxpc2hlZCBpdCB3aWxsIHRyaWdnZXIgaW1tZWRpYXRlbHkuXG4gICAqIEl0IHdpbGwgYWRkaXRpb25hbGx5IHRyaWdnZXIgaW4gZXZlbnQgb2YgcmVjb25uZWN0aW9uLCB0aGUgdmFsdWUgd2lsbCBiZSBzZXQgb2YgaGVhZGVycyBmcm9tXG4gICAqIHRoZSByZWNlbnQgc2VydmVyIHJlc3BvbnNlLlxuICAgKi9cbiAgcHVibGljIHNlcnZlckhlYWRlcnNPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFN0b21wSGVhZGVycz47XG5cbiAgcHJpdmF0ZSBfc2VydmVySGVhZGVyc0JlaGF2aW91clN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxudWxsIHwgU3RvbXBIZWFkZXJzPjtcblxuICAvKipcbiAgICogV2lsbCBlbWl0IGFsbCBtZXNzYWdlcyB0byB0aGUgZGVmYXVsdCBxdWV1ZSAoYW55IG1lc3NhZ2UgdGhhdCBhcmUgbm90IGhhbmRsZWQgYnkgYSBzdWJzY3JpcHRpb24pXG4gICAqL1xuICBwdWJsaWMgZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZTogU3ViamVjdDxTdG9tcC5NZXNzYWdlPjtcblxuICAvKipcbiAgICogV2lsbCBlbWl0IGFsbCByZWNlaXB0c1xuICAgKi9cbiAgcHVibGljIHJlY2VpcHRzT2JzZXJ2YWJsZTogU3ViamVjdDxTdG9tcC5GcmFtZT47XG5cbiAgLyoqXG4gICAqIFdpbGwgdHJpZ2dlciB3aGVuIGFuIGVycm9yIG9jY3Vycy4gVGhpcyBTdWJqZWN0IGNhbiBiZSB1c2VkIHRvIGhhbmRsZSBlcnJvcnMgZnJvbVxuICAgKiB0aGUgc3RvbXAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGVycm9yU3ViamVjdDogU3ViamVjdDxzdHJpbmcgfCBTdG9tcC5NZXNzYWdlPjtcblxuICAvKipcbiAgICogSW50ZXJuYWwgYXJyYXkgdG8gaG9sZCBsb2NhbGx5IHF1ZXVlZCBtZXNzYWdlcyB3aGVuIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIHF1ZXVlZE1lc3NhZ2VzOiB7IHF1ZXVlTmFtZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGhlYWRlcnM6IFN0b21wSGVhZGVycyB9W10gPSBbXTtcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBfY29uZmlnOiBTdG9tcENvbmZpZztcblxuICAvKipcbiAgICogU1RPTVAgQ2xpZW50IGZyb20gQHN0b21wL3N0b21wLmpzXG4gICAqL1xuICBwcm90ZWN0ZWQgY2xpZW50OiBTdG9tcC5DbGllbnQ7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIFNlZSBSRUFETUUgYW5kIHNhbXBsZXMgZm9yIGNvbmZpZ3VyYXRpb24gZXhhbXBsZXNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0YXRlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTdG9tcFN0YXRlPihTdG9tcFN0YXRlLkNMT1NFRCk7XG5cbiAgICB0aGlzLmNvbm5lY3RPYnNlcnZhYmxlID0gdGhpcy5zdGF0ZS5waXBlKFxuICAgICAgZmlsdGVyKChjdXJyZW50U3RhdGU6IFN0b21wU3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTdGF0ZSA9PT0gU3RvbXBTdGF0ZS5DT05ORUNURUQ7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBTZXR1cCBzZW5kaW5nIHF1ZXVlZE1lc3NhZ2VzXG4gICAgdGhpcy5jb25uZWN0T2JzZXJ2YWJsZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zZW5kUXVldWVkTWVzc2FnZXMoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3NlcnZlckhlYWRlcnNCZWhhdmlvdXJTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudWxsIHwgU3RvbXBIZWFkZXJzPihudWxsKTtcblxuICAgIHRoaXMuc2VydmVySGVhZGVyc09ic2VydmFibGUgPSB0aGlzLl9zZXJ2ZXJIZWFkZXJzQmVoYXZpb3VyU3ViamVjdC5waXBlKFxuICAgICAgZmlsdGVyKChoZWFkZXJzOiBudWxsIHwgU3RvbXBIZWFkZXJzKSA9PiB7XG4gICAgICAgIHJldHVybiBoZWFkZXJzICE9PSBudWxsO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5lcnJvclN1YmplY3QgPSBuZXcgU3ViamVjdCgpO1xuICB9XG5cbiAgLyoqIFNldCBjb25maWd1cmF0aW9uICovXG4gIHNldCBjb25maWcodmFsdWU6IFN0b21wQ29uZmlnKSB7XG4gICAgdGhpcy5fY29uZmlnID0gdmFsdWU7XG4gIH1cblxuICAvKiogSXQgd2lsbCBpbml0aWFsaXplIFNUT01QIENsaWVudC4gKi9cbiAgcHJvdGVjdGVkIGluaXRTdG9tcENsaWVudCgpOiB2b2lkIHtcbiAgICAvLyBkaXNjb25uZWN0IGlmIGNvbm5lY3RlZFxuICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuXG4gICAgLy8gdXJsIHRha2VzIHByZWNlZGVuY2Ugb3ZlciBzb2NrZXRGblxuICAgIGlmICh0eXBlb2YodGhpcy5fY29uZmlnLnVybCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmNsaWVudCA9IFN0b21wLmNsaWVudCh0aGlzLl9jb25maWcudXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGllbnQgPSBTdG9tcC5vdmVyKHRoaXMuX2NvbmZpZy51cmwpO1xuICAgIH1cblxuICAgIC8vIENvbmZpZ3VyZSBjbGllbnQgaGVhcnQtYmVhdGluZ1xuICAgIHRoaXMuY2xpZW50LmhlYXJ0YmVhdC5pbmNvbWluZyA9IHRoaXMuX2NvbmZpZy5oZWFydGJlYXRfaW47XG4gICAgdGhpcy5jbGllbnQuaGVhcnRiZWF0Lm91dGdvaW5nID0gdGhpcy5fY29uZmlnLmhlYXJ0YmVhdF9vdXQ7XG5cbiAgICAvLyBBdXRvIHJlY29ubmVjdFxuICAgIHRoaXMuY2xpZW50LnJlY29ubmVjdF9kZWxheSA9IHRoaXMuX2NvbmZpZy5yZWNvbm5lY3RfZGVsYXk7XG5cbiAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1ZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIFNldCBmdW5jdGlvbiB0byBkZWJ1ZyBwcmludCBtZXNzYWdlc1xuICAgIHRoaXMuY2xpZW50LmRlYnVnID0gdGhpcy5kZWJ1ZztcblxuICAgIC8vIERlZmF1bHQgbWVzc2FnZXNcbiAgICB0aGlzLnNldHVwT25SZWNlaXZlKCk7XG5cbiAgICAvLyBSZWNlaXB0c1xuICAgIHRoaXMuc2V0dXBSZWNlaXB0cygpO1xuICB9XG5cblxuICAvKipcbiAgICogSXQgd2lsbCBjb25uZWN0IHRvIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgaW5pdEFuZENvbm5lY3QoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0U3RvbXBDbGllbnQoKTtcblxuICAgIGlmICghdGhpcy5fY29uZmlnLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5oZWFkZXJzID0ge307XG4gICAgfVxuXG4gICAgLy8gQXR0ZW1wdCBjb25uZWN0aW9uLCBwYXNzaW5nIGluIGEgY2FsbGJhY2tcbiAgICB0aGlzLmNsaWVudC5jb25uZWN0KFxuICAgICAgdGhpcy5fY29uZmlnLmhlYWRlcnMsXG4gICAgICB0aGlzLm9uX2Nvbm5lY3QsXG4gICAgICB0aGlzLm9uX2Vycm9yXG4gICAgKTtcblxuICAgIHRoaXMuZGVidWcoJ0Nvbm5lY3RpbmcuLi4nKTtcbiAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5UUllJTkcpO1xuICB9XG5cblxuICAvKipcbiAgICogSXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBkaXNjb25uZWN0KCk6IHZvaWQge1xuXG4gICAgLy8gRGlzY29ubmVjdCBpZiBjb25uZWN0ZWQuIENhbGxiYWNrIHdpbGwgc2V0IENMT1NFRCBzdGF0ZVxuICAgIGlmICh0aGlzLmNsaWVudCkge1xuICAgICAgaWYgKCF0aGlzLmNsaWVudC5jb25uZWN0ZWQpIHtcbiAgICAgICAgLy8gTm90aGluZyB0byBkb1xuICAgICAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5DTE9TRUQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdGlmeSBvYnNlcnZlcnMgdGhhdCB3ZSBhcmUgZGlzY29ubmVjdGluZyFcbiAgICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLkRJU0NPTk5FQ1RJTkcpO1xuXG4gICAgICB0aGlzLmNsaWVudC5kaXNjb25uZWN0KFxuICAgICAgICAoKSA9PiB0aGlzLnN0YXRlLm5leHQoU3RvbXBTdGF0ZS5DTE9TRUQpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHJldHVybiBgdHJ1ZWAgaWYgU1RPTVAgYnJva2VyIGlzIGNvbm5lY3RlZCBhbmQgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqL1xuICBwdWJsaWMgY29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmdldFZhbHVlKCkgPT09IFN0b21wU3RhdGUuQ09OTkVDVEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgc2VuZCBhIG1lc3NhZ2UgdG8gYSBuYW1lZCBkZXN0aW5hdGlvbi4gVGhlIG1lc3NhZ2UgbXVzdCBiZSBgc3RyaW5nYC5cbiAgICpcbiAgICogVGhlIG1lc3NhZ2Ugd2lsbCBnZXQgbG9jYWxseSBxdWV1ZWQgaWYgdGhlIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLiBJdCB3aWxsIGF0dGVtcHQgdG9cbiAgICogcHVibGlzaCBxdWV1ZWQgbWVzc2FnZXMgYXMgc29vbiBhcyB0aGUgYnJva2VyIGdldHMgY29ubmVjdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcXVldWVOYW1lXG4gICAqIEBwYXJhbSBtZXNzYWdlXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChxdWV1ZU5hbWU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLmNsaWVudC5zZW5kKHF1ZXVlTmFtZSwgaGVhZGVycywgbWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVidWcoYE5vdCBjb25uZWN0ZWQsIHF1ZXVlaW5nICR7bWVzc2FnZX1gKTtcbiAgICAgIHRoaXMucXVldWVkTWVzc2FnZXMucHVzaCh7cXVldWVOYW1lOiA8c3RyaW5nPnF1ZXVlTmFtZSwgbWVzc2FnZTogPHN0cmluZz5tZXNzYWdlLCBoZWFkZXJzOiBoZWFkZXJzfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEl0IHdpbGwgc2VuZCBxdWV1ZWQgbWVzc2FnZXMuICovXG4gIHByb3RlY3RlZCBzZW5kUXVldWVkTWVzc2FnZXMoKTogdm9pZCB7XG4gICAgY29uc3QgcXVldWVkTWVzc2FnZXMgPSB0aGlzLnF1ZXVlZE1lc3NhZ2VzO1xuICAgIHRoaXMucXVldWVkTWVzc2FnZXMgPSBbXTtcblxuICAgIHRoaXMuZGVidWcoYFdpbGwgdHJ5IHNlbmRpbmcgcXVldWVkIG1lc3NhZ2VzICR7cXVldWVkTWVzc2FnZXN9YCk7XG5cbiAgICBmb3IgKGNvbnN0IHF1ZXVlZE1lc3NhZ2Ugb2YgcXVldWVkTWVzc2FnZXMpIHtcbiAgICAgIHRoaXMuZGVidWcoYEF0dGVtcHRpbmcgdG8gc2VuZCAke3F1ZXVlZE1lc3NhZ2V9YCk7XG4gICAgICB0aGlzLnB1Ymxpc2gocXVldWVkTWVzc2FnZS5xdWV1ZU5hbWUsIHF1ZXVlZE1lc3NhZ2UubWVzc2FnZSwgcXVldWVkTWVzc2FnZS5oZWFkZXJzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBzdWJzY3JpYmUgdG8gc2VydmVyIG1lc3NhZ2UgcXVldWVzXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzYWZlbHkgY2FsbGVkIGV2ZW4gaWYgdGhlIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLlxuICAgKiBJZiB0aGUgdW5kZXJseWluZyBTVE9NUCBjb25uZWN0aW9uIGRyb3BzIGFuZCByZWNvbm5lY3RzLCBpdCB3aWxsIHJlc3Vic2NyaWJlIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIElmIGEgaGVhZGVyIGZpZWxkICdhY2snIGlzIG5vdCBleHBsaWNpdGx5IHBhc3NlZCwgJ2Fjaycgd2lsbCBiZSBzZXQgdG8gJ2F1dG8nLiBJZiB5b3VcbiAgICogZG8gbm90IHVuZGVyc3RhbmQgd2hhdCBpdCBtZWFucywgcGxlYXNlIGxlYXZlIGl0IGFzIGlzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgd2hlbiB3b3JraW5nIHdpdGggdGVtcG9yYXJ5IHF1ZXVlcyB3aGVyZSB0aGUgc3Vic2NyaXB0aW9uIHJlcXVlc3RcbiAgICogY3JlYXRlcyB0aGVcbiAgICogdW5kZXJseWluZyBxdWV1ZSwgbXNzYWdlcyBtaWdodCBiZSBtaXNzZWQgZHVyaW5nIHJlY29ubmVjdC4gVGhpcyBpc3N1ZSBpcyBub3Qgc3BlY2lmaWNcbiAgICogdG8gdGhpcyBsaWJyYXJ5IGJ1dCB0aGUgd2F5IFNUT01QIGJyb2tlcnMgYXJlIGRlc2lnbmVkIHRvIHdvcmsuXG4gICAqXG4gICAqIEBwYXJhbSBxdWV1ZU5hbWVcbiAgICogQHBhcmFtIGhlYWRlcnNcbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUocXVldWVOYW1lOiBzdHJpbmcsIGhlYWRlcnM6IFN0b21wSGVhZGVycyA9IHt9KTogT2JzZXJ2YWJsZTxTdG9tcC5NZXNzYWdlPiB7XG5cbiAgICAvKiBXZWxsIHRoZSBsb2dpYyBpcyBjb21wbGljYXRlZCBidXQgd29ya3MgYmVhdXRpZnVsbHkuIFJ4SlMgaXMgaW5kZWVkIHdvbmRlcmZ1bC5cbiAgICAgKlxuICAgICAqIFdlIG5lZWQgdG8gYWN0aXZhdGUgdGhlIHVuZGVybHlpbmcgc3Vic2NyaXB0aW9uIGltbWVkaWF0ZWx5IGlmIFN0b21wIGlzIGNvbm5lY3RlZC4gSWYgbm90IGl0IHNob3VsZFxuICAgICAqIHN1YnNjcmliZSB3aGVuIGl0IGdldHMgbmV4dCBjb25uZWN0ZWQuIEZ1cnRoZXIgaXQgc2hvdWxkIHJlIGVzdGFibGlzaCB0aGUgc3Vic2NyaXB0aW9uIHdoZW5ldmVyIFN0b21wXG4gICAgICogc3VjY2Vzc2Z1bGx5IHJlY29ubmVjdHMuXG4gICAgICpcbiAgICAgKiBBY3R1YWwgaW1wbGVtZW50YXRpb24gaXMgc2ltcGxlLCB3ZSBmaWx0ZXIgdGhlIEJlaGF2aW91clN1YmplY3QgJ3N0YXRlJyBzbyB0aGF0IHdlIGNhbiB0cmlnZ2VyIHdoZW5ldmVyIFN0b21wIGlzXG4gICAgICogY29ubmVjdGVkLiBTaW5jZSAnc3RhdGUnIGlzIGEgQmVoYXZpb3VyU3ViamVjdCwgaWYgU3RvbXAgaXMgYWxyZWFkeSBjb25uZWN0ZWQsIGl0IHdpbGwgaW1tZWRpYXRlbHkgdHJpZ2dlci5cbiAgICAgKlxuICAgICAqIFRoZSBvYnNlcnZhYmxlIHRoYXQgd2UgcmV0dXJuIHRvIGNhbGxlciByZW1haW5zIHNhbWUgYWNyb3NzIGFsbCByZWNvbm5lY3RzLCBzbyBubyBzcGVjaWFsIGhhbmRsaW5nIG5lZWRlZCBhdFxuICAgICAqIHRoZSBtZXNzYWdlIHN1YnNjcmliZXIuXG4gICAgICovXG4gICAgdGhpcy5kZWJ1ZyhgUmVxdWVzdCB0byBzdWJzY3JpYmUgJHtxdWV1ZU5hbWV9YCk7XG5cbiAgICAvLyBCeSBkZWZhdWx0IGF1dG8gYWNrbm93bGVkZ2VtZW50IG9mIG1lc3NhZ2VzXG4gICAgaWYgKCFoZWFkZXJzWydhY2snXSkge1xuICAgICAgaGVhZGVyc1snYWNrJ10gPSAnYXV0byc7XG4gICAgfVxuXG4gICAgY29uc3QgY29sZE9ic2VydmFibGUgPSBPYnNlcnZhYmxlLmNyZWF0ZShcbiAgICAgIChtZXNzYWdlczogT2JzZXJ2ZXI8U3RvbXAuTWVzc2FnZT4pID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICogVGhlc2UgdmFyaWFibGVzIHdpbGwgYmUgdXNlZCBhcyBwYXJ0IG9mIHRoZSBjbG9zdXJlIGFuZCB3b3JrIHRoZWlyIG1hZ2ljIGR1cmluZyB1bnN1YnNjcmliZVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHN0b21wU3Vic2NyaXB0aW9uOiBTdG9tcFN1YnNjcmlwdGlvbjtcblxuICAgICAgICBsZXQgc3RvbXBDb25uZWN0ZWRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgICAgICBzdG9tcENvbm5lY3RlZFN1YnNjcmlwdGlvbiA9IHRoaXMuY29ubmVjdE9ic2VydmFibGVcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFdpbGwgc3Vic2NyaWJlIHRvICR7cXVldWVOYW1lfWApO1xuICAgICAgICAgICAgc3RvbXBTdWJzY3JpcHRpb24gPSB0aGlzLmNsaWVudC5zdWJzY3JpYmUocXVldWVOYW1lLCAobWVzc2FnZTogU3RvbXAuTWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLm5leHQobWVzc2FnZSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGhlYWRlcnMpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7IC8qIGNsZWFudXAgZnVuY3Rpb24sIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm8gc3Vic2NyaWJlcnMgYXJlIGxlZnQgKi9cbiAgICAgICAgICB0aGlzLmRlYnVnKGBTdG9wIHdhdGNoaW5nIGNvbm5lY3Rpb24gc3RhdGUgKGZvciAke3F1ZXVlTmFtZX0pYCk7XG4gICAgICAgICAgc3RvbXBDb25uZWN0ZWRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblxuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmdldFZhbHVlKCkgPT09IFN0b21wU3RhdGUuQ09OTkVDVEVEKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBXaWxsIHVuc3Vic2NyaWJlIGZyb20gJHtxdWV1ZU5hbWV9IGF0IFN0b21wYCk7XG4gICAgICAgICAgICBzdG9tcFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTdG9tcCBub3QgY29ubmVjdGVkLCBubyBuZWVkIHRvIHVuc3Vic2NyaWJlIGZyb20gJHtxdWV1ZU5hbWV9IGF0IFN0b21wYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBJbXBvcnRhbnQgLSBjb252ZXJ0IGl0IHRvIGhvdCBPYnNlcnZhYmxlIC0gb3RoZXJ3aXNlLCBpZiB0aGUgdXNlciBjb2RlIHN1YnNjcmliZXNcbiAgICAgKiB0byB0aGlzIG9ic2VydmFibGUgdHdpY2UsIGl0IHdpbGwgc3Vic2NyaWJlIHR3aWNlIHRvIFN0b21wIGJyb2tlci4gKFRoaXMgd2FzIGhhcHBlbmluZyBpbiB0aGUgY3VycmVudCBleGFtcGxlKS5cbiAgICAgKiBBIGxvbmcgYnV0IGdvb2QgZXhwbGFuYXRvcnkgYXJ0aWNsZSBhdCBodHRwczovL21lZGl1bS5jb20vQGJlbmxlc2gvaG90LXZzLWNvbGQtb2JzZXJ2YWJsZXMtZjgwOTRlZDUzMzM5XG4gICAgICovXG4gICAgcmV0dXJuIGNvbGRPYnNlcnZhYmxlLnBpcGUoc2hhcmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBoYW5kbGUgbWVzc2FnZXMgcmVjZWl2ZWQgaW4gdGhlIGRlZmF1bHQgcXVldWUuIE1lc3NhZ2VzIHRoYXQgd291bGQgbm90IGJlIGhhbmRsZWQgb3RoZXJ3aXNlXG4gICAqIGdldCBkZWxpdmVyZWQgdG8gdGhlIGRlZmF1bHQgcXVldWUuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0dXBPblJlY2VpdmUoKTogdm9pZCB7XG4gICAgdGhpcy5kZWZhdWx0TWVzc2FnZXNPYnNlcnZhYmxlID0gbmV3IFN1YmplY3QoKTtcblxuICAgIHRoaXMuY2xpZW50Lm9ucmVjZWl2ZSA9IChtZXNzYWdlOiBTdG9tcC5NZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLmRlZmF1bHRNZXNzYWdlc09ic2VydmFibGUubmV4dChtZXNzYWdlKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgZW1pdCBhbGwgcmVjZWlwdHMuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0dXBSZWNlaXB0cygpOiB2b2lkIHtcbiAgICB0aGlzLnJlY2VpcHRzT2JzZXJ2YWJsZSA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgICB0aGlzLmNsaWVudC5vbnJlY2VpcHQgPSAoZnJhbWU6IFN0b21wLkZyYW1lKSA9PiB7XG4gICAgICB0aGlzLnJlY2VpcHRzT2JzZXJ2YWJsZS5uZXh0KGZyYW1lKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXQgZm9yIHJlY2VpcHQsIHRoaXMgaW5kaWNhdGVzIHRoYXQgc2VydmVyIGhhcyBjYXJyaWVkIG91dCB0aGUgcmVsYXRlZCBvcGVyYXRpb25cbiAgICovXG4gIHB1YmxpYyB3YWl0Rm9yUmVjZWlwdChyZWNlaXB0SWQ6IHN0cmluZywgY2FsbGJhY2s6IChmcmFtZTogU3RvbXAuRnJhbWUpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLnJlY2VpcHRzT2JzZXJ2YWJsZS5waXBlKFxuICAgICAgZmlsdGVyKChmcmFtZTogU3RvbXAuRnJhbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIGZyYW1lLmhlYWRlcnNbJ3JlY2VpcHQtaWQnXSA9PT0gcmVjZWlwdElkO1xuICAgICAgfSksXG4gICAgICBmaXJzdCgpXG4gICAgKS5zdWJzY3JpYmUoKGZyYW1lOiBTdG9tcC5GcmFtZSkgPT4ge1xuICAgICAgY2FsbGJhY2soZnJhbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIEZ1bmN0aW9uc1xuICAgKlxuICAgKiBOb3RlIHRoZSBtZXRob2Qgc2lnbmF0dXJlOiAoKSA9PiBwcmVzZXJ2ZXMgbGV4aWNhbCBzY29wZVxuICAgKiBpZiB3ZSBuZWVkIHRvIHVzZSB0aGlzLnggaW5zaWRlIHRoZSBmdW5jdGlvblxuICAgKi9cbiAgcHJvdGVjdGVkIGRlYnVnID0gKGFyZ3M6IGFueSk6IHZvaWQgPT4ge1xuICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCksIGFyZ3MpO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIHJ1biBvbiBzdWNjZXNzZnVsbHkgY29ubmVjdGluZyB0byBzZXJ2ZXIgKi9cbiAgcHJvdGVjdGVkIG9uX2Nvbm5lY3QgPSAoZnJhbWU6IEZyYW1lKSA9PiB7XG5cbiAgICB0aGlzLmRlYnVnKCdDb25uZWN0ZWQnKTtcblxuICAgIHRoaXMuX3NlcnZlckhlYWRlcnNCZWhhdmlvdXJTdWJqZWN0Lm5leHQoZnJhbWUuaGVhZGVycyk7XG5cbiAgICAvLyBJbmRpY2F0ZSBvdXIgY29ubmVjdGVkIHN0YXRlIHRvIG9ic2VydmVyc1xuICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLkNPTk5FQ1RFRCk7XG4gIH1cblxuICAvKiogSGFuZGxlIGVycm9ycyBmcm9tIHN0b21wLmpzICovXG4gIHByb3RlY3RlZCBvbl9lcnJvciA9IChlcnJvcjogc3RyaW5nIHwgU3RvbXAuTWVzc2FnZSkgPT4ge1xuXG4gICAgLy8gVHJpZ2dlciB0aGUgZXJyb3Igc3ViamVjdFxuICAgIHRoaXMuZXJyb3JTdWJqZWN0Lm5leHQoZXJyb3IpO1xuXG4gICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGVycm9yID0gKDxTdG9tcC5NZXNzYWdlPmVycm9yKS5ib2R5O1xuICAgIH1cblxuICAgIHRoaXMuZGVidWcoYEVycm9yOiAke2Vycm9yfWApO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGRyb3BwZWQgY29ubmVjdGlvbiBhbmQgdHJ5IHJlY29ubmVjdGluZ1xuICAgIGlmICghdGhpcy5jbGllbnQuY29ubmVjdGVkKSB7XG4gICAgICAvLyBSZXNldCBzdGF0ZSBpbmRpY2F0b3JcbiAgICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFN0YXRlLkNMT1NFRCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdG9tcEhlYWRlcnMgfSBmcm9tICcuL3N0b21wLWhlYWRlcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuLyoqXG4gKiBSZXByZXNlbnRzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZVxuICogU1RPTVBTZXJ2aWNlIHRvIGNvbm5lY3QgdG8uXG4gKi9cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNlcnZlciBVUkwgdG8gY29ubmVjdCB0by4gUGxlYXNlIHJlZmVyIHRvIHlvdXIgU1RPTVAgYnJva2VyIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMuXG4gICAqXG4gICAqIEV4YW1wbGU6IHdzOi8vMTI3LjAuMC4xOjE1Njc0L3dzIChmb3IgYSBSYWJiaXRNUSBkZWZhdWx0IHNldHVwIHJ1bm5pbmcgb24gbG9jYWxob3N0KVxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5IHRoaXMgcGFyYW1ldGVyIGNhbiBiZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYmplY3Qgc2ltaWxhciB0byBXZWJTb2NrZXRcbiAgICogKHR5cGljYWxseSBTb2NrSlMgaW5zdGFuY2UpLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKlxuICAgKiAoKSA9PiB7XG4gICAqICAgcmV0dXJuIG5ldyBTb2NrSlMoJ2h0dHA6Ly8xMjcuMC4wLjE6MTU2NzQvc3RvbXAnKTtcbiAgICogfVxuICAgKi9cbiAgdXJsOiBzdHJpbmcgfCAoKCkgPT4gYW55KTtcblxuICAvKipcbiAgICogSGVhZGVyc1xuICAgKiBUeXBpY2FsIGtleXM6IGxvZ2luOiBzdHJpbmcsIHBhc3Njb2RlOiBzdHJpbmcuXG4gICAqIGhvc3Q6c3RyaW5nIHdpbGwgbmVlZWQgdG8gYmUgcGFzc2VkIGZvciB2aXJ0dWFsIGhvc3RzIGluIFJhYmJpdE1RXG4gICAqL1xuICBoZWFkZXJzOiBTdG9tcEhlYWRlcnM7XG5cbiAgLyoqIEhvdyBvZnRlbiB0byBpbmNvbWluZyBoZWFydGJlYXQ/XG4gICAqIEludGVydmFsIGluIG1pbGxpc2Vjb25kcywgc2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDAgLSBkaXNhYmxlZFxuICAgKi9cbiAgaGVhcnRiZWF0X2luOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhvdyBvZnRlbiB0byBvdXRnb2luZyBoZWFydGJlYXQ/XG4gICAqIEludGVydmFsIGluIG1pbGxpc2Vjb25kcywgc2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDIwMDAwIC0gZXZlcnkgMjAgc2Vjb25kc1xuICAgKi9cbiAgaGVhcnRiZWF0X291dDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXYWl0IGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgYXR0ZW1wdGluZyBhdXRvIHJlY29ubmVjdFxuICAgKiBTZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgNTAwMCAoNSBzZWNvbmRzKVxuICAgKi9cbiAgcmVjb25uZWN0X2RlbGF5OiBudW1iZXI7XG5cbiAgLyoqIEVuYWJsZSBjbGllbnQgZGVidWdnaW5nPyAqL1xuICBkZWJ1ZzogYm9vbGVhbjtcbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU3RvbXBDb25maWcgfSBmcm9tICcuL3N0b21wLmNvbmZpZyc7XG5cbmltcG9ydCB7IFN0b21wUlNlcnZpY2UgfSBmcm9tICcuL3N0b21wLXIuc2VydmljZSc7XG5cbi8qKlxuICogQW5ndWxhcjIgU1RPTVAgU2VydmljZSB1c2luZyBAc3RvbXAvc3RvbXAuanNcbiAqXG4gKiBAZGVzY3JpcHRpb24gVGhpcyBzZXJ2aWNlIGhhbmRsZXMgc3Vic2NyaWJpbmcgdG8gYVxuICogbWVzc2FnZSBxdWV1ZSB1c2luZyB0aGUgc3RvbXAuanMgbGlicmFyeSwgYW5kIHJldHVybnNcbiAqIHZhbHVlcyB2aWEgdGhlIEVTNiBPYnNlcnZhYmxlIHNwZWNpZmljYXRpb24gZm9yXG4gKiBhc3luY2hyb25vdXMgdmFsdWUgc3RyZWFtaW5nIGJ5IHdpcmluZyB0aGUgU1RPTVBcbiAqIG1lc3NhZ2VzIGludG8gYW4gb2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byBtYW51YWxseSBjb25maWd1cmUgYW5kIGluaXRpYWxpemUgdGhlIHNlcnZpY2VcbiAqIHBsZWFzZSB1c2UgU3RvbXBSU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBTZXJ2aWNlIGV4dGVuZHMgU3RvbXBSU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIFNlZSBSRUFETUUgYW5kIHNhbXBsZXMgZm9yIGNvbmZpZ3VyYXRpb24gZXhhbXBsZXNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuaW5pdEFuZENvbm5lY3QoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3RvbXBTZXJ2aWNlIH0gZnJvbSAnLi9zdG9tcC5zZXJ2aWNlJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICdAc3RvbXAvc3RvbXBqcyc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnYW5ndWxhcjItdXVpZCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciwgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IGZpbHRlciwgZmlyc3QgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlBDU2VydmljZSB7XG4gIHByb3RlY3RlZCByZXBseVF1ZXVlID0gJ3JwYy1yZXBsaWVzJztcblxuICBwcm90ZWN0ZWQgbWVzc2FnZXNPYnNlcnZhYmxlOiBTdWJqZWN0PE1lc3NhZ2U+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RvbXBTZXJ2aWNlOiBTdG9tcFNlcnZpY2UpIHtcbiAgICB0aGlzLm1lc3NhZ2VzT2JzZXJ2YWJsZSA9IHRoaXMuc3RvbXBTZXJ2aWNlLmRlZmF1bHRNZXNzYWdlc09ic2VydmFibGU7XG4gIH1cblxuICBwdWJsaWMgcnBjKHNlcnZpY2VFbmRQb2ludDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPE1lc3NhZ2U+IHtcbiAgICAvLyBXZSBrbm93IHRoZXJlIHdpbGwgYmUgb25seSBvbmUgbWVzc2FnZSBpbiByZXBseVxuICAgIHJldHVybiB0aGlzLnN0cmVhbShzZXJ2aWNlRW5kUG9pbnQsIHBheWxvYWQpLnBpcGUoZmlyc3QoKSk7XG4gIH1cblxuICBwcml2YXRlIHN0cmVhbShzZXJ2aWNlRW5kUG9pbnQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKFxuICAgICAgKHJwY09ic2VydmVyOiBPYnNlcnZlcjxNZXNzYWdlPikgPT4ge1xuICAgICAgICBsZXQgZGVmYXVsdE1lc3NhZ2VzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICAgICAgY29uc3QgY29ycmVsYXRpb25JZCA9IFVVSUQuVVVJRCgpO1xuXG4gICAgICAgIGRlZmF1bHRNZXNzYWdlc1N1YnNjcmlwdGlvbiA9IHRoaXMubWVzc2FnZXNPYnNlcnZhYmxlLnBpcGUoZmlsdGVyKChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2UuaGVhZGVyc1snY29ycmVsYXRpb24taWQnXSA9PT0gY29ycmVsYXRpb25JZDtcbiAgICAgICAgfSkpLnN1YnNjcmliZSgobWVzc2FnZTogTWVzc2FnZSkgPT4ge1xuICAgICAgICAgIHJwY09ic2VydmVyLm5leHQobWVzc2FnZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNlbmQgYW4gUlBDIHJlcXVlc3RcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAncmVwbHktdG8nOiBgL3RlbXAtcXVldWUvJHt0aGlzLnJlcGx5UXVldWV9YCxcbiAgICAgICAgICAnY29ycmVsYXRpb24taWQnOiBjb3JyZWxhdGlvbklkXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zdG9tcFNlcnZpY2UucHVibGlzaChzZXJ2aWNlRW5kUG9pbnQsIHBheWxvYWQsIGhlYWRlcnMpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7IC8vIENsZWFudXBcbiAgICAgICAgICBkZWZhdWx0TWVzc2FnZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiQmVoYXZpb3JTdWJqZWN0IiwiZmlsdGVyIiwiU3ViamVjdCIsIlN0b21wLmNsaWVudCIsIlN0b21wLm92ZXIiLCJ0c2xpYl8xLl9fdmFsdWVzIiwiT2JzZXJ2YWJsZSIsInNoYXJlIiwiZmlyc3QiLCJJbmplY3RhYmxlIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJVVUlEIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQTtJQUVBLElBQUksYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDN0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO2FBQ2hDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVFLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvRSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBRUYsdUJBQTBCLENBQUMsRUFBRSxDQUFDO1FBQzFCLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDdkMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RixDQUFDO0FBRUQsc0JBNkV5QixDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU87WUFDSCxJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO29CQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDM0M7U0FDSixDQUFDO0lBQ04sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NDM0M2RixFQUFFOzs7Ozs7O3lCQTRSNUUsVUFBQyxJQUFTO2dCQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDL0I7Ozs7OEJBR3NCLFVBQUMsS0FBWTtnQkFFbEMsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFeEIsS0FBSSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7OztnQkFHeEQsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3ZDOzs7OzRCQUdvQixVQUFDLEtBQTZCOzs7Z0JBR2pELEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUU5QixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtvQkFDN0IsS0FBSyxHQUFHLEVBQWdCLEtBQUssR0FBRSxJQUFJLENBQUM7aUJBQ3JDO2dCQUVELEtBQUksQ0FBQyxLQUFLLENBQUMsWUFBVSxLQUFPLENBQUMsQ0FBQzs7Z0JBRzlCLElBQUksQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTs7O29CQUUxQixLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3BDO2FBQ0Y7WUExU0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJQSxvQkFBZSxDQUFhLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVoRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RDQyxnQkFBTSxDQUFDLFVBQUMsWUFBd0I7Z0JBQzlCLE9BQU8sWUFBWSxLQUFLLFVBQVUsQ0FBQyxTQUFTLENBQUM7YUFDOUMsQ0FBQyxDQUNILENBQUM7O1lBR0YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztnQkFDL0IsS0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLDhCQUE4QixHQUFHLElBQUlELG9CQUFlLENBQXNCLElBQUksQ0FBQyxDQUFDO1lBRXJGLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUNyRUMsZ0JBQU0sQ0FBQyxVQUFDLE9BQTRCO2dCQUNsQyxPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUM7YUFDekIsQ0FBQyxDQUNILENBQUM7WUFFRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUlDLFlBQU8sRUFBRSxDQUFDOztRQUlwQyxzQkFBSSxpQ0FBTTs7Ozs7O2dCQUFWLFVBQVcsS0FBa0I7Z0JBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2FBQ3RCOzs7V0FBQTs7Ozs7O1FBR1MsdUNBQWU7Ozs7WUFBekI7O2dCQUVFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7Z0JBR2xCLElBQUksUUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQkFDekMsSUFBSSxDQUFDLE1BQU0sR0FBR0MsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzlDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxNQUFNLEdBQUdDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUM1Qzs7Z0JBR0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO2dCQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7O2dCQUc1RCxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztnQkFFM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO29CQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHO3FCQUNaLENBQUM7aUJBQ0g7O2dCQUVELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7O2dCQUcvQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7O2dCQUd0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDdEI7Ozs7O1FBTU0sc0NBQWM7Ozs7O2dCQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBRXZCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtvQkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2lCQUMzQjs7Z0JBR0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUNwQixJQUFJLENBQUMsVUFBVSxFQUNmLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztnQkFFRixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7OztRQU85QixrQ0FBVTs7Ozs7OztnQkFHZixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFOzt3QkFFMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNuQyxPQUFPO3FCQUNSOztvQkFHRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBRTFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUNwQixjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFBLENBQ3pDLENBQUM7aUJBQ0g7Ozs7OztRQU1JLGlDQUFTOzs7OztnQkFDZCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssVUFBVSxDQUFDLFNBQVMsQ0FBQzs7Ozs7Ozs7Ozs7OztRQWFqRCwrQkFBTzs7Ozs7Ozs7Ozs7c0JBQUMsU0FBaUIsRUFBRSxPQUFlLEVBQUUsT0FBMEI7Z0JBQTFCLHdCQUFBO29CQUFBLFlBQTBCOztnQkFDM0UsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQy9DO3FCQUFNO29CQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsNkJBQTJCLE9BQVMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFDLFNBQVMsb0JBQVUsU0FBUyxDQUFBLEVBQUUsT0FBTyxvQkFBVSxPQUFPLENBQUEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztpQkFDdEc7Ozs7Ozs7UUFJTywwQ0FBa0I7Ozs7WUFBNUI7Z0JBQ0UscUJBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO2dCQUV6QixJQUFJLENBQUMsS0FBSyxDQUFDLHNDQUFvQyxjQUFnQixDQUFDLENBQUM7O29CQUVqRSxLQUE0QixJQUFBLG1CQUFBQyxTQUFBLGNBQWMsQ0FBQSw4Q0FBQTt3QkFBckMsSUFBTSxhQUFhLDJCQUFBO3dCQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUFzQixhQUFlLENBQUMsQ0FBQzt3QkFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUNyRjs7Ozs7Ozs7Ozs7Ozs7OzthQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBbUJNLGlDQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQUMsU0FBaUIsRUFBRSxPQUEwQjs7Z0JBQTFCLHdCQUFBO29CQUFBLFlBQTBCOzs7Ozs7Ozs7Ozs7OztnQkFjNUQsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBd0IsU0FBVyxDQUFDLENBQUM7O2dCQUdoRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO2lCQUN6QjtnQkFFRCxxQkFBTSxjQUFjLEdBQUdDLGVBQVUsQ0FBQyxNQUFNLENBQ3RDLFVBQUMsUUFBaUM7Ozs7b0JBSWhDLHFCQUFJLGlCQUFvQyxDQUFDO29CQUV6QyxxQkFBSSwwQkFBd0MsQ0FBQztvQkFFN0MsMEJBQTBCLEdBQUcsS0FBSSxDQUFDLGlCQUFpQjt5QkFDaEQsU0FBUyxDQUFDO3dCQUNULEtBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXFCLFNBQVcsQ0FBQyxDQUFDO3dCQUM3QyxpQkFBaUIsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBQyxPQUFzQjs0QkFDeEUsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDeEIsRUFDRCxPQUFPLENBQUMsQ0FBQztxQkFDWixDQUFDLENBQUM7b0JBRUwsT0FBTzs7d0JBQ0wsS0FBSSxDQUFDLEtBQUssQ0FBQyx5Q0FBdUMsU0FBUyxNQUFHLENBQUMsQ0FBQzt3QkFDaEUsMEJBQTBCLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBRXpDLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxVQUFVLENBQUMsU0FBUyxFQUFFOzRCQUNsRCxLQUFJLENBQUMsS0FBSyxDQUFDLDJCQUF5QixTQUFTLGNBQVcsQ0FBQyxDQUFDOzRCQUMxRCxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt5QkFDakM7NkJBQU07NEJBQ0wsS0FBSSxDQUFDLEtBQUssQ0FBQyxzREFBb0QsU0FBUyxjQUFXLENBQUMsQ0FBQzt5QkFDdEY7cUJBQ0YsQ0FBQztpQkFDSCxDQUFDLENBQUM7Ozs7OztnQkFPTCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUNDLGVBQUssRUFBRSxDQUFDLENBQUM7Ozs7Ozs7Ozs7O1FBTzVCLHNDQUFjOzs7OztZQUF4QjtnQkFBQSxpQkFNQztnQkFMQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSUwsWUFBTyxFQUFFLENBQUM7Z0JBRS9DLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLFVBQUMsT0FBc0I7b0JBQzdDLEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzlDLENBQUM7YUFDSDs7Ozs7Ozs7UUFLUyxxQ0FBYTs7OztZQUF2QjtnQkFBQSxpQkFNQztnQkFMQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSUEsWUFBTyxFQUFFLENBQUM7Z0JBRXhDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLFVBQUMsS0FBa0I7b0JBQ3pDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3JDLENBQUM7YUFDSDs7Ozs7OztRQUtNLHNDQUFjOzs7Ozs7c0JBQUMsU0FBaUIsRUFBRSxRQUFzQztnQkFDN0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FDMUJELGdCQUFNLENBQUMsVUFBQyxLQUFrQjtvQkFDeEIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsQ0FBQztpQkFDbEQsQ0FBQyxFQUNGTyxlQUFLLEVBQUUsQ0FDUixDQUFDLFNBQVMsQ0FBQyxVQUFDLEtBQWtCO29CQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2pCLENBQUMsQ0FBQzs7O29CQW5VTkMsZUFBVTs7Ozs0QkF4Qlg7Ozs7Ozs7QUNDQTs7Ozs7Ozs7b0JBTUNBLGVBQVU7OzBCQVBYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQ21Ca0NDLGdDQUFhOzhCQU8xQixNQUFtQjt3QkFDcEMsaUJBQU87WUFFUCxLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixLQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Ozs7b0JBWnpCRCxlQUFVOzs7Ozt3QkFoQkYsV0FBVzs7OzJCQUZwQjtNQW1Ca0MsYUFBYTs7Ozs7O0FDbkIvQztRQWFFLHlCQUFvQixZQUEwQjtZQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYzs4QkFKdkIsYUFBYTtZQUtsQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQztTQUN2RTs7Ozs7O1FBRU0sNkJBQUc7Ozs7O3NCQUFDLGVBQXVCLEVBQUUsT0FBZTs7Z0JBRWpELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDRCxlQUFLLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7O1FBR3JELGdDQUFNOzs7OztzQkFBQyxlQUF1QixFQUFFLE9BQWU7O2dCQUNyRCxPQUFPRixlQUFVLENBQUMsTUFBTSxDQUN0QixVQUFDLFdBQThCO29CQUM3QixxQkFBSSwyQkFBeUMsQ0FBQztvQkFFOUMscUJBQU0sYUFBYSxHQUFHSyxpQkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUVsQywyQkFBMkIsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDVixnQkFBTSxDQUFDLFVBQUMsT0FBZ0I7d0JBQ2pGLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLGFBQWEsQ0FBQztxQkFDNUQsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsT0FBZ0I7d0JBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQzNCLENBQUMsQ0FBQzs7b0JBR0gscUJBQU0sT0FBTyxHQUFHO3dCQUNkLFVBQVUsRUFBRSxpQkFBZSxLQUFJLENBQUMsVUFBWTt3QkFDNUMsZ0JBQWdCLEVBQUUsYUFBYTtxQkFDaEMsQ0FBQztvQkFFRixLQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUU3RCxPQUFPOzt3QkFDTCwyQkFBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztxQkFDM0MsQ0FBQztpQkFDSCxDQUNGLENBQUM7OztvQkF4Q0xRLGVBQVU7Ozs7O3dCQU5GLFlBQVk7Ozs4QkFEckI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==