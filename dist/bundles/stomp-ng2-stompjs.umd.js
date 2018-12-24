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
     * See: {\@link /guide/ng2-stompjs/2018/11/04/ng2-stomp-with-angular7.html}
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
     * See guide at {\@link /guide/rx-stomp/ng2-stompjs/2018/10/12/remote-procedure-call.html}
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
     * See guide at {\@link /guide/rx-stomp/ng2-stompjs/2018/10/12/remote-procedure-call.html}
     */
    var RxStompRPCService = (function (_super) {
        __extends(RxStompRPCService, _super);
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
     * See: {\@link /guide/ng2-stompjs/2018/11/04/ng2-stomp-with-angular7.html}
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
     * See: {\@link /guide/ng2-stompjs/2018/11/04/ng2-stomp-with-angular7.html}
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9zdG9tcC1yLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAuY29uZmlnLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvcngtc3RvbXAuc2VydmljZS50cyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9pbmplY3RhYmxlLXJ4LXN0b21wLXJwYy1jb25maWcudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvcngtc3RvbXAtcnBjLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvaW5qZWN0YWJsZS1yeC1zdG9tcC1jb25maWcudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvcngtc3RvbXAtc2VydmljZS1mYWN0b3J5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtSeFN0b21wLCBSeFN0b21wQ29uZmlnLCBSeFN0b21wU3RhdGV9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5cbmltcG9ydCB7cHVibGlzaFBhcmFtcywgQ2xpZW50LCBNZXNzYWdlLCBGcmFtZX0gZnJvbSAnQHN0b21wL3N0b21wanMnO1xuXG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1N0b21wU3RhdGV9IGZyb20gJy4vc3RvbXAtc3RhdGUnO1xuaW1wb3J0IHsgU3RvbXBIZWFkZXJzIH0gZnJvbSAnLi9zdG9tcC1oZWFkZXJzJztcbmltcG9ydCB7U3RvbXBDb25maWd9IGZyb20gJy4vc3RvbXAuY29uZmlnJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqICoqVGhpcyBjbGFzcyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIHtAbGluayBSeFN0b21wU2VydmljZX0uXG4gKiBJdCB3aWxsIGJlIGRyb3BwZWQgYEBzdG9tcC9uZzItc3RvbXBqc0A4LngueGAuKipcbiAqXG4gKiBBbmd1bGFyMiBTVE9NUCBSYXcgU2VydmljZSB1c2luZyBAc3RvbXAvc3RvbXAuanNcbiAqXG4gKiBZb3Ugd2lsbCBvbmx5IG5lZWQgdGhlIHB1YmxpYyBwcm9wZXJ0aWVzIGFuZFxuICogbWV0aG9kcyBsaXN0ZWQgdW5sZXNzIHlvdSBhcmUgYW4gYWR2YW5jZWQgdXNlci4gVGhpcyBzZXJ2aWNlIGhhbmRsZXMgc3Vic2NyaWJpbmcgdG8gYVxuICogbWVzc2FnZSBxdWV1ZSB1c2luZyB0aGUgc3RvbXAuanMgbGlicmFyeSwgYW5kIHJldHVybnNcbiAqIHZhbHVlcyB2aWEgdGhlIEVTNiBPYnNlcnZhYmxlIHNwZWNpZmljYXRpb24gZm9yXG4gKiBhc3luY2hyb25vdXMgdmFsdWUgc3RyZWFtaW5nIGJ5IHdpcmluZyB0aGUgU1RPTVBcbiAqIG1lc3NhZ2VzIGludG8gYW4gb2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3Ugd2lsbCBsaWtlIHRvIHBhc3MgdGhlIGNvbmZpZ3VyYXRpb24gYXMgYSBkZXBlbmRlbmN5LFxuICogcGxlYXNlIHVzZSBTdG9tcFNlcnZpY2UgY2xhc3MuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFJTZXJ2aWNlIGV4dGVuZHMgUnhTdG9tcCB7XG4gIC8qKlxuICAgKiBTdGF0ZSBvZiB0aGUgU1RPTVBTZXJ2aWNlXG4gICAqXG4gICAqIEl0IGlzIGEgQmVoYXZpb3JTdWJqZWN0IGFuZCB3aWxsIGVtaXQgY3VycmVudCBzdGF0dXMgaW1tZWRpYXRlbHkuIFRoaXMgd2lsbCB0eXBpY2FsbHkgZ2V0XG4gICAqIHVzZWQgdG8gc2hvdyBjdXJyZW50IHN0YXR1cyB0byB0aGUgZW5kIHVzZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGU6IEJlaGF2aW9yU3ViamVjdDxTdG9tcFN0YXRlPjtcblxuICBwcml2YXRlIHN0YXRpYyBfbWFwU3RvbXBTdGF0ZShzdDogUnhTdG9tcFN0YXRlKTogU3RvbXBTdGF0ZSB7XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuQ09OTkVDVElORykge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuVFJZSU5HO1xuICAgIH1cbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5PUEVOKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5DT05ORUNURUQ7XG4gICAgfVxuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLkNMT1NJTkcpIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLkRJU0NPTk5FQ1RJTkc7XG4gICAgfVxuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLkNMT1NFRCkge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuQ0xPU0VEO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIHRyaWdnZXIgd2hlbiBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLiBVc2UgdGhpcyB0byBjYXJyeSBvdXQgaW5pdGlhbGl6YXRpb24uXG4gICAqIEl0IHdpbGwgdHJpZ2dlciBldmVyeSB0aW1lIGEgKHJlKWNvbm5lY3Rpb24gb2NjdXJzLiBJZiBpdCBpcyBhbHJlYWR5IGNvbm5lY3RlZFxuICAgKiBpdCB3aWxsIHRyaWdnZXIgaW1tZWRpYXRlbHkuIFlvdSBjYW4gc2FmZWx5IGlnbm9yZSB0aGUgdmFsdWUsIGFzIGl0IHdpbGwgYWx3YXlzIGJlXG4gICAqIFN0b21wU3RhdGUuQ09OTkVDVEVEXG4gICAqL1xuICBnZXQgY29ubmVjdE9ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxTdG9tcFN0YXRlPiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGVkJC5waXBlKG1hcCgoc3Q6IFJ4U3RvbXBTdGF0ZSk6IFN0b21wU3RhdGUgPT4ge1xuICAgICAgcmV0dXJuIFN0b21wUlNlcnZpY2UuX21hcFN0b21wU3RhdGUoc3QpO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBoZWFkZXJzIGZyb20gbW9zdCByZWNlbnQgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyIGFzIHJldHVybiBieSB0aGUgQ09OTkVDVEVEXG4gICAqIGZyYW1lLlxuICAgKiBJZiB0aGUgU1RPTVAgY29ubmVjdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGVzdGFibGlzaGVkIGl0IHdpbGwgdHJpZ2dlciBpbW1lZGlhdGVseS5cbiAgICogSXQgd2lsbCBhZGRpdGlvbmFsbHkgdHJpZ2dlciBpbiBldmVudCBvZiByZWNvbm5lY3Rpb24sIHRoZSB2YWx1ZSB3aWxsIGJlIHNldCBvZiBoZWFkZXJzIGZyb21cbiAgICogdGhlIHJlY2VudCBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAqL1xuICBnZXQgc2VydmVySGVhZGVyc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxTdG9tcEhlYWRlcnM+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXJIZWFkZXJzJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIG1lc3NhZ2VzIHRvIHRoZSBkZWZhdWx0IHF1ZXVlIChhbnkgbWVzc2FnZSB0aGF0IGFyZSBub3QgaGFuZGxlZCBieSBhIHN1YnNjcmlwdGlvbilcbiAgICovXG4gIGdldCBkZWZhdWx0TWVzc2FnZXNPYnNlcnZhYmxlKCk6IFN1YmplY3Q8TWVzc2FnZT4ge1xuICAgIHJldHVybiB0aGlzLnVuaGFuZGxlZE1lc3NhZ2UkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgcmVjZWlwdHNcbiAgICovXG4gIGdldCByZWNlaXB0c09ic2VydmFibGUoKTogU3ViamVjdDxGcmFtZT4ge1xuICAgIHJldHVybiB0aGlzLnVuaGFuZGxlZFJlY2VpcHRzJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIHRyaWdnZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMuIFRoaXMgU3ViamVjdCBjYW4gYmUgdXNlZCB0byBoYW5kbGUgZXJyb3JzIGZyb21cbiAgICogdGhlIHN0b21wIGJyb2tlci5cbiAgICovXG4gIGdldCBlcnJvclN1YmplY3QoKTogU3ViamVjdDxzdHJpbmcgfCBGcmFtZT4ge1xuICAgIHJldHVybiB0aGlzLnN0b21wRXJyb3JzJDtcbiAgfVxuXG4gIC8qKiBTZXQgY29uZmlndXJhdGlvbiAqL1xuICBzZXQgY29uZmlnKGNvbmZpZzogU3RvbXBDb25maWcpIHtcbiAgICBjb25zdCByeFN0b21wQ29uZmlnOiBSeFN0b21wQ29uZmlnID0geyB9O1xuXG4gICAgaWYgKHR5cGVvZihjb25maWcudXJsKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJ4U3RvbXBDb25maWcuYnJva2VyVVJMID0gY29uZmlnLnVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgcnhTdG9tcENvbmZpZy53ZWJTb2NrZXRGYWN0b3J5ID0gY29uZmlnLnVybDtcbiAgICB9XG5cbiAgICAvLyBDb25maWd1cmUgY2xpZW50IGhlYXJ0LWJlYXRpbmdcbiAgICByeFN0b21wQ29uZmlnLmhlYXJ0YmVhdEluY29taW5nID0gY29uZmlnLmhlYXJ0YmVhdF9pbjtcbiAgICByeFN0b21wQ29uZmlnLmhlYXJ0YmVhdE91dGdvaW5nID0gY29uZmlnLmhlYXJ0YmVhdF9vdXQ7XG5cbiAgICAvLyBBdXRvIHJlY29ubmVjdFxuICAgIHJ4U3RvbXBDb25maWcucmVjb25uZWN0RGVsYXkgPSBjb25maWcucmVjb25uZWN0X2RlbGF5O1xuXG4gICAgaWYgKGNvbmZpZy5kZWJ1Zykge1xuICAgICAgcnhTdG9tcENvbmZpZy5kZWJ1ZyA9IChzdHI6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpLCBzdHIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByeFN0b21wQ29uZmlnLmNvbm5lY3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShyeFN0b21wQ29uZmlnKTtcbiAgfVxuICAvKipcbiAgICogSXQgd2lsbCBjb25uZWN0IHRvIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgaW5pdEFuZENvbm5lY3QoKTogdm9pZCB7XG4gICAgLy8gZGlzY29ubmVjdCBpZiBjb25uZWN0ZWRcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcblxuICAgIC8vIEF0dGVtcHQgY29ubmVjdGlvbiwgcGFzc2luZyBpbiBhIGNhbGxiYWNrXG4gICAgdGhpcy5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBTVE9NUCBicm9rZXIuXG4gICAqL1xuICBwdWJsaWMgZGlzY29ubmVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHNlbmQgYSBtZXNzYWdlIHRvIGEgbmFtZWQgZGVzdGluYXRpb24uIFRoZSBtZXNzYWdlIG11c3QgYmUgYHN0cmluZ2AuXG4gICAqXG4gICAqIFRoZSBtZXNzYWdlIHdpbGwgZ2V0IGxvY2FsbHkgcXVldWVkIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC4gSXQgd2lsbCBhdHRlbXB0IHRvXG4gICAqIHB1Ymxpc2ggcXVldWVkIG1lc3NhZ2VzIGFzIHNvb24gYXMgdGhlIGJyb2tlciBnZXRzIGNvbm5lY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHB1Ymxpc2gocXVldWVOYW1lOiBzdHJpbmd8cHVibGlzaFBhcmFtcywgbWVzc2FnZT86IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHF1ZXVlTmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN1cGVyLnB1Ymxpc2goe2Rlc3RpbmF0aW9uOiBxdWV1ZU5hbWUgYXMgc3RyaW5nLCBib2R5OiBtZXNzYWdlLCBoZWFkZXJzfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHB1YlBhcmFtczogcHVibGlzaFBhcmFtcyA9IHF1ZXVlTmFtZTtcbiAgICAgIHN1cGVyLnB1Ymxpc2gocHViUGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBzdWJzY3JpYmUgdG8gc2VydmVyIG1lc3NhZ2UgcXVldWVzXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzYWZlbHkgY2FsbGVkIGV2ZW4gaWYgdGhlIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLlxuICAgKiBJZiB0aGUgdW5kZXJseWluZyBTVE9NUCBjb25uZWN0aW9uIGRyb3BzIGFuZCByZWNvbm5lY3RzLCBpdCB3aWxsIHJlc3Vic2NyaWJlIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIElmIGEgaGVhZGVyIGZpZWxkICdhY2snIGlzIG5vdCBleHBsaWNpdGx5IHBhc3NlZCwgJ2Fjaycgd2lsbCBiZSBzZXQgdG8gJ2F1dG8nLiBJZiB5b3VcbiAgICogZG8gbm90IHVuZGVyc3RhbmQgd2hhdCBpdCBtZWFucywgcGxlYXNlIGxlYXZlIGl0IGFzIGlzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgd2hlbiB3b3JraW5nIHdpdGggdGVtcG9yYXJ5IHF1ZXVlcyB3aGVyZSB0aGUgc3Vic2NyaXB0aW9uIHJlcXVlc3RcbiAgICogY3JlYXRlcyB0aGVcbiAgICogdW5kZXJseWluZyBxdWV1ZSwgbXNzYWdlcyBtaWdodCBiZSBtaXNzZWQgZHVyaW5nIHJlY29ubmVjdC4gVGhpcyBpc3N1ZSBpcyBub3Qgc3BlY2lmaWNcbiAgICogdG8gdGhpcyBsaWJyYXJ5IGJ1dCB0aGUgd2F5IFNUT01QIGJyb2tlcnMgYXJlIGRlc2lnbmVkIHRvIHdvcmsuXG4gICAqXG4gICAqIEBwYXJhbSBxdWV1ZU5hbWVcbiAgICogQHBhcmFtIGhlYWRlcnNcbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUocXVldWVOYW1lOiBzdHJpbmcsIGhlYWRlcnM6IFN0b21wSGVhZGVycyA9IHt9KTogT2JzZXJ2YWJsZTxNZXNzYWdlPiB7XG4gICAgcmV0dXJuIHRoaXMud2F0Y2gocXVldWVOYW1lLCBoZWFkZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVE9NUCBicm9rZXJzIG1heSBjYXJyeSBvdXQgb3BlcmF0aW9uIGFzeW5jaHJvbm91c2x5IGFuZCBhbGxvdyByZXF1ZXN0aW5nIGZvciBhY2tub3dsZWRnZW1lbnQuXG4gICAqIFRvIHJlcXVlc3QgYW4gYWNrbm93bGVkZ2VtZW50LCBhIGByZWNlaXB0YCBoZWFkZXIgbmVlZHMgdG8gYmUgc2VudCB3aXRoIHRoZSBhY3R1YWwgcmVxdWVzdC5cbiAgICogVGhlIHZhbHVlIChzYXkgcmVjZWlwdC1pZCkgZm9yIHRoaXMgaGVhZGVyIG5lZWRzIHRvIGJlIHVuaXF1ZSBmb3IgZWFjaCB1c2UuIFR5cGljYWxseSBhIHNlcXVlbmNlLCBhIFVVSUQsIGFcbiAgICogcmFuZG9tIG51bWJlciBvciBhIGNvbWJpbmF0aW9uIG1heSBiZSB1c2VkLlxuICAgKlxuICAgKiBBIGNvbXBsYWludCBicm9rZXIgd2lsbCBzZW5kIGEgUkVDRUlQVCBmcmFtZSB3aGVuIGFuIG9wZXJhdGlvbiBoYXMgYWN0dWFsbHkgYmVlbiBjb21wbGV0ZWQuXG4gICAqIFRoZSBvcGVyYXRpb24gbmVlZHMgdG8gYmUgbWF0Y2hlZCBiYXNlZCBpbiB0aGUgdmFsdWUgb2YgdGhlIHJlY2VpcHQtaWQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFsbG93IHdhdGNoaW5nIGZvciBhIHJlY2VpcHQgYW5kIGludm9rZSB0aGUgY2FsbGJhY2tcbiAgICogd2hlbiBjb3JyZXNwb25kaW5nIHJlY2VpcHQgaGFzIGJlZW4gcmVjZWl2ZWQuXG4gICAqXG4gICAqIFRoZSBhY3R1YWwge0BsaW5rIEZyYW1lfVxuICAgKiB3aWxsIGJlIHBhc3NlZCBhcyBwYXJhbWV0ZXIgdG8gdGhlIGNhbGxiYWNrLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqICAgICAgICAvLyBQdWJsaXNoaW5nIHdpdGggYWNrbm93bGVkZ2VtZW50XG4gICAqICAgICAgICBsZXQgcmVjZWlwdElkID0gcmFuZG9tVGV4dCgpO1xuICAgKlxuICAgKiAgICAgICAgcnhTdG9tcC53YWl0Rm9yUmVjZWlwdChyZWNlaXB0SWQsIGZ1bmN0aW9uKCkge1xuICAgKiAgICAgICAgICAvLyBXaWxsIGJlIGNhbGxlZCBhZnRlciBzZXJ2ZXIgYWNrbm93bGVkZ2VzXG4gICAqICAgICAgICB9KTtcbiAgICogICAgICAgIHJ4U3RvbXAucHVibGlzaCh7ZGVzdGluYXRpb246IFRFU1QuZGVzdGluYXRpb24sIGhlYWRlcnM6IHtyZWNlaXB0OiByZWNlaXB0SWR9LCBib2R5OiBtc2d9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIE1hcHMgdG86IFtDbGllbnQjd2F0Y2hGb3JSZWNlaXB0XXtAbGluayBDbGllbnQjd2F0Y2hGb3JSZWNlaXB0fVxuICAgKi9cbiAgcHVibGljIHdhaXRGb3JSZWNlaXB0KHJlY2VpcHRJZDogc3RyaW5nLCBjYWxsYmFjazogKGZyYW1lOiBGcmFtZSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHN1cGVyLndhdGNoRm9yUmVjZWlwdChyZWNlaXB0SWQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGdldCBjbGllbnQoKTogQ2xpZW50IHtcbiAgICByZXR1cm4gdGhpcy5fc3RvbXBDbGllbnQ7XG4gIH1cblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+KFN0b21wU3RhdGUuQ0xPU0VEKTtcblxuICAgIHRoaXMuY29ubmVjdGlvblN0YXRlJC5zdWJzY3JpYmUoKHN0OiBSeFN0b21wU3RhdGUpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFJTZXJ2aWNlLl9tYXBTdG9tcFN0YXRlKHN0KSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqICoqVGhpcyBjbGFzcyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIHtAbGluayBJbmplY3RhYmxlUnhTdG9tcENvbmZpZ30uXG4gKiBJdCB3aWxsIGJlIGRyb3BwZWQgYEBzdG9tcC9uZzItc3RvbXBqc0A4LngueGAuKipcbiAqXG4gKiBSZXByZXNlbnRzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZVxuICogU1RPTVBTZXJ2aWNlIHRvIGNvbm5lY3QgdG8uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcENvbmZpZyB7XG4gIC8qKlxuICAgKiBTZXJ2ZXIgVVJMIHRvIGNvbm5lY3QgdG8uIFBsZWFzZSByZWZlciB0byB5b3VyIFNUT01QIGJyb2tlciBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzLlxuICAgKlxuICAgKiBFeGFtcGxlOiB3czovLzEyNy4wLjAuMToxNTY3NC93cyAoZm9yIGEgUmFiYml0TVEgZGVmYXVsdCBzZXR1cCBydW5uaW5nIG9uIGxvY2FsaG9zdClcbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSB0aGlzIHBhcmFtZXRlciBjYW4gYmUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gb2JqZWN0IHNpbWlsYXIgdG8gV2ViU29ja2V0XG4gICAqICh0eXBpY2FsbHkgU29ja0pTIGluc3RhbmNlKS5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICpcbiAgICogKCkgPT4ge1xuICAgKiAgIHJldHVybiBuZXcgU29ja0pTKCdodHRwOi8vMTI3LjAuMC4xOjE1Njc0L3N0b21wJyk7XG4gICAqIH1cbiAgICovXG4gIHVybDogc3RyaW5nIHwgKCgpID0+IGFueSk7XG5cbiAgLyoqXG4gICAqIEhlYWRlcnNcbiAgICogVHlwaWNhbCBrZXlzOiBsb2dpbjogc3RyaW5nLCBwYXNzY29kZTogc3RyaW5nLlxuICAgKiBob3N0OnN0cmluZyB3aWxsIG5lZWVkIHRvIGJlIHBhc3NlZCBmb3IgdmlydHVhbCBob3N0cyBpbiBSYWJiaXRNUVxuICAgKi9cbiAgaGVhZGVyczogU3RvbXBIZWFkZXJzO1xuXG4gIC8qKiBIb3cgb2Z0ZW4gdG8gaW5jb21pbmcgaGVhcnRiZWF0P1xuICAgKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMsIHNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSAwIC0gZGlzYWJsZWRcbiAgICovXG4gIGhlYXJ0YmVhdF9pbjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIb3cgb2Z0ZW4gdG8gb3V0Z29pbmcgaGVhcnRiZWF0P1xuICAgKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMsIHNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSAyMDAwMCAtIGV2ZXJ5IDIwIHNlY29uZHNcbiAgICovXG4gIGhlYXJ0YmVhdF9vdXQ6IG51bWJlcjtcblxuICAvKipcbiAgICogV2FpdCBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIGF0dGVtcHRpbmcgYXV0byByZWNvbm5lY3RcbiAgICogU2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDUwMDAgKDUgc2Vjb25kcylcbiAgICovXG4gIHJlY29ubmVjdF9kZWxheTogbnVtYmVyO1xuXG4gIC8qKiBFbmFibGUgY2xpZW50IGRlYnVnZ2luZz8gKi9cbiAgZGVidWc6IGJvb2xlYW47XG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFN0b21wQ29uZmlnIH0gZnJvbSAnLi9zdG9tcC5jb25maWcnO1xuXG5pbXBvcnQgeyBTdG9tcFJTZXJ2aWNlIH0gZnJvbSAnLi9zdG9tcC1yLnNlcnZpY2UnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogKipUaGlzIGNsYXNzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2Yge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfSB3aXRoIHtAbGluayByeFN0b21wU2VydmljZUZhY3Rvcnl9LlxuICogSXQgd2lsbCBiZSBkcm9wcGVkIGBAc3RvbXAvbmcyLXN0b21wanNAOC54LnhgLioqXG4gKlxuICogQW5ndWxhcjIgU1RPTVAgU2VydmljZSB1c2luZyBAc3RvbXAvc3RvbXAuanNcbiAqXG4gKiBAZGVzY3JpcHRpb24gVGhpcyBzZXJ2aWNlIGhhbmRsZXMgc3Vic2NyaWJpbmcgdG8gYVxuICogbWVzc2FnZSBxdWV1ZSB1c2luZyB0aGUgc3RvbXAuanMgbGlicmFyeSwgYW5kIHJldHVybnNcbiAqIHZhbHVlcyB2aWEgdGhlIEVTNiBPYnNlcnZhYmxlIHNwZWNpZmljYXRpb24gZm9yXG4gKiBhc3luY2hyb25vdXMgdmFsdWUgc3RyZWFtaW5nIGJ5IHdpcmluZyB0aGUgU1RPTVBcbiAqIG1lc3NhZ2VzIGludG8gYW4gb2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byBtYW51YWxseSBjb25maWd1cmUgYW5kIGluaXRpYWxpemUgdGhlIHNlcnZpY2VcbiAqIHBsZWFzZSB1c2UgU3RvbXBSU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBTZXJ2aWNlIGV4dGVuZHMgU3RvbXBSU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIFNlZSBSRUFETUUgYW5kIHNhbXBsZXMgZm9yIGNvbmZpZ3VyYXRpb24gZXhhbXBsZXNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuaW5pdEFuZENvbm5lY3QoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUnhTdG9tcCB9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcH0gd2l0aCBleGFjdGx5IHNhbWUgZnVuY3Rpb25hbGl0eS5cbiAqIFBsZWFzZSBzZWUge0BsaW5rIFJ4U3RvbXB9IGZvciBkZXRhaWxzLlxuICpcbiAqIFNlZToge0BsaW5rIC9ndWlkZS9uZzItc3RvbXBqcy8yMDE4LzExLzA0L25nMi1zdG9tcC13aXRoLWFuZ3VsYXI3Lmh0bWx9XG4gKiBmb3IgYSBzdGVwLWJ5LXN0ZXAgZ3VpZGUuXG4gKlxuICogU2VlIGFsc28ge0BsaW5rIHJ4U3RvbXBTZXJ2aWNlRmFjdG9yeX0uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSeFN0b21wU2VydmljZSBleHRlbmRzIFJ4U3RvbXAgeyB9XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSeFN0b21wUlBDQ29uZmlnfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogSW5qZWN0YWJsZSB2ZXJzaW9uIG9mIHtAbGluayBSeFN0b21wUlBDQ29uZmlnfS5cbiAqXG4gKiBTZWUgZ3VpZGUgYXQge0BsaW5rIC9ndWlkZS9yeC1zdG9tcC9uZzItc3RvbXBqcy8yMDE4LzEwLzEyL3JlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sfVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWcgZXh0ZW5kcyBSeFN0b21wUlBDQ29uZmlnIHsgfVxuXG4vLyBCYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4vKipcbiAqIERlcHJlY2F0ZWQsIHVzZSB7QGxpbmsgSW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWd9IGluc3RlYWRcbiAqL1xuZXhwb3J0IGNvbnN0IEluamVjdGFibGVSeFN0b21wUnBjQ29uZmlnID0gSW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWc7XG4iLCJpbXBvcnQge0luamVjdGFibGUsIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtSeFN0b21wUlBDfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuaW1wb3J0IHtSeFN0b21wU2VydmljZX0gZnJvbSAnLi9yeC1zdG9tcC5zZXJ2aWNlJztcbmltcG9ydCB7SW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWd9IGZyb20gJy4vaW5qZWN0YWJsZS1yeC1zdG9tcC1ycGMtY29uZmlnJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcFJQQ30uXG4gKlxuICogU2VlIGd1aWRlIGF0IHtAbGluayAvZ3VpZGUvcngtc3RvbXAvbmcyLXN0b21wanMvMjAxOC8xMC8xMi9yZW1vdGUtcHJvY2VkdXJlLWNhbGwuaHRtbH1cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJ4U3RvbXBSUENTZXJ2aWNlIGV4dGVuZHMgUnhTdG9tcFJQQyB7XG4gIGNvbnN0cnVjdG9yKHJ4U3RvbXA6IFJ4U3RvbXBTZXJ2aWNlLCBAT3B0aW9uYWwoKSBzdG9tcFJQQ0NvbmZpZz86IEluamVjdGFibGVSeFN0b21wUlBDQ29uZmlnKSB7XG4gICAgc3VwZXIocnhTdG9tcCwgc3RvbXBSUENDb25maWcpO1xuICB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSeFN0b21wQ29uZmlnfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBJbmplY3RhYmxlIHZlcnNpb24gb2Yge0BsaW5rIFJ4U3RvbXBDb25maWd9IHdpdGggZXhhY3RseSBzYW1lIGZ1bmN0aW9uYWxpdHkuXG4gKiBQbGVhc2Ugc2VlIHtAbGluayBSeFN0b21wQ29uZmlnfSBmb3IgZGV0YWlscy5cbiAqXG4gKiBTZWU6IHtAbGluayAvZ3VpZGUvbmcyLXN0b21wanMvMjAxOC8xMS8wNC9uZzItc3RvbXAtd2l0aC1hbmd1bGFyNy5odG1sfVxuICogZm9yIGEgc3RlcC1ieS1zdGVwIGd1aWRlLlxuICpcbiAqIElmIGFsbCBmaWVsZHMgb2YgY29uZmlndXJhdGlvbiBhcmUgZml4ZWQgYW5kIGtub3duIGluIGFkdmFuY2UgeW91IHdvdWxkIHR5cGljYWxseSBkZWZpbmVcbiAqIGEgYGNvbnN0YCBhbmQgaW5qZWN0IGl0IHVzaW5nIHZhbHVlLlxuICpcbiAqIElmIHNvbWUgZmllbGRzIHdpbGwgYmUga25vd24gYnkgbGF0ZXIsIGl0IGNhbiBiZSBpbmplY3RlZCB1c2luZyBhIGZhY3RvcnkgZnVuY3Rpb24uXG4gKlxuICogT2NjYXNpb25hbGx5IGl0IG1heSBuZWVkIHRvIGJlIGNvbWJpbmVkIHdpdGggQW5ndWxhcidzIEFQUF9JTklUSUFMSVpFUiBtZWNoYW5pc20uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJbmplY3RhYmxlUnhTdG9tcENvbmZpZyBleHRlbmRzIFJ4U3RvbXBDb25maWcgeyB9XG4iLCJpbXBvcnQge0luamVjdGFibGVSeFN0b21wQ29uZmlnfSBmcm9tICcuL2luamVjdGFibGUtcngtc3RvbXAtY29uZmlnJztcbmltcG9ydCB7UnhTdG9tcFNlcnZpY2V9IGZyb20gJy4vcngtc3RvbXAuc2VydmljZSc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiBUaGlzIGlzIGZhY3RvcnkgZnVuY3Rpb24gdGhhdCBjYW4gY3JlYXRlIHtAbGluayBSeFN0b21wU2VydmljZX1cbiAqIHdoZW4gY29uZmlndXJhdGlvbiBpcyBhbHJlYWR5IGtub3duLlxuICogWW91IGNhbiB1c2UgdGhpcyBmdW5jdGlvbiBmb3IgZGVmaW5pbmcgcHJvdmlkZXIgZm9yIHtAbGluayBSeFN0b21wU2VydmljZX0uXG4gKiB7QGxpbmsgUnhTdG9tcFNlcnZpY2V9IGNyZWF0ZWQgdXNpbmcgdGhpcyBmdW5jdGlvbiBpcyBjb25maWd1cmVkIGFuZCBhY3RpdmF0ZWQuXG4gKiBUaGlzIHByb3ZpZGVzIHRoZSBzaW1wbGVzdCBtZWNoYW5pc20gdG8gZGVmaW5lIHtAbGluayBSeFN0b21wU2VydmljZX0gZm9yIERlcGVuZGVuY3kgSW5qZWN0aW9uLlxuICpcbiAqIFNlZToge0BsaW5rIC9ndWlkZS9uZzItc3RvbXBqcy8yMDE4LzExLzA0L25nMi1zdG9tcC13aXRoLWFuZ3VsYXI3Lmh0bWx9XG4gKiBmb3IgYSBzdGVwLWJ5LXN0ZXAgZ3VpZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByeFN0b21wU2VydmljZUZhY3RvcnkocnhTdG9tcENvbmZpZzogSW5qZWN0YWJsZVJ4U3RvbXBDb25maWcpOiBSeFN0b21wU2VydmljZSB7XG4gIGNvbnN0IHJ4U3RvbXBTZXJ2aWNlID0gbmV3IFJ4U3RvbXBTZXJ2aWNlKCk7XG5cbiAgcnhTdG9tcFNlcnZpY2UuY29uZmlndXJlKHJ4U3RvbXBDb25maWcpO1xuICByeFN0b21wU2VydmljZS5hY3RpdmF0ZSgpO1xuXG4gIHJldHVybiByeFN0b21wU2VydmljZTtcbn1cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fZXh0ZW5kcyIsIkJlaGF2aW9yU3ViamVjdCIsIlJ4U3RvbXBTdGF0ZSIsIm1hcCIsIkluamVjdGFibGUiLCJSeFN0b21wIiwiUnhTdG9tcFJQQ0NvbmZpZyIsInJ4U3RvbXAiLCJPcHRpb25hbCIsIlJ4U3RvbXBSUEMiLCJSeFN0b21wQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQTtJQUVBLElBQUksYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDN0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO2FBQ2hDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVFLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFBRSxDQUFDLENBQUMsQ0FBQyxD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