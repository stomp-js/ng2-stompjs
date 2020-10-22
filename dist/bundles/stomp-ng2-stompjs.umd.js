(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@stomp/rx-stomp'), require('rxjs'), require('rxjs/operators'), require('@stomp/stompjs')) :
    typeof define === 'function' && define.amd ? define('@stomp/ng2-stompjs', ['exports', '@angular/core', '@stomp/rx-stomp', 'rxjs', 'rxjs/operators', '@stomp/stompjs'], factory) :
    (factory((global.stomp = global.stomp || {}, global.stomp['ng2-stompjs'] = {}),global.ng.core,global.RxStomp,global.rxjs,global.rxjs.operators,global.stompjs));
}(this, (function (exports,core,rxStomp,rxjs,operators,stompjs) { 'use strict';

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
     * Part of `\@stomp/ng2-stompjs`.
     *
     * **This class has been deprecated in favor of {\@link RxStompService}.
     * It will be dropped `\@stomp/ng2-stompjs\@8.x.x`.**
     *
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
                if (typeof config.url === 'string') {
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
                    _super.prototype.publish.call(this, {
                        destination: /** @type {?} */ (queueName),
                        body: message,
                        headers: headers,
                    });
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
         * underlying queue, messages might be missed during reconnect. This issue is not specific
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
         * underlying queue, messages might be missed during reconnect. This issue is not specific
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
        /**
         * STOMP brokers may carry out operation asynchronously and allow requesting for acknowledgement.
         * To request an acknowledgement, a `receipt` header needs to be sent with the actual request.
         * The value (say receipt-id) for this header needs to be unique for each use. Typically a sequence, a UUID, a
         * random number or a combination may be used.
         *
         * A complaint broker will send a RECEIPT frame when an operation has actually been completed.
         * The operation needs to be matched based in the value of the receipt-id.
         *
         * This method allow watching for a receipt and invoke the callback
         * when corresponding receipt has been received.
         *
         * The actual {\@link Frame}
         * will be passed as parameter to the callback.
         *
         * Example:
         * ```javascript
         *        // Publishing with acknowledgement
         *        let receiptId = randomText();
         *
         *        rxStomp.waitForReceipt(receiptId, function() {
         *          // Will be called after server acknowledges
         *        });
         *        rxStomp.publish({destination: TEST.destination, headers: {receipt: receiptId}, body: msg});
         * ```
         *
         * Maps to: [Client#watchForReceipt]{\@link Client#watchForReceipt}
         * @param {?} receiptId
         * @param {?} callback
         * @return {?}
         */
        StompRService.prototype.waitForReceipt = /**
         * STOMP brokers may carry out operation asynchronously and allow requesting for acknowledgement.
         * To request an acknowledgement, a `receipt` header needs to be sent with the actual request.
         * The value (say receipt-id) for this header needs to be unique for each use. Typically a sequence, a UUID, a
         * random number or a combination may be used.
         *
         * A complaint broker will send a RECEIPT frame when an operation has actually been completed.
         * The operation needs to be matched based in the value of the receipt-id.
         *
         * This method allow watching for a receipt and invoke the callback
         * when corresponding receipt has been received.
         *
         * The actual {\@link Frame}
         * will be passed as parameter to the callback.
         *
         * Example:
         * ```javascript
         *        // Publishing with acknowledgement
         *        let receiptId = randomText();
         *
         *        rxStomp.waitForReceipt(receiptId, function() {
         *          // Will be called after server acknowledges
         *        });
         *        rxStomp.publish({destination: TEST.destination, headers: {receipt: receiptId}, body: msg});
         * ```
         *
         * Maps to: [Client#watchForReceipt]{\@link Client#watchForReceipt}
         * @param {?} receiptId
         * @param {?} callback
         * @return {?}
         */
            function (receiptId, callback) {
                _super.prototype.watchForReceipt.call(this, receiptId, callback);
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
     * Part of `\@stomp/ng2-stompjs`.
     *
     * **This class has been deprecated in favor of {\@link InjectableRxStompConfig}.
     * It will be dropped `\@stomp/ng2-stompjs\@8.x.x`.**
     *
     * Represents a configuration object for the
     * STOMPService to connect to.
     *
     * This name conflicts with a class of the same name in \@stomp/stompjs, excluding this from the documentation.
     *
     * \@internal
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
     * Part of `\@stomp/ng2-stompjs`.
     *
     * **This class has been deprecated in favor of {\@link RxStompService} with {\@link rxStompServiceFactory}.
     * It will be dropped `\@stomp/ng2-stompjs\@8.x.x`.**
     *
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
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Part of `\@stomp/ng2-stompjs`.
     *
     * This class is Injectable version of {\@link RxStomp} with exactly same functionality.
     * Please see {\@link RxStomp} for details.
     *
     * See: {\@link /guide/ng2-stompjs/ng2-stomp-with-angular7.html}
     * for a step-by-step guide.
     *
     * See also {\@link rxStompServiceFactory}.
     */
    var RxStompService = (function (_super) {
        __extends(RxStompService, _super);
        function RxStompService() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RxStompService.decorators = [
            { type: core.Injectable }
        ];
        return RxStompService;
    }(rxStomp.RxStomp));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Part of `\@stomp/ng2-stompjs`.
     *
     * Injectable version of {\@link RxStompRPCConfig}.
     *
     * See guide at {\@link /guide/rx-stomp/ng2-stompjs/remote-procedure-call.html}
     */
    var InjectableRxStompRPCConfig = (function (_super) {
        __extends(InjectableRxStompRPCConfig, _super);
        function InjectableRxStompRPCConfig() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        InjectableRxStompRPCConfig.decorators = [
            { type: core.Injectable }
        ];
        return InjectableRxStompRPCConfig;
    }(rxStomp.RxStompRPCConfig));
    /**
     * Deprecated, use {\@link InjectableRxStompRPCConfig} instead
     */
    var /** @type {?} */ InjectableRxStompRpcConfig = InjectableRxStompRPCConfig;

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Part of `\@stomp/ng2-stompjs`.
     *
     * Injectable version of {\@link RxStompRPC}.
     *
     * See guide at {\@link /guide/rx-stomp/ng2-stompjs/remote-procedure-call.html}
     */
    var RxStompRPCService = (function (_super) {
        __extends(RxStompRPCService, _super);
        /**
         * Create an instance, typically called by Angular Dependency Injection framework.
         *
         * @param rxStomp
         * @param stompRPCConfig
         */
        function RxStompRPCService(rxStomp$$1, stompRPCConfig) {
            return _super.call(this, rxStomp$$1, stompRPCConfig) || this;
        }
        RxStompRPCService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        RxStompRPCService.ctorParameters = function () {
            return [
                { type: RxStompService, },
                { type: InjectableRxStompRPCConfig, decorators: [{ type: core.Optional },] },
            ];
        };
        return RxStompRPCService;
    }(rxStomp.RxStompRPC));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Part of `\@stomp/ng2-stompjs`.
     *
     * This class is Injectable version of {\@link RxStompConfig} with exactly same functionality.
     * Please see {\@link RxStompConfig} for details.
     *
     * See: {\@link /guide/ng2-stompjs/ng2-stomp-with-angular7.html}
     * for a step-by-step guide.
     *
     * If all fields of configuration are fixed and known in advance you would typically define
     * a `const` and inject it using value.
     *
     * If some fields will be known by later, it can be injected using a factory function.
     *
     * Occasionally it may need to be combined with Angular's APP_INITIALIZER mechanism.
     */
    var InjectableRxStompConfig = (function (_super) {
        __extends(InjectableRxStompConfig, _super);
        function InjectableRxStompConfig() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        InjectableRxStompConfig.decorators = [
            { type: core.Injectable }
        ];
        return InjectableRxStompConfig;
    }(rxStomp.RxStompConfig));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Part of `\@stomp/ng2-stompjs`.
     *
     * This is factory function that can create {\@link RxStompService}
     * when configuration is already known.
     * You can use this function for defining provider for {\@link RxStompService}.
     * {\@link RxStompService} created using this function is configured and activated.
     * This provides the simplest mechanism to define {\@link RxStompService} for Dependency Injection.
     *
     * See: {\@link /guide/ng2-stompjs/ng2-stomp-with-angular7.html}
     * for a step-by-step guide.
     * @param {?} rxStompConfig
     * @return {?}
     */
    function rxStompServiceFactory(rxStompConfig) {
        var /** @type {?} */ rxStompService = new RxStompService();
        rxStompService.configure(rxStompConfig);
        rxStompService.activate();
        return rxStompService;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.StompHeaders = stompjs.StompHeaders;
    exports.StompRService = StompRService;
    exports.StompService = StompService;
    exports.StompState = StompState;
    exports.StompConfig = StompConfig;
    exports.RxStompRPCService = RxStompRPCService;
    exports.RxStompService = RxStompService;
    exports.InjectableRxStompConfig = InjectableRxStompConfig;
    exports.InjectableRxStompRPCConfig = InjectableRxStompRPCConfig;
    exports.InjectableRxStompRpcConfig = InjectableRxStompRpcConfig;
    exports.rxStompServiceFactory = rxStompServiceFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9hcHAvY29tcGF0aWJpbGl0eS9zdG9tcC1yLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvYXBwL2NvbXBhdGliaWxpdHkvc3RvbXAuY29uZmlnLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL2FwcC9jb21wYXRpYmlsaXR5L3N0b21wLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvYXBwL3J4LXN0b21wLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvYXBwL2luamVjdGFibGUtcngtc3RvbXAtcnBjLWNvbmZpZy50cyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9hcHAvcngtc3RvbXAtcnBjLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvYXBwL2luamVjdGFibGUtcngtc3RvbXAtY29uZmlnLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL2FwcC9yeC1zdG9tcC1zZXJ2aWNlLWZhY3RvcnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFJ4U3RvbXAsIFJ4U3RvbXBDb25maWcsIFJ4U3RvbXBTdGF0ZSB9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5cbmltcG9ydCB7IHB1Ymxpc2hQYXJhbXMsIENsaWVudCwgTWVzc2FnZSwgRnJhbWUgfSBmcm9tICdAc3RvbXAvc3RvbXBqcyc7XG5cbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBTdG9tcFN0YXRlIH0gZnJvbSAnLi9zdG9tcC1zdGF0ZSc7XG5pbXBvcnQgeyBTdG9tcEhlYWRlcnMgfSBmcm9tICcuL3N0b21wLWhlYWRlcnMnO1xuaW1wb3J0IHsgU3RvbXBDb25maWcgfSBmcm9tICcuL3N0b21wLmNvbmZpZyc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiAqKlRoaXMgY2xhc3MgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiB7QGxpbmsgUnhTdG9tcFNlcnZpY2V9LlxuICogSXQgd2lsbCBiZSBkcm9wcGVkIGBAc3RvbXAvbmcyLXN0b21wanNAOC54LnhgLioqXG4gKlxuICogQW5ndWxhcjIgU1RPTVAgUmF3IFNlcnZpY2UgdXNpbmcgQHN0b21wL3N0b21wLmpzXG4gKlxuICogWW91IHdpbGwgb25seSBuZWVkIHRoZSBwdWJsaWMgcHJvcGVydGllcyBhbmRcbiAqIG1ldGhvZHMgbGlzdGVkIHVubGVzcyB5b3UgYXJlIGFuIGFkdmFuY2VkIHVzZXIuIFRoaXMgc2VydmljZSBoYW5kbGVzIHN1YnNjcmliaW5nIHRvIGFcbiAqIG1lc3NhZ2UgcXVldWUgdXNpbmcgdGhlIHN0b21wLmpzIGxpYnJhcnksIGFuZCByZXR1cm5zXG4gKiB2YWx1ZXMgdmlhIHRoZSBFUzYgT2JzZXJ2YWJsZSBzcGVjaWZpY2F0aW9uIGZvclxuICogYXN5bmNocm9ub3VzIHZhbHVlIHN0cmVhbWluZyBieSB3aXJpbmcgdGhlIFNUT01QXG4gKiBtZXNzYWdlcyBpbnRvIGFuIG9ic2VydmFibGUuXG4gKlxuICogSWYgeW91IHdpbGwgbGlrZSB0byBwYXNzIHRoZSBjb25maWd1cmF0aW9uIGFzIGEgZGVwZW5kZW5jeSxcbiAqIHBsZWFzZSB1c2UgU3RvbXBTZXJ2aWNlIGNsYXNzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSU2VydmljZSBleHRlbmRzIFJ4U3RvbXAge1xuICAvKipcbiAgICogU3RhdGUgb2YgdGhlIFNUT01QU2VydmljZVxuICAgKlxuICAgKiBJdCBpcyBhIEJlaGF2aW9yU3ViamVjdCBhbmQgd2lsbCBlbWl0IGN1cnJlbnQgc3RhdHVzIGltbWVkaWF0ZWx5LiBUaGlzIHdpbGwgdHlwaWNhbGx5IGdldFxuICAgKiB1c2VkIHRvIHNob3cgY3VycmVudCBzdGF0dXMgdG8gdGhlIGVuZCB1c2VyLlxuICAgKi9cbiAgcHVibGljIHN0YXRlOiBCZWhhdmlvclN1YmplY3Q8U3RvbXBTdGF0ZT47XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX21hcFN0b21wU3RhdGUoc3Q6IFJ4U3RvbXBTdGF0ZSk6IFN0b21wU3RhdGUge1xuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLkNPTk5FQ1RJTkcpIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLlRSWUlORztcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuT1BFTikge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuQ09OTkVDVEVEO1xuICAgIH1cbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DTE9TSU5HKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5ESVNDT05ORUNUSU5HO1xuICAgIH1cbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DTE9TRUQpIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLkNMT1NFRDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZC4gVXNlIHRoaXMgdG8gY2Fycnkgb3V0IGluaXRpYWxpemF0aW9uLlxuICAgKiBJdCB3aWxsIHRyaWdnZXIgZXZlcnkgdGltZSBhIChyZSljb25uZWN0aW9uIG9jY3Vycy4gSWYgaXQgaXMgYWxyZWFkeSBjb25uZWN0ZWRcbiAgICogaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LiBZb3UgY2FuIHNhZmVseSBpZ25vcmUgdGhlIHZhbHVlLCBhcyBpdCB3aWxsIGFsd2F5cyBiZVxuICAgKiBTdG9tcFN0YXRlLkNPTk5FQ1RFRFxuICAgKi9cbiAgZ2V0IGNvbm5lY3RPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8U3RvbXBTdGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3RlZCQucGlwZShcbiAgICAgIG1hcChcbiAgICAgICAgKHN0OiBSeFN0b21wU3RhdGUpOiBTdG9tcFN0YXRlID0+IHtcbiAgICAgICAgICByZXR1cm4gU3RvbXBSU2VydmljZS5fbWFwU3RvbXBTdGF0ZShzdCk7XG4gICAgICAgIH1cbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGhlYWRlcnMgZnJvbSBtb3N0IHJlY2VudCBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgYXMgcmV0dXJuIGJ5IHRoZSBDT05ORUNURURcbiAgICogZnJhbWUuXG4gICAqIElmIHRoZSBTVE9NUCBjb25uZWN0aW9uIGhhcyBhbHJlYWR5IGJlZW4gZXN0YWJsaXNoZWQgaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LlxuICAgKiBJdCB3aWxsIGFkZGl0aW9uYWxseSB0cmlnZ2VyIGluIGV2ZW50IG9mIHJlY29ubmVjdGlvbiwgdGhlIHZhbHVlIHdpbGwgYmUgc2V0IG9mIGhlYWRlcnMgZnJvbVxuICAgKiB0aGUgcmVjZW50IHNlcnZlciByZXNwb25zZS5cbiAgICovXG4gIGdldCBzZXJ2ZXJIZWFkZXJzT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFN0b21wSGVhZGVycz4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlckhlYWRlcnMkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgbWVzc2FnZXMgdG8gdGhlIGRlZmF1bHQgcXVldWUgKGFueSBtZXNzYWdlIHRoYXQgYXJlIG5vdCBoYW5kbGVkIGJ5IGEgc3Vic2NyaXB0aW9uKVxuICAgKi9cbiAgZ2V0IGRlZmF1bHRNZXNzYWdlc09ic2VydmFibGUoKTogU3ViamVjdDxNZXNzYWdlPiB7XG4gICAgcmV0dXJuIHRoaXMudW5oYW5kbGVkTWVzc2FnZSQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCBlbWl0IGFsbCByZWNlaXB0c1xuICAgKi9cbiAgZ2V0IHJlY2VpcHRzT2JzZXJ2YWJsZSgpOiBTdWJqZWN0PEZyYW1lPiB7XG4gICAgcmV0dXJuIHRoaXMudW5oYW5kbGVkUmVjZWlwdHMkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgdHJpZ2dlciB3aGVuIGFuIGVycm9yIG9jY3Vycy4gVGhpcyBTdWJqZWN0IGNhbiBiZSB1c2VkIHRvIGhhbmRsZSBlcnJvcnMgZnJvbVxuICAgKiB0aGUgc3RvbXAgYnJva2VyLlxuICAgKi9cbiAgZ2V0IGVycm9yU3ViamVjdCgpOiBTdWJqZWN0PHN0cmluZyB8IEZyYW1lPiB7XG4gICAgcmV0dXJuIHRoaXMuc3RvbXBFcnJvcnMkO1xuICB9XG5cbiAgLyoqIFNldCBjb25maWd1cmF0aW9uICovXG4gIHNldCBjb25maWcoY29uZmlnOiBTdG9tcENvbmZpZykge1xuICAgIGNvbnN0IHJ4U3RvbXBDb25maWc6IFJ4U3RvbXBDb25maWcgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgY29uZmlnLnVybCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJ4U3RvbXBDb25maWcuYnJva2VyVVJMID0gY29uZmlnLnVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgcnhTdG9tcENvbmZpZy53ZWJTb2NrZXRGYWN0b3J5ID0gY29uZmlnLnVybDtcbiAgICB9XG5cbiAgICAvLyBDb25maWd1cmUgY2xpZW50IGhlYXJ0LWJlYXRpbmdcbiAgICByeFN0b21wQ29uZmlnLmhlYXJ0YmVhdEluY29taW5nID0gY29uZmlnLmhlYXJ0YmVhdF9pbjtcbiAgICByeFN0b21wQ29uZmlnLmhlYXJ0YmVhdE91dGdvaW5nID0gY29uZmlnLmhlYXJ0YmVhdF9vdXQ7XG5cbiAgICAvLyBBdXRvIHJlY29ubmVjdFxuICAgIHJ4U3RvbXBDb25maWcucmVjb25uZWN0RGVsYXkgPSBjb25maWcucmVjb25uZWN0X2RlbGF5O1xuXG4gICAgaWYgKGNvbmZpZy5kZWJ1Zykge1xuICAgICAgcnhTdG9tcENvbmZpZy5kZWJ1ZyA9IChzdHI6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpLCBzdHIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByeFN0b21wQ29uZmlnLmNvbm5lY3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShyeFN0b21wQ29uZmlnKTtcbiAgfVxuICAvKipcbiAgICogSXQgd2lsbCBjb25uZWN0IHRvIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgaW5pdEFuZENvbm5lY3QoKTogdm9pZCB7XG4gICAgLy8gZGlzY29ubmVjdCBpZiBjb25uZWN0ZWRcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcblxuICAgIC8vIEF0dGVtcHQgY29ubmVjdGlvbiwgcGFzc2luZyBpbiBhIGNhbGxiYWNrXG4gICAgdGhpcy5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgZGlzY29ubmVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHNlbmQgYSBtZXNzYWdlIHRvIGEgbmFtZWQgZGVzdGluYXRpb24uIFRoZSBtZXNzYWdlIG11c3QgYmUgYHN0cmluZ2AuXG4gICAqXG4gICAqIFRoZSBtZXNzYWdlIHdpbGwgZ2V0IGxvY2FsbHkgcXVldWVkIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC4gSXQgd2lsbCBhdHRlbXB0IHRvXG4gICAqIHB1Ymxpc2ggcXVldWVkIG1lc3NhZ2VzIGFzIHNvb24gYXMgdGhlIGJyb2tlciBnZXRzIGNvbm5lY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHB1Ymxpc2goXG4gICAgcXVldWVOYW1lOiBzdHJpbmcgfCBwdWJsaXNoUGFyYW1zLFxuICAgIG1lc3NhZ2U/OiBzdHJpbmcsXG4gICAgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge31cbiAgKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBxdWV1ZU5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzdXBlci5wdWJsaXNoKHtcbiAgICAgICAgZGVzdGluYXRpb246IHF1ZXVlTmFtZSBhcyBzdHJpbmcsXG4gICAgICAgIGJvZHk6IG1lc3NhZ2UsXG4gICAgICAgIGhlYWRlcnMsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHViUGFyYW1zOiBwdWJsaXNoUGFyYW1zID0gcXVldWVOYW1lO1xuICAgICAgc3VwZXIucHVibGlzaChwdWJQYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHN1YnNjcmliZSB0byBzZXJ2ZXIgbWVzc2FnZSBxdWV1ZXNcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHNhZmVseSBjYWxsZWQgZXZlbiBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuXG4gICAqIElmIHRoZSB1bmRlcmx5aW5nIFNUT01QIGNvbm5lY3Rpb24gZHJvcHMgYW5kIHJlY29ubmVjdHMsIGl0IHdpbGwgcmVzdWJzY3JpYmUgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogSWYgYSBoZWFkZXIgZmllbGQgJ2FjaycgaXMgbm90IGV4cGxpY2l0bHkgcGFzc2VkLCAnYWNrJyB3aWxsIGJlIHNldCB0byAnYXV0bycuIElmIHlvdVxuICAgKiBkbyBub3QgdW5kZXJzdGFuZCB3aGF0IGl0IG1lYW5zLCBwbGVhc2UgbGVhdmUgaXQgYXMgaXMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB3aGVuIHdvcmtpbmcgd2l0aCB0ZW1wb3JhcnkgcXVldWVzIHdoZXJlIHRoZSBzdWJzY3JpcHRpb24gcmVxdWVzdFxuICAgKiBjcmVhdGVzIHRoZVxuICAgKiB1bmRlcmx5aW5nIHF1ZXVlLCBtZXNzYWdlcyBtaWdodCBiZSBtaXNzZWQgZHVyaW5nIHJlY29ubmVjdC4gVGhpcyBpc3N1ZSBpcyBub3Qgc3BlY2lmaWNcbiAgICogdG8gdGhpcyBsaWJyYXJ5IGJ1dCB0aGUgd2F5IFNUT01QIGJyb2tlcnMgYXJlIGRlc2lnbmVkIHRvIHdvcmsuXG4gICAqXG4gICAqIEBwYXJhbSBxdWV1ZU5hbWVcbiAgICogQHBhcmFtIGhlYWRlcnNcbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUoXG4gICAgcXVldWVOYW1lOiBzdHJpbmcsXG4gICAgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge31cbiAgKTogT2JzZXJ2YWJsZTxNZXNzYWdlPiB7XG4gICAgcmV0dXJuIHRoaXMud2F0Y2gocXVldWVOYW1lLCBoZWFkZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVE9NUCBicm9rZXJzIG1heSBjYXJyeSBvdXQgb3BlcmF0aW9uIGFzeW5jaHJvbm91c2x5IGFuZCBhbGxvdyByZXF1ZXN0aW5nIGZvciBhY2tub3dsZWRnZW1lbnQuXG4gICAqIFRvIHJlcXVlc3QgYW4gYWNrbm93bGVkZ2VtZW50LCBhIGByZWNlaXB0YCBoZWFkZXIgbmVlZHMgdG8gYmUgc2VudCB3aXRoIHRoZSBhY3R1YWwgcmVxdWVzdC5cbiAgICogVGhlIHZhbHVlIChzYXkgcmVjZWlwdC1pZCkgZm9yIHRoaXMgaGVhZGVyIG5lZWRzIHRvIGJlIHVuaXF1ZSBmb3IgZWFjaCB1c2UuIFR5cGljYWxseSBhIHNlcXVlbmNlLCBhIFVVSUQsIGFcbiAgICogcmFuZG9tIG51bWJlciBvciBhIGNvbWJpbmF0aW9uIG1heSBiZSB1c2VkLlxuICAgKlxuICAgKiBBIGNvbXBsYWludCBicm9rZXIgd2lsbCBzZW5kIGEgUkVDRUlQVCBmcmFtZSB3aGVuIGFuIG9wZXJhdGlvbiBoYXMgYWN0dWFsbHkgYmVlbiBjb21wbGV0ZWQuXG4gICAqIFRoZSBvcGVyYXRpb24gbmVlZHMgdG8gYmUgbWF0Y2hlZCBiYXNlZCBpbiB0aGUgdmFsdWUgb2YgdGhlIHJlY2VpcHQtaWQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFsbG93IHdhdGNoaW5nIGZvciBhIHJlY2VpcHQgYW5kIGludm9rZSB0aGUgY2FsbGJhY2tcbiAgICogd2hlbiBjb3JyZXNwb25kaW5nIHJlY2VpcHQgaGFzIGJlZW4gcmVjZWl2ZWQuXG4gICAqXG4gICAqIFRoZSBhY3R1YWwge0BsaW5rIEZyYW1lfVxuICAgKiB3aWxsIGJlIHBhc3NlZCBhcyBwYXJhbWV0ZXIgdG8gdGhlIGNhbGxiYWNrLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqICAgICAgICAvLyBQdWJsaXNoaW5nIHdpdGggYWNrbm93bGVkZ2VtZW50XG4gICAqICAgICAgICBsZXQgcmVjZWlwdElkID0gcmFuZG9tVGV4dCgpO1xuICAgKlxuICAgKiAgICAgICAgcnhTdG9tcC53YWl0Rm9yUmVjZWlwdChyZWNlaXB0SWQsIGZ1bmN0aW9uKCkge1xuICAgKiAgICAgICAgICAvLyBXaWxsIGJlIGNhbGxlZCBhZnRlciBzZXJ2ZXIgYWNrbm93bGVkZ2VzXG4gICAqICAgICAgICB9KTtcbiAgICogICAgICAgIHJ4U3RvbXAucHVibGlzaCh7ZGVzdGluYXRpb246IFRFU1QuZGVzdGluYXRpb24sIGhlYWRlcnM6IHtyZWNlaXB0OiByZWNlaXB0SWR9LCBib2R5OiBtc2d9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIE1hcHMgdG86IFtDbGllbnQjd2F0Y2hGb3JSZWNlaXB0XXtAbGluayBDbGllbnQjd2F0Y2hGb3JSZWNlaXB0fVxuICAgKi9cbiAgcHVibGljIHdhaXRGb3JSZWNlaXB0KFxuICAgIHJlY2VpcHRJZDogc3RyaW5nLFxuICAgIGNhbGxiYWNrOiAoZnJhbWU6IEZyYW1lKSA9PiB2b2lkXG4gICk6IHZvaWQge1xuICAgIHN1cGVyLndhdGNoRm9yUmVjZWlwdChyZWNlaXB0SWQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGdldCBjbGllbnQoKTogQ2xpZW50IHtcbiAgICByZXR1cm4gdGhpcy5fc3RvbXBDbGllbnQ7XG4gIH1cblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+KFN0b21wU3RhdGUuQ0xPU0VEKTtcblxuICAgIHRoaXMuY29ubmVjdGlvblN0YXRlJC5zdWJzY3JpYmUoKHN0OiBSeFN0b21wU3RhdGUpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFJTZXJ2aWNlLl9tYXBTdG9tcFN0YXRlKHN0KSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqICoqVGhpcyBjbGFzcyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIHtAbGluayBJbmplY3RhYmxlUnhTdG9tcENvbmZpZ30uXG4gKiBJdCB3aWxsIGJlIGRyb3BwZWQgYEBzdG9tcC9uZzItc3RvbXBqc0A4LngueGAuKipcbiAqXG4gKiBSZXByZXNlbnRzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZVxuICogU1RPTVBTZXJ2aWNlIHRvIGNvbm5lY3QgdG8uXG4gKlxuICogVGhpcyBuYW1lIGNvbmZsaWN0cyB3aXRoIGEgY2xhc3Mgb2YgdGhlIHNhbWUgbmFtZSBpbiBAc3RvbXAvc3RvbXBqcywgZXhjbHVkaW5nIHRoaXMgZnJvbSB0aGUgZG9jdW1lbnRhdGlvbi5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNlcnZlciBVUkwgdG8gY29ubmVjdCB0by4gUGxlYXNlIHJlZmVyIHRvIHlvdXIgU1RPTVAgYnJva2VyIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMuXG4gICAqXG4gICAqIEV4YW1wbGU6IHdzOi8vMTI3LjAuMC4xOjE1Njc0L3dzIChmb3IgYSBSYWJiaXRNUSBkZWZhdWx0IHNldHVwIHJ1bm5pbmcgb24gbG9jYWxob3N0KVxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5IHRoaXMgcGFyYW1ldGVyIGNhbiBiZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYmplY3Qgc2ltaWxhciB0byBXZWJTb2NrZXRcbiAgICogKHR5cGljYWxseSBTb2NrSlMgaW5zdGFuY2UpLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKlxuICAgKiAoKSA9PiB7XG4gICAqICAgcmV0dXJuIG5ldyBTb2NrSlMoJ2h0dHA6Ly8xMjcuMC4wLjE6MTU2NzQvc3RvbXAnKTtcbiAgICogfVxuICAgKi9cbiAgdXJsOiBzdHJpbmcgfCAoKCkgPT4gYW55KTtcblxuICAvKipcbiAgICogSGVhZGVyc1xuICAgKiBUeXBpY2FsIGtleXM6IGxvZ2luOiBzdHJpbmcsIHBhc3Njb2RlOiBzdHJpbmcuXG4gICAqIGhvc3Q6c3RyaW5nIHdpbGwgbmVlZWQgdG8gYmUgcGFzc2VkIGZvciB2aXJ0dWFsIGhvc3RzIGluIFJhYmJpdE1RXG4gICAqL1xuICBoZWFkZXJzOiBTdG9tcEhlYWRlcnM7XG5cbiAgLyoqIEhvdyBvZnRlbiB0byBpbmNvbWluZyBoZWFydGJlYXQ/XG4gICAqIEludGVydmFsIGluIG1pbGxpc2Vjb25kcywgc2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDAgLSBkaXNhYmxlZFxuICAgKi9cbiAgaGVhcnRiZWF0X2luOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhvdyBvZnRlbiB0byBvdXRnb2luZyBoZWFydGJlYXQ/XG4gICAqIEludGVydmFsIGluIG1pbGxpc2Vjb25kcywgc2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDIwMDAwIC0gZXZlcnkgMjAgc2Vjb25kc1xuICAgKi9cbiAgaGVhcnRiZWF0X291dDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXYWl0IGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgYXR0ZW1wdGluZyBhdXRvIHJlY29ubmVjdFxuICAgKiBTZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgNTAwMCAoNSBzZWNvbmRzKVxuICAgKi9cbiAgcmVjb25uZWN0X2RlbGF5OiBudW1iZXI7XG5cbiAgLyoqIEVuYWJsZSBjbGllbnQgZGVidWdnaW5nPyAqL1xuICBkZWJ1ZzogYm9vbGVhbjtcbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU3RvbXBDb25maWcgfSBmcm9tICcuL3N0b21wLmNvbmZpZyc7XG5cbmltcG9ydCB7IFN0b21wUlNlcnZpY2UgfSBmcm9tICcuL3N0b21wLXIuc2VydmljZSc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiAqKlRoaXMgY2xhc3MgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiB7QGxpbmsgUnhTdG9tcFNlcnZpY2V9IHdpdGgge0BsaW5rIHJ4U3RvbXBTZXJ2aWNlRmFjdG9yeX0uXG4gKiBJdCB3aWxsIGJlIGRyb3BwZWQgYEBzdG9tcC9uZzItc3RvbXBqc0A4LngueGAuKipcbiAqXG4gKiBBbmd1bGFyMiBTVE9NUCBTZXJ2aWNlIHVzaW5nIEBzdG9tcC9zdG9tcC5qc1xuICpcbiAqIEBkZXNjcmlwdGlvbiBUaGlzIHNlcnZpY2UgaGFuZGxlcyBzdWJzY3JpYmluZyB0byBhXG4gKiBtZXNzYWdlIHF1ZXVlIHVzaW5nIHRoZSBzdG9tcC5qcyBsaWJyYXJ5LCBhbmQgcmV0dXJuc1xuICogdmFsdWVzIHZpYSB0aGUgRVM2IE9ic2VydmFibGUgc3BlY2lmaWNhdGlvbiBmb3JcbiAqIGFzeW5jaHJvbm91cyB2YWx1ZSBzdHJlYW1pbmcgYnkgd2lyaW5nIHRoZSBTVE9NUFxuICogbWVzc2FnZXMgaW50byBhbiBvYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSB3YW50IHRvIG1hbnVhbGx5IGNvbmZpZ3VyZSBhbmQgaW5pdGlhbGl6ZSB0aGUgc2VydmljZVxuICogcGxlYXNlIHVzZSBTdG9tcFJTZXJ2aWNlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFNlcnZpY2UgZXh0ZW5kcyBTdG9tcFJTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIFNlZSBSRUFETUUgYW5kIHNhbXBsZXMgZm9yIGNvbmZpZ3VyYXRpb24gZXhhbXBsZXNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuaW5pdEFuZENvbm5lY3QoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUnhTdG9tcCB9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcH0gd2l0aCBleGFjdGx5IHNhbWUgZnVuY3Rpb25hbGl0eS5cbiAqIFBsZWFzZSBzZWUge0BsaW5rIFJ4U3RvbXB9IGZvciBkZXRhaWxzLlxuICpcbiAqIFNlZToge0BsaW5rIC9ndWlkZS9uZzItc3RvbXBqcy9uZzItc3RvbXAtd2l0aC1hbmd1bGFyNy5odG1sfVxuICogZm9yIGEgc3RlcC1ieS1zdGVwIGd1aWRlLlxuICpcbiAqIFNlZSBhbHNvIHtAbGluayByeFN0b21wU2VydmljZUZhY3Rvcnl9LlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUnhTdG9tcFNlcnZpY2UgZXh0ZW5kcyBSeFN0b21wIHt9XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSeFN0b21wUlBDQ29uZmlnIH0gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcFJQQ0NvbmZpZ30uXG4gKlxuICogU2VlIGd1aWRlIGF0IHtAbGluayAvZ3VpZGUvcngtc3RvbXAvbmcyLXN0b21wanMvcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWx9XG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJbmplY3RhYmxlUnhTdG9tcFJQQ0NvbmZpZyBleHRlbmRzIFJ4U3RvbXBSUENDb25maWcge31cblxuLy8gQmFja3dhcmQgY29tcGF0aWJpbGl0eVxuLyoqXG4gKiBEZXByZWNhdGVkLCB1c2Uge0BsaW5rIEluamVjdGFibGVSeFN0b21wUlBDQ29uZmlnfSBpbnN0ZWFkXG4gKi9cbmV4cG9ydCBjb25zdCBJbmplY3RhYmxlUnhTdG9tcFJwY0NvbmZpZyA9IEluamVjdGFibGVSeFN0b21wUlBDQ29uZmlnO1xuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgUnhTdG9tcFJQQyB9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5pbXBvcnQgeyBSeFN0b21wU2VydmljZSB9IGZyb20gJy4vcngtc3RvbXAuc2VydmljZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlUnhTdG9tcFJQQ0NvbmZpZyB9IGZyb20gJy4vaW5qZWN0YWJsZS1yeC1zdG9tcC1ycGMtY29uZmlnJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcFJQQ30uXG4gKlxuICogU2VlIGd1aWRlIGF0IHtAbGluayAvZ3VpZGUvcngtc3RvbXAvbmcyLXN0b21wanMvcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWx9XG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSeFN0b21wUlBDU2VydmljZSBleHRlbmRzIFJ4U3RvbXBSUEMge1xuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlLCB0eXBpY2FsbHkgY2FsbGVkIGJ5IEFuZ3VsYXIgRGVwZW5kZW5jeSBJbmplY3Rpb24gZnJhbWV3b3JrLlxuICAgKlxuICAgKiBAcGFyYW0gcnhTdG9tcFxuICAgKiBAcGFyYW0gc3RvbXBSUENDb25maWdcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJ4U3RvbXA6IFJ4U3RvbXBTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHN0b21wUlBDQ29uZmlnPzogSW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWdcbiAgKSB7XG4gICAgc3VwZXIocnhTdG9tcCwgc3RvbXBSUENDb25maWcpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSeFN0b21wQ29uZmlnIH0gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIFRoaXMgY2xhc3MgaXMgSW5qZWN0YWJsZSB2ZXJzaW9uIG9mIHtAbGluayBSeFN0b21wQ29uZmlnfSB3aXRoIGV4YWN0bHkgc2FtZSBmdW5jdGlvbmFsaXR5LlxuICogUGxlYXNlIHNlZSB7QGxpbmsgUnhTdG9tcENvbmZpZ30gZm9yIGRldGFpbHMuXG4gKlxuICogU2VlOiB7QGxpbmsgL2d1aWRlL25nMi1zdG9tcGpzL25nMi1zdG9tcC13aXRoLWFuZ3VsYXI3Lmh0bWx9XG4gKiBmb3IgYSBzdGVwLWJ5LXN0ZXAgZ3VpZGUuXG4gKlxuICogSWYgYWxsIGZpZWxkcyBvZiBjb25maWd1cmF0aW9uIGFyZSBmaXhlZCBhbmQga25vd24gaW4gYWR2YW5jZSB5b3Ugd291bGQgdHlwaWNhbGx5IGRlZmluZVxuICogYSBgY29uc3RgIGFuZCBpbmplY3QgaXQgdXNpbmcgdmFsdWUuXG4gKlxuICogSWYgc29tZSBmaWVsZHMgd2lsbCBiZSBrbm93biBieSBsYXRlciwgaXQgY2FuIGJlIGluamVjdGVkIHVzaW5nIGEgZmFjdG9yeSBmdW5jdGlvbi5cbiAqXG4gKiBPY2Nhc2lvbmFsbHkgaXQgbWF5IG5lZWQgdG8gYmUgY29tYmluZWQgd2l0aCBBbmd1bGFyJ3MgQVBQX0lOSVRJQUxJWkVSIG1lY2hhbmlzbS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEluamVjdGFibGVSeFN0b21wQ29uZmlnIGV4dGVuZHMgUnhTdG9tcENvbmZpZyB7fVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZVJ4U3RvbXBDb25maWcgfSBmcm9tICcuL2luamVjdGFibGUtcngtc3RvbXAtY29uZmlnJztcbmltcG9ydCB7IFJ4U3RvbXBTZXJ2aWNlIH0gZnJvbSAnLi9yeC1zdG9tcC5zZXJ2aWNlJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIFRoaXMgaXMgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGNhbiBjcmVhdGUge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfVxuICogd2hlbiBjb25maWd1cmF0aW9uIGlzIGFscmVhZHkga25vd24uXG4gKiBZb3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIGZvciBkZWZpbmluZyBwcm92aWRlciBmb3Ige0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfS5cbiAqIHtAbGluayBSeFN0b21wU2VydmljZX0gY3JlYXRlZCB1c2luZyB0aGlzIGZ1bmN0aW9uIGlzIGNvbmZpZ3VyZWQgYW5kIGFjdGl2YXRlZC5cbiAqIFRoaXMgcHJvdmlkZXMgdGhlIHNpbXBsZXN0IG1lY2hhbmlzbSB0byBkZWZpbmUge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfSBmb3IgRGVwZW5kZW5jeSBJbmplY3Rpb24uXG4gKlxuICogU2VlOiB7QGxpbmsgL2d1aWRlL25nMi1zdG9tcGpzL25nMi1zdG9tcC13aXRoLWFuZ3VsYXI3Lmh0bWx9XG4gKiBmb3IgYSBzdGVwLWJ5LXN0ZXAgZ3VpZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByeFN0b21wU2VydmljZUZhY3RvcnkoXG4gIHJ4U3RvbXBDb25maWc6IEluamVjdGFibGVSeFN0b21wQ29uZmlnXG4pOiBSeFN0b21wU2VydmljZSB7XG4gIGNvbnN0IHJ4U3RvbXBTZXJ2aWNlID0gbmV3IFJ4U3RvbXBTZXJ2aWNlKCk7XG5cbiAgcnhTdG9tcFNlcnZpY2UuY29uZmlndXJlKHJ4U3RvbXBDb25maWcpO1xuICByeFN0b21wU2VydmljZS5hY3RpdmF0ZSgpO1xuXG4gIHJldHVybiByeFN0b21wU2VydmljZTtcbn1cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fZXh0ZW5kcyIsIkJlaGF2aW9yU3ViamVjdCIsIlJ4U3RvbXBTdGF0ZSIsIm1hcCIsIkluamVjdGFibGUiLCJSeFN0b21wIiwiUnhTdG9tcFJQQ0NvbmZpZyIsInJ4U3RvbXAiLCJPcHRpb25hbCIsIlJ4U3RvbXBSUEMiLCJSeFN0b21wQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQTtJQUVBLElBQUksYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDN0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO2FBQ2hDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVFLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvRSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBRUYsdUJBQTBCLENBQUMsRUFBRSxDQUFDO1FBQzFCLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDdkMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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