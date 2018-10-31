(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@stomp/rx-stomp'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@stomp/ng2-stompjs', ['exports', '@angular/core', '@stomp/rx-stomp', 'rxjs', 'rxjs/operators'], factory) :
    (factory((global.stomp = global.stomp || {}, global.stomp['ng2-stompjs'] = {}),global.ng.core,global.RxStomp,global.rxjs,global.rxjs.operators));
}(this, (function (exports,core,rxStomp,rxjs,operators) { 'use strict';

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
    var StompRService = (function (_super) {
        __extends(StompRService, _super);
        function StompRService() {
            var _this = _super.call(this) || this;
            _this.state = new rxjs.BehaviorSubject(StompState.CLOSED);
            _this.connectionState$.subscribe(function (st) {
                _this.state.next(StompRService._mapStompState(st));
            });
            return _this;
        }
        /**
         * @param {?} st
         * @return {?}
         */
        StompRService._mapStompState = /**
         * @param {?} st
         * @return {?}
         */
            function (st) {
                if (st === rxStomp.RxStompState.CONNECTING) {
                    return StompState.TRYING;
                }
                if (st === rxStomp.RxStompState.OPEN) {
                    return StompState.CONNECTED;
                }
                if (st === rxStomp.RxStompState.CLOSING) {
                    return StompState.DISCONNECTING;
                }
                if (st === rxStomp.RxStompState.CLOSED) {
                    return StompState.CLOSED;
                }
            };
        Object.defineProperty(StompRService.prototype, "connectObservable", {
            /**
             * Will trigger when connection is established. Use this to carry out initialization.
             * It will trigger every time a (re)connection occurs. If it is already connected
             * it will trigger immediately. You can safely ignore the value, as it will always be
             * StompState.CONNECTED
             */
            get: /**
             * Will trigger when connection is established. Use this to carry out initialization.
             * It will trigger every time a (re)connection occurs. If it is already connected
             * it will trigger immediately. You can safely ignore the value, as it will always be
             * StompState.CONNECTED
             * @return {?}
             */ function () {
                return this.connected$.pipe(operators.map(function (st) {
                    return StompRService._mapStompState(st);
                }));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StompRService.prototype, "serverHeadersObservable", {
            /**
             * Provides headers from most recent connection to the server as return by the CONNECTED
             * frame.
             * If the STOMP connection has already been established it will trigger immediately.
             * It will additionally trigger in event of reconnection, the value will be set of headers from
             * the recent server response.
             */
            get: /**
             * Provides headers from most recent connection to the server as return by the CONNECTED
             * frame.
             * If the STOMP connection has already been established it will trigger immediately.
             * It will additionally trigger in event of reconnection, the value will be set of headers from
             * the recent server response.
             * @return {?}
             */ function () {
                return this.serverHeaders$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StompRService.prototype, "defaultMessagesObservable", {
            /**
             * Will emit all messages to the default queue (any message that are not handled by a subscription)
             */
            get: /**
             * Will emit all messages to the default queue (any message that are not handled by a subscription)
             * @return {?}
             */ function () {
                return this.unhandledMessage$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StompRService.prototype, "receiptsObservable", {
            /**
             * Will emit all receipts
             */
            get: /**
             * Will emit all receipts
             * @return {?}
             */ function () {
                return this.unhandledReceipts$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StompRService.prototype, "errorSubject", {
            /**
             * Will trigger when an error occurs. This Subject can be used to handle errors from
             * the stomp broker.
             */
            get: /**
             * Will trigger when an error occurs. This Subject can be used to handle errors from
             * the stomp broker.
             * @return {?}
             */ function () {
                return this.stompErrors$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StompRService.prototype, "config", {
            /** Set configuration */
            set: /**
             * Set configuration
             * @param {?} config
             * @return {?}
             */ function (config) {
                var /** @type {?} */ rxStompConfig = {};
                if (typeof (config.url) === 'string') {
                    rxStompConfig.brokerURL = config.url;
                }
                else {
                    rxStompConfig.webSocketFactory = config.url;
                }
                // Configure client heart-beating
                rxStompConfig.heartbeatIncoming = config.heartbeat_in;
                rxStompConfig.heartbeatOutgoing = config.heartbeat_out;
                // Auto reconnect
                rxStompConfig.reconnectDelay = config.reconnect_delay;
                if (config.debug) {
                    rxStompConfig.debug = function (str) {
                        console.log(new Date(), str);
                    };
                }
                rxStompConfig.connectHeaders = config.headers;
                this.configure(rxStompConfig);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * It will connect to the STOMP broker.
         * @return {?}
         */
        StompRService.prototype.initAndConnect = /**
         * It will connect to the STOMP broker.
         * @return {?}
         */
            function () {
                // disconnect if connected
                this.deactivate();
                // Attempt connection, passing in a callback
                this.activate();
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
                this.deactivate();
            };
        /**
         * It will send a message to a named destination. The message must be `string`.
         *
         * The message will get locally queued if the STOMP broker is not connected. It will attempt to
         * publish queued messages as soon as the broker gets connected.
         *
         * @param {?} queueName
         * @param {?=} message
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
         * @param {?=} message
         * @param {?=} headers
         * @return {?}
         */
            function (queueName, message, headers) {
                if (headers === void 0) {
                    headers = {};
                }
                if (typeof queueName === 'string') {
                    _super.prototype.publish.call(this, { destination: /** @type {?} */ (queueName), body: message, headers: headers });
                }
                else {
                    var /** @type {?} */ pubParams = queueName;
                    _super.prototype.publish.call(this, pubParams);
                }
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
                if (headers === void 0) {
                    headers = {};
                }
                return this.watch(queueName, headers);
            };
        Object.defineProperty(StompRService.prototype, "client", {
            get: /**
             * @return {?}
             */ function () {
                return this._stompClient;
            },
            enumerable: true,
            configurable: true
        });
        StompRService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        StompRService.ctorParameters = function () { return []; };
        return StompRService;
    }(rxStomp.RxStomp));

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
     * An implementation of RPC service using messaging.
     *
     * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
     */
    var StompRPCService = (function (_super) {
        __extends(StompRPCService, _super);
        function StompRPCService() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StompRPCService.decorators = [
            { type: core.Injectable }
        ];
        return StompRPCService;
    }(rxStomp.RxStompRPC));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * RPC Config. See the guide for example.
     */
    var StompRPCConfig = (function (_super) {
        __extends(StompRPCConfig, _super);
        function StompRPCConfig() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StompRPCConfig.decorators = [
            { type: core.Injectable }
        ];
        return StompRPCConfig;
    }(rxStomp.RxStompRPCConfig));

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9zdG9tcC1yLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAuY29uZmlnLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAtcnBjLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAtcnBjLmNvbmZpZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7UnhTdG9tcCwgUnhTdG9tcENvbmZpZywgUnhTdG9tcFN0YXRlfSBmcm9tIFwiQHN0b21wL3J4LXN0b21wXCI7XG5cbmltcG9ydCB7cHVibGlzaFBhcmFtcywgQ2xpZW50LCBNZXNzYWdlLCBGcmFtZX0gZnJvbSBcIkBzdG9tcC9zdG9tcGpzXCI7XG5cbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHttYXB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5pbXBvcnQge1N0b21wU3RhdGV9IGZyb20gXCIuL3N0b21wLXN0YXRlXCI7XG5pbXBvcnQgeyBTdG9tcEhlYWRlcnMgfSBmcm9tICcuL3N0b21wLWhlYWRlcnMnO1xuaW1wb3J0IHtTdG9tcENvbmZpZ30gZnJvbSBcIi4vc3RvbXAuY29uZmlnXCI7XG5cbi8qKlxuICogQW5ndWxhcjIgU1RPTVAgUmF3IFNlcnZpY2UgdXNpbmcgQHN0b21wL3N0b21wLmpzXG4gKlxuICogWW91IHdpbGwgb25seSBuZWVkIHRoZSBwdWJsaWMgcHJvcGVydGllcyBhbmRcbiAqIG1ldGhvZHMgbGlzdGVkIHVubGVzcyB5b3UgYXJlIGFuIGFkdmFuY2VkIHVzZXIuIFRoaXMgc2VydmljZSBoYW5kbGVzIHN1YnNjcmliaW5nIHRvIGFcbiAqIG1lc3NhZ2UgcXVldWUgdXNpbmcgdGhlIHN0b21wLmpzIGxpYnJhcnksIGFuZCByZXR1cm5zXG4gKiB2YWx1ZXMgdmlhIHRoZSBFUzYgT2JzZXJ2YWJsZSBzcGVjaWZpY2F0aW9uIGZvclxuICogYXN5bmNocm9ub3VzIHZhbHVlIHN0cmVhbWluZyBieSB3aXJpbmcgdGhlIFNUT01QXG4gKiBtZXNzYWdlcyBpbnRvIGFuIG9ic2VydmFibGUuXG4gKlxuICogSWYgeW91IHdpbGwgbGlrZSB0byBwYXNzIHRoZSBjb25maWd1cmF0aW9uIGFzIGEgZGVwZW5kZW5jeSxcbiAqIHBsZWFzZSB1c2UgU3RvbXBTZXJ2aWNlIGNsYXNzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSU2VydmljZSBleHRlbmRzIFJ4U3RvbXAge1xuICAvKipcbiAgICogU3RhdGUgb2YgdGhlIFNUT01QU2VydmljZVxuICAgKlxuICAgKiBJdCBpcyBhIEJlaGF2aW9yU3ViamVjdCBhbmQgd2lsbCBlbWl0IGN1cnJlbnQgc3RhdHVzIGltbWVkaWF0ZWx5LiBUaGlzIHdpbGwgdHlwaWNhbGx5IGdldFxuICAgKiB1c2VkIHRvIHNob3cgY3VycmVudCBzdGF0dXMgdG8gdGhlIGVuZCB1c2VyLlxuICAgKi9cbiAgcHVibGljIHN0YXRlOiBCZWhhdmlvclN1YmplY3Q8U3RvbXBTdGF0ZT47XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX21hcFN0b21wU3RhdGUoc3Q6IFJ4U3RvbXBTdGF0ZSk6IFN0b21wU3RhdGUge1xuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLkNPTk5FQ1RJTkcpIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLlRSWUlORztcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuT1BFTikge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuQ09OTkVDVEVEO1xuICAgIH1cbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DTE9TSU5HKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5ESVNDT05ORUNUSU5HO1xuICAgIH1cbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DTE9TRUQpIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLkNMT1NFRDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZC4gVXNlIHRoaXMgdG8gY2Fycnkgb3V0IGluaXRpYWxpemF0aW9uLlxuICAgKiBJdCB3aWxsIHRyaWdnZXIgZXZlcnkgdGltZSBhIChyZSljb25uZWN0aW9uIG9jY3Vycy4gSWYgaXQgaXMgYWxyZWFkeSBjb25uZWN0ZWRcbiAgICogaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LiBZb3UgY2FuIHNhZmVseSBpZ25vcmUgdGhlIHZhbHVlLCBhcyBpdCB3aWxsIGFsd2F5cyBiZVxuICAgKiBTdG9tcFN0YXRlLkNPTk5FQ1RFRFxuICAgKi9cbiAgZ2V0IGNvbm5lY3RPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8U3RvbXBTdGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3RlZCQucGlwZShtYXAoKHN0OiBSeFN0b21wU3RhdGUpOiBTdG9tcFN0YXRlID0+IHtcbiAgICAgIHJldHVybiBTdG9tcFJTZXJ2aWNlLl9tYXBTdG9tcFN0YXRlKHN0KTtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgaGVhZGVycyBmcm9tIG1vc3QgcmVjZW50IGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBhcyByZXR1cm4gYnkgdGhlIENPTk5FQ1RFRFxuICAgKiBmcmFtZS5cbiAgICogSWYgdGhlIFNUT01QIGNvbm5lY3Rpb24gaGFzIGFscmVhZHkgYmVlbiBlc3RhYmxpc2hlZCBpdCB3aWxsIHRyaWdnZXIgaW1tZWRpYXRlbHkuXG4gICAqIEl0IHdpbGwgYWRkaXRpb25hbGx5IHRyaWdnZXIgaW4gZXZlbnQgb2YgcmVjb25uZWN0aW9uLCB0aGUgdmFsdWUgd2lsbCBiZSBzZXQgb2YgaGVhZGVycyBmcm9tXG4gICAqIHRoZSByZWNlbnQgc2VydmVyIHJlc3BvbnNlLlxuICAgKi9cbiAgZ2V0IHNlcnZlckhlYWRlcnNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8U3RvbXBIZWFkZXJzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVySGVhZGVycyQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCBlbWl0IGFsbCBtZXNzYWdlcyB0byB0aGUgZGVmYXVsdCBxdWV1ZSAoYW55IG1lc3NhZ2UgdGhhdCBhcmUgbm90IGhhbmRsZWQgYnkgYSBzdWJzY3JpcHRpb24pXG4gICAqL1xuICBnZXQgZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZSgpOiBTdWJqZWN0PE1lc3NhZ2U+IHtcbiAgICByZXR1cm4gdGhpcy51bmhhbmRsZWRNZXNzYWdlJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIHJlY2VpcHRzXG4gICAqL1xuICBnZXQgcmVjZWlwdHNPYnNlcnZhYmxlKCk6IFN1YmplY3Q8RnJhbWU+IHtcbiAgICByZXR1cm4gdGhpcy51bmhhbmRsZWRSZWNlaXB0cyQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gYW4gZXJyb3Igb2NjdXJzLiBUaGlzIFN1YmplY3QgY2FuIGJlIHVzZWQgdG8gaGFuZGxlIGVycm9ycyBmcm9tXG4gICAqIHRoZSBzdG9tcCBicm9rZXIuXG4gICAqL1xuICBnZXQgZXJyb3JTdWJqZWN0KCk6IFN1YmplY3Q8c3RyaW5nIHwgRnJhbWU+IHtcbiAgICByZXR1cm4gdGhpcy5zdG9tcEVycm9ycyQ7XG4gIH1cblxuICAvKiogU2V0IGNvbmZpZ3VyYXRpb24gKi9cbiAgc2V0IGNvbmZpZyhjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgY29uc3QgcnhTdG9tcENvbmZpZzogUnhTdG9tcENvbmZpZyA9IHsgfTtcblxuICAgIGlmICh0eXBlb2YoY29uZmlnLnVybCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByeFN0b21wQ29uZmlnLmJyb2tlclVSTCA9IGNvbmZpZy51cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJ4U3RvbXBDb25maWcud2ViU29ja2V0RmFjdG9yeSA9IGNvbmZpZy51cmw7XG4gICAgfVxuXG4gICAgLy8gQ29uZmlndXJlIGNsaWVudCBoZWFydC1iZWF0aW5nXG4gICAgcnhTdG9tcENvbmZpZy5oZWFydGJlYXRJbmNvbWluZyA9IGNvbmZpZy5oZWFydGJlYXRfaW47XG4gICAgcnhTdG9tcENvbmZpZy5oZWFydGJlYXRPdXRnb2luZyA9IGNvbmZpZy5oZWFydGJlYXRfb3V0O1xuXG4gICAgLy8gQXV0byByZWNvbm5lY3RcbiAgICByeFN0b21wQ29uZmlnLnJlY29ubmVjdERlbGF5ID0gY29uZmlnLnJlY29ubmVjdF9kZWxheTtcblxuICAgIGlmIChjb25maWcuZGVidWcpIHtcbiAgICAgIHJ4U3RvbXBDb25maWcuZGVidWcgPSAoc3RyOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cobmV3IERhdGUoKSwgc3RyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByeFN0b21wQ29uZmlnLmNvbm5lY3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShyeFN0b21wQ29uZmlnKTtcbiAgfVxuICAvKipcbiAgICogSXQgd2lsbCBjb25uZWN0IHRvIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgaW5pdEFuZENvbm5lY3QoKTogdm9pZCB7XG4gICAgLy8gZGlzY29ubmVjdCBpZiBjb25uZWN0ZWRcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcblxuICAgIC8vIEF0dGVtcHQgY29ubmVjdGlvbiwgcGFzc2luZyBpbiBhIGNhbGxiYWNrXG4gICAgdGhpcy5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgZGlzY29ubmVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHNlbmQgYSBtZXNzYWdlIHRvIGEgbmFtZWQgZGVzdGluYXRpb24uIFRoZSBtZXNzYWdlIG11c3QgYmUgYHN0cmluZ2AuXG4gICAqXG4gICAqIFRoZSBtZXNzYWdlIHdpbGwgZ2V0IGxvY2FsbHkgcXVldWVkIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC4gSXQgd2lsbCBhdHRlbXB0IHRvXG4gICAqIHB1Ymxpc2ggcXVldWVkIG1lc3NhZ2VzIGFzIHNvb24gYXMgdGhlIGJyb2tlciBnZXRzIGNvbm5lY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHB1Ymxpc2gocXVldWVOYW1lOiBzdHJpbmd8cHVibGlzaFBhcmFtcywgbWVzc2FnZT86IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHF1ZXVlTmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN1cGVyLnB1Ymxpc2goe2Rlc3RpbmF0aW9uOiBxdWV1ZU5hbWUgYXMgc3RyaW5nLCBib2R5OiBtZXNzYWdlLCBoZWFkZXJzfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHB1YlBhcmFtczogcHVibGlzaFBhcmFtcyA9IHF1ZXVlTmFtZTtcbiAgICAgIHN1cGVyLnB1Ymxpc2gocHViUGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBzdWJzY3JpYmUgdG8gc2VydmVyIG1lc3NhZ2UgcXVldWVzXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzYWZlbHkgY2FsbGVkIGV2ZW4gaWYgdGhlIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLlxuICAgKiBJZiB0aGUgdW5kZXJseWluZyBTVE9NUCBjb25uZWN0aW9uIGRyb3BzIGFuZCByZWNvbm5lY3RzLCBpdCB3aWxsIHJlc3Vic2NyaWJlIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIElmIGEgaGVhZGVyIGZpZWxkICdhY2snIGlzIG5vdCBleHBsaWNpdGx5IHBhc3NlZCwgJ2Fjaycgd2lsbCBiZSBzZXQgdG8gJ2F1dG8nLiBJZiB5b3VcbiAgICogZG8gbm90IHVuZGVyc3RhbmQgd2hhdCBpdCBtZWFucywgcGxlYXNlIGxlYXZlIGl0IGFzIGlzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgd2hlbiB3b3JraW5nIHdpdGggdGVtcG9yYXJ5IHF1ZXVlcyB3aGVyZSB0aGUgc3Vic2NyaXB0aW9uIHJlcXVlc3RcbiAgICogY3JlYXRlcyB0aGVcbiAgICogdW5kZXJseWluZyBxdWV1ZSwgbXNzYWdlcyBtaWdodCBiZSBtaXNzZWQgZHVyaW5nIHJlY29ubmVjdC4gVGhpcyBpc3N1ZSBpcyBub3Qgc3BlY2lmaWNcbiAgICogdG8gdGhpcyBsaWJyYXJ5IGJ1dCB0aGUgd2F5IFNUT01QIGJyb2tlcnMgYXJlIGRlc2lnbmVkIHRvIHdvcmsuXG4gICAqXG4gICAqIEBwYXJhbSBxdWV1ZU5hbWVcbiAgICogQHBhcmFtIGhlYWRlcnNcbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUocXVldWVOYW1lOiBzdHJpbmcsIGhlYWRlcnM6IFN0b21wSGVhZGVycyA9IHt9KTogT2JzZXJ2YWJsZTxNZXNzYWdlPiB7XG4gICAgcmV0dXJuIHRoaXMud2F0Y2gocXVldWVOYW1lLCBoZWFkZXJzKTtcbiAgfVxuXG4gIGdldCBjbGllbnQoKTogQ2xpZW50IHtcbiAgICByZXR1cm4gdGhpcy5fc3RvbXBDbGllbnQ7XG4gIH1cblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+KFN0b21wU3RhdGUuQ0xPU0VEKTtcblxuICAgIHRoaXMuY29ubmVjdGlvblN0YXRlJC5zdWJzY3JpYmUoKHN0OiBSeFN0b21wU3RhdGUpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFJTZXJ2aWNlLl9tYXBTdG9tcFN0YXRlKHN0KSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gXCJAc3RvbXAvc3RvbXBqc1wiO1xuLyoqXG4gKiBSZXByZXNlbnRzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZVxuICogU1RPTVBTZXJ2aWNlIHRvIGNvbm5lY3QgdG8uXG4gKi9cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNlcnZlciBVUkwgdG8gY29ubmVjdCB0by4gUGxlYXNlIHJlZmVyIHRvIHlvdXIgU1RPTVAgYnJva2VyIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMuXG4gICAqXG4gICAqIEV4YW1wbGU6IHdzOi8vMTI3LjAuMC4xOjE1Njc0L3dzIChmb3IgYSBSYWJiaXRNUSBkZWZhdWx0IHNldHVwIHJ1bm5pbmcgb24gbG9jYWxob3N0KVxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5IHRoaXMgcGFyYW1ldGVyIGNhbiBiZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYmplY3Qgc2ltaWxhciB0byBXZWJTb2NrZXRcbiAgICogKHR5cGljYWxseSBTb2NrSlMgaW5zdGFuY2UpLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKlxuICAgKiAoKSA9PiB7XG4gICAqICAgcmV0dXJuIG5ldyBTb2NrSlMoJ2h0dHA6Ly8xMjcuMC4wLjE6MTU2NzQvc3RvbXAnKTtcbiAgICogfVxuICAgKi9cbiAgdXJsOiBzdHJpbmcgfCAoKCkgPT4gYW55KTtcblxuICAvKipcbiAgICogSGVhZGVyc1xuICAgKiBUeXBpY2FsIGtleXM6IGxvZ2luOiBzdHJpbmcsIHBhc3Njb2RlOiBzdHJpbmcuXG4gICAqIGhvc3Q6c3RyaW5nIHdpbGwgbmVlZWQgdG8gYmUgcGFzc2VkIGZvciB2aXJ0dWFsIGhvc3RzIGluIFJhYmJpdE1RXG4gICAqL1xuICBoZWFkZXJzOiBTdG9tcEhlYWRlcnM7XG5cbiAgLyoqIEhvdyBvZnRlbiB0byBpbmNvbWluZyBoZWFydGJlYXQ/XG4gICAqIEludGVydmFsIGluIG1pbGxpc2Vjb25kcywgc2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDAgLSBkaXNhYmxlZFxuICAgKi9cbiAgaGVhcnRiZWF0X2luOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhvdyBvZnRlbiB0byBvdXRnb2luZyBoZWFydGJlYXQ/XG4gICAqIEludGVydmFsIGluIG1pbGxpc2Vjb25kcywgc2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDIwMDAwIC0gZXZlcnkgMjAgc2Vjb25kc1xuICAgKi9cbiAgaGVhcnRiZWF0X291dDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXYWl0IGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgYXR0ZW1wdGluZyBhdXRvIHJlY29ubmVjdFxuICAgKiBTZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgNTAwMCAoNSBzZWNvbmRzKVxuICAgKi9cbiAgcmVjb25uZWN0X2RlbGF5OiBudW1iZXI7XG5cbiAgLyoqIEVuYWJsZSBjbGllbnQgZGVidWdnaW5nPyAqL1xuICBkZWJ1ZzogYm9vbGVhbjtcbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU3RvbXBDb25maWcgfSBmcm9tICcuL3N0b21wLmNvbmZpZyc7XG5cbmltcG9ydCB7IFN0b21wUlNlcnZpY2UgfSBmcm9tICcuL3N0b21wLXIuc2VydmljZSc7XG5cbi8qKlxuICogQW5ndWxhcjIgU1RPTVAgU2VydmljZSB1c2luZyBAc3RvbXAvc3RvbXAuanNcbiAqXG4gKiBAZGVzY3JpcHRpb24gVGhpcyBzZXJ2aWNlIGhhbmRsZXMgc3Vic2NyaWJpbmcgdG8gYVxuICogbWVzc2FnZSBxdWV1ZSB1c2luZyB0aGUgc3RvbXAuanMgbGlicmFyeSwgYW5kIHJldHVybnNcbiAqIHZhbHVlcyB2aWEgdGhlIEVTNiBPYnNlcnZhYmxlIHNwZWNpZmljYXRpb24gZm9yXG4gKiBhc3luY2hyb25vdXMgdmFsdWUgc3RyZWFtaW5nIGJ5IHdpcmluZyB0aGUgU1RPTVBcbiAqIG1lc3NhZ2VzIGludG8gYW4gb2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byBtYW51YWxseSBjb25maWd1cmUgYW5kIGluaXRpYWxpemUgdGhlIHNlcnZpY2VcbiAqIHBsZWFzZSB1c2UgU3RvbXBSU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBTZXJ2aWNlIGV4dGVuZHMgU3RvbXBSU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIFNlZSBSRUFETUUgYW5kIHNhbXBsZXMgZm9yIGNvbmZpZ3VyYXRpb24gZXhhbXBsZXNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuaW5pdEFuZENvbm5lY3QoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtSeFN0b21wUlBDfSBmcm9tIFwiQHN0b21wL3J4LXN0b21wXCI7XG5cbi8qKlxuICogQW4gaW1wbGVtZW50YXRpb24gb2YgUlBDIHNlcnZpY2UgdXNpbmcgbWVzc2FnaW5nLlxuICpcbiAqIFBsZWFzZSBzZWUgdGhlIFtndWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3JwYy0tLXJlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sKSBmb3IgZGV0YWlscy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlBDU2VydmljZSBleHRlbmRzIFJ4U3RvbXBSUEMgeyB9XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbmltcG9ydCB7UnhTdG9tcFJQQ0NvbmZpZ30gZnJvbSBcIkBzdG9tcC9yeC1zdG9tcFwiO1xuXG4vKipcbiAqIFJQQyBDb25maWcuIFNlZSB0aGUgZ3VpZGUgZm9yIGV4YW1wbGUuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFJQQ0NvbmZpZyBleHRlbmRzIFJ4U3RvbXBSUENDb25maWcgeyB9XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX2V4dGVuZHMiLCJCZWhhdmlvclN1YmplY3QiLCJSeFN0b21wU3RhdGUiLCJtYXAiLCJJbmplY3RhYmxlIiwiUnhTdG9tcCIsIlJ4U3RvbXBSUEMiLCJSeFN0b21wUlBDQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQTtJQUVBLElBQUksYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDN0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO2FBQ2hDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVFLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvRSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBRUYsdUJBQTBCLENBQUMsRUFBRSxDQUFDO1FBQzFCLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDdkMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUNBa0NBLGlDQUFPOzt3QkErSnRDLGlCQUFPO1lBRVAsS0FBSSxDQUFDLEtBQUssR0FBRyxJ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