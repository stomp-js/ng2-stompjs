import { __extends } from 'tslib';
import { Injectable, Optional } from '@angular/core';
import { RxStomp, RxStompState, RxStompRPCConfig, RxStompRPC, RxStompConfig } from '@stomp/rx-stomp';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
var StompRService = /** @class */ (function (_super) {
    __extends(StompRService, _super);
    function StompRService() {
        var _this = _super.call(this) || this;
        _this.state = new BehaviorSubject(StompState.CLOSED);
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
        if (st === RxStompState.CONNECTING) {
            return StompState.TRYING;
        }
        if (st === RxStompState.OPEN) {
            return StompState.CONNECTED;
        }
        if (st === RxStompState.CLOSING) {
            return StompState.DISCONNECTING;
        }
        if (st === RxStompState.CLOSED) {
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
         */
        function () {
            return this.connected$.pipe(map(function (st) {
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
         */
        function () {
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
         */
        function () {
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
         */
        function () {
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
         */
        function () {
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
         */
        function (config) {
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
        if (headers === void 0) { headers = {}; }
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
        if (headers === void 0) { headers = {}; }
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
     * The actual {\@link https://stomp-js.github.io/stompjs/classes/Frame.html}
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
     * Maps to: https://stomp-js.github.io/stompjs/classes/Client.html#watchForReceipt
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
     * The actual {\@link https://stomp-js.github.io/stompjs/classes/Frame.html}
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
     * Maps to: https://stomp-js.github.io/stompjs/classes/Client.html#watchForReceipt
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
         */
        function () {
            return this._stompClient;
        },
        enumerable: true,
        configurable: true
    });
    StompRService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StompRService.ctorParameters = function () { return []; };
    return StompRService;
}(RxStomp));

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
var RxStompService = /** @class */ (function (_super) {
    __extends(RxStompService, _super);
    function RxStompService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RxStompService.decorators = [
        { type: Injectable }
    ];
    return RxStompService;
}(RxStomp));

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
var InjectableRxStompRpcConfig = /** @class */ (function (_super) {
    __extends(InjectableRxStompRpcConfig, _super);
    function InjectableRxStompRpcConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InjectableRxStompRpcConfig.decorators = [
        { type: Injectable }
    ];
    return InjectableRxStompRpcConfig;
}(RxStompRPCConfig));

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
var RxStompRPCService = /** @class */ (function (_super) {
    __extends(RxStompRPCService, _super);
    function RxStompRPCService(rxStomp, stompRPCConfig) {
        return _super.call(this, rxStomp, stompRPCConfig) || this;
    }
    RxStompRPCService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    RxStompRPCService.ctorParameters = function () { return [
        { type: RxStompService, },
        { type: InjectableRxStompRpcConfig, decorators: [{ type: Optional },] },
    ]; };
    return RxStompRPCService;
}(RxStompRPC));

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
var InjectableRxStompConfig = /** @class */ (function (_super) {
    __extends(InjectableRxStompConfig, _super);
    function InjectableRxStompConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InjectableRxStompConfig.decorators = [
        { type: Injectable }
    ];
    return InjectableRxStompConfig;
}(RxStompConfig));

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

export { StompRService, StompService, StompState, StompConfig, RxStompRPCService, RxStompService, InjectableRxStompConfig, InjectableRxStompRpcConfig, rxStompServiceFactory };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvc3RvbXAtci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3N0b21wLmNvbmZpZy50cyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9zdG9tcC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3J4LXN0b21wLnNlcnZpY2UudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvaW5qZWN0YWJsZS1yeC1zdG9tcC1ycGMtY29uZmlnLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3J4LXN0b21wLXJwYy5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL2luamVjdGFibGUtcngtc3RvbXAtY29uZmlnLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL3J4LXN0b21wLXNlcnZpY2UtZmFjdG9yeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1J4U3RvbXAsIFJ4U3RvbXBDb25maWcsIFJ4U3RvbXBTdGF0ZX0gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcblxuaW1wb3J0IHtwdWJsaXNoUGFyYW1zLCBDbGllbnQsIE1lc3NhZ2UsIEZyYW1lfSBmcm9tICdAc3RvbXAvc3RvbXBqcyc7XG5cbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7U3RvbXBTdGF0ZX0gZnJvbSAnLi9zdG9tcC1zdGF0ZSc7XG5pbXBvcnQgeyBTdG9tcEhlYWRlcnMgfSBmcm9tICcuL3N0b21wLWhlYWRlcnMnO1xuaW1wb3J0IHtTdG9tcENvbmZpZ30gZnJvbSAnLi9zdG9tcC5jb25maWcnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogKipUaGlzIGNsYXNzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2Yge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfS5cbiAqIEl0IHdpbGwgYmUgZHJvcHBlZCBgQHN0b21wL25nMi1zdG9tcGpzQDgueC54YC4qKlxuICpcbiAqIEFuZ3VsYXIyIFNUT01QIFJhdyBTZXJ2aWNlIHVzaW5nIEBzdG9tcC9zdG9tcC5qc1xuICpcbiAqIFlvdSB3aWxsIG9ubHkgbmVlZCB0aGUgcHVibGljIHByb3BlcnRpZXMgYW5kXG4gKiBtZXRob2RzIGxpc3RlZCB1bmxlc3MgeW91IGFyZSBhbiBhZHZhbmNlZCB1c2VyLiBUaGlzIHNlcnZpY2UgaGFuZGxlcyBzdWJzY3JpYmluZyB0byBhXG4gKiBtZXNzYWdlIHF1ZXVlIHVzaW5nIHRoZSBzdG9tcC5qcyBsaWJyYXJ5LCBhbmQgcmV0dXJuc1xuICogdmFsdWVzIHZpYSB0aGUgRVM2IE9ic2VydmFibGUgc3BlY2lmaWNhdGlvbiBmb3JcbiAqIGFzeW5jaHJvbm91cyB2YWx1ZSBzdHJlYW1pbmcgYnkgd2lyaW5nIHRoZSBTVE9NUFxuICogbWVzc2FnZXMgaW50byBhbiBvYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSB3aWxsIGxpa2UgdG8gcGFzcyB0aGUgY29uZmlndXJhdGlvbiBhcyBhIGRlcGVuZGVuY3ksXG4gKiBwbGVhc2UgdXNlIFN0b21wU2VydmljZSBjbGFzcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlNlcnZpY2UgZXh0ZW5kcyBSeFN0b21wIHtcbiAgLyoqXG4gICAqIFN0YXRlIG9mIHRoZSBTVE9NUFNlcnZpY2VcbiAgICpcbiAgICogSXQgaXMgYSBCZWhhdmlvclN1YmplY3QgYW5kIHdpbGwgZW1pdCBjdXJyZW50IHN0YXR1cyBpbW1lZGlhdGVseS4gVGhpcyB3aWxsIHR5cGljYWxseSBnZXRcbiAgICogdXNlZCB0byBzaG93IGN1cnJlbnQgc3RhdHVzIHRvIHRoZSBlbmQgdXNlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0ZTogQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+O1xuXG4gIHByaXZhdGUgc3RhdGljIF9tYXBTdG9tcFN0YXRlKHN0OiBSeFN0b21wU3RhdGUpOiBTdG9tcFN0YXRlIHtcbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DT05ORUNUSU5HKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5UUllJTkc7XG4gICAgfVxuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLk9QRU4pIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLkNPTk5FQ1RFRDtcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuQ0xPU0lORykge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuRElTQ09OTkVDVElORztcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuQ0xPU0VEKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5DTE9TRUQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgdHJpZ2dlciB3aGVuIGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQuIFVzZSB0aGlzIHRvIGNhcnJ5IG91dCBpbml0aWFsaXphdGlvbi5cbiAgICogSXQgd2lsbCB0cmlnZ2VyIGV2ZXJ5IHRpbWUgYSAocmUpY29ubmVjdGlvbiBvY2N1cnMuIElmIGl0IGlzIGFscmVhZHkgY29ubmVjdGVkXG4gICAqIGl0IHdpbGwgdHJpZ2dlciBpbW1lZGlhdGVseS4gWW91IGNhbiBzYWZlbHkgaWdub3JlIHRoZSB2YWx1ZSwgYXMgaXQgd2lsbCBhbHdheXMgYmVcbiAgICogU3RvbXBTdGF0ZS5DT05ORUNURURcbiAgICovXG4gIGdldCBjb25uZWN0T2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFN0b21wU3RhdGU+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0ZWQkLnBpcGUobWFwKChzdDogUnhTdG9tcFN0YXRlKTogU3RvbXBTdGF0ZSA9PiB7XG4gICAgICByZXR1cm4gU3RvbXBSU2VydmljZS5fbWFwU3RvbXBTdGF0ZShzdCk7XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGhlYWRlcnMgZnJvbSBtb3N0IHJlY2VudCBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgYXMgcmV0dXJuIGJ5IHRoZSBDT05ORUNURURcbiAgICogZnJhbWUuXG4gICAqIElmIHRoZSBTVE9NUCBjb25uZWN0aW9uIGhhcyBhbHJlYWR5IGJlZW4gZXN0YWJsaXNoZWQgaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LlxuICAgKiBJdCB3aWxsIGFkZGl0aW9uYWxseSB0cmlnZ2VyIGluIGV2ZW50IG9mIHJlY29ubmVjdGlvbiwgdGhlIHZhbHVlIHdpbGwgYmUgc2V0IG9mIGhlYWRlcnMgZnJvbVxuICAgKiB0aGUgcmVjZW50IHNlcnZlciByZXNwb25zZS5cbiAgICovXG4gIGdldCBzZXJ2ZXJIZWFkZXJzT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFN0b21wSGVhZGVycz4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlckhlYWRlcnMkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgbWVzc2FnZXMgdG8gdGhlIGRlZmF1bHQgcXVldWUgKGFueSBtZXNzYWdlIHRoYXQgYXJlIG5vdCBoYW5kbGVkIGJ5IGEgc3Vic2NyaXB0aW9uKVxuICAgKi9cbiAgZ2V0IGRlZmF1bHRNZXNzYWdlc09ic2VydmFibGUoKTogU3ViamVjdDxNZXNzYWdlPiB7XG4gICAgcmV0dXJuIHRoaXMudW5oYW5kbGVkTWVzc2FnZSQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCBlbWl0IGFsbCByZWNlaXB0c1xuICAgKi9cbiAgZ2V0IHJlY2VpcHRzT2JzZXJ2YWJsZSgpOiBTdWJqZWN0PEZyYW1lPiB7XG4gICAgcmV0dXJuIHRoaXMudW5oYW5kbGVkUmVjZWlwdHMkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgdHJpZ2dlciB3aGVuIGFuIGVycm9yIG9jY3Vycy4gVGhpcyBTdWJqZWN0IGNhbiBiZSB1c2VkIHRvIGhhbmRsZSBlcnJvcnMgZnJvbVxuICAgKiB0aGUgc3RvbXAgYnJva2VyLlxuICAgKi9cbiAgZ2V0IGVycm9yU3ViamVjdCgpOiBTdWJqZWN0PHN0cmluZyB8IEZyYW1lPiB7XG4gICAgcmV0dXJuIHRoaXMuc3RvbXBFcnJvcnMkO1xuICB9XG5cbiAgLyoqIFNldCBjb25maWd1cmF0aW9uICovXG4gIHNldCBjb25maWcoY29uZmlnOiBTdG9tcENvbmZpZykge1xuICAgIGNvbnN0IHJ4U3RvbXBDb25maWc6IFJ4U3RvbXBDb25maWcgPSB7IH07XG5cbiAgICBpZiAodHlwZW9mKGNvbmZpZy51cmwpID09PSAnc3RyaW5nJykge1xuICAgICAgcnhTdG9tcENvbmZpZy5icm9rZXJVUkwgPSBjb25maWcudXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByeFN0b21wQ29uZmlnLndlYlNvY2tldEZhY3RvcnkgPSBjb25maWcudXJsO1xuICAgIH1cblxuICAgIC8vIENvbmZpZ3VyZSBjbGllbnQgaGVhcnQtYmVhdGluZ1xuICAgIHJ4U3RvbXBDb25maWcuaGVhcnRiZWF0SW5jb21pbmcgPSBjb25maWcuaGVhcnRiZWF0X2luO1xuICAgIHJ4U3RvbXBDb25maWcuaGVhcnRiZWF0T3V0Z29pbmcgPSBjb25maWcuaGVhcnRiZWF0X291dDtcblxuICAgIC8vIEF1dG8gcmVjb25uZWN0XG4gICAgcnhTdG9tcENvbmZpZy5yZWNvbm5lY3REZWxheSA9IGNvbmZpZy5yZWNvbm5lY3RfZGVsYXk7XG5cbiAgICBpZiAoY29uZmlnLmRlYnVnKSB7XG4gICAgICByeFN0b21wQ29uZmlnLmRlYnVnID0gKHN0cjogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCksIHN0cik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJ4U3RvbXBDb25maWcuY29ubmVjdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIHRoaXMuY29uZmlndXJlKHJ4U3RvbXBDb25maWcpO1xuICB9XG4gIC8qKlxuICAgKiBJdCB3aWxsIGNvbm5lY3QgdG8gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBpbml0QW5kQ29ubmVjdCgpOiB2b2lkIHtcbiAgICAvLyBkaXNjb25uZWN0IGlmIGNvbm5lY3RlZFxuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuXG4gICAgLy8gQXR0ZW1wdCBjb25uZWN0aW9uLCBwYXNzaW5nIGluIGEgY2FsbGJhY2tcbiAgICB0aGlzLmFjdGl2YXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBkaXNjb25uZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgc2VuZCBhIG1lc3NhZ2UgdG8gYSBuYW1lZCBkZXN0aW5hdGlvbi4gVGhlIG1lc3NhZ2UgbXVzdCBiZSBgc3RyaW5nYC5cbiAgICpcbiAgICogVGhlIG1lc3NhZ2Ugd2lsbCBnZXQgbG9jYWxseSBxdWV1ZWQgaWYgdGhlIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLiBJdCB3aWxsIGF0dGVtcHQgdG9cbiAgICogcHVibGlzaCBxdWV1ZWQgbWVzc2FnZXMgYXMgc29vbiBhcyB0aGUgYnJva2VyIGdldHMgY29ubmVjdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcXVldWVOYW1lXG4gICAqIEBwYXJhbSBtZXNzYWdlXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChxdWV1ZU5hbWU6IHN0cmluZ3xwdWJsaXNoUGFyYW1zLCBtZXNzYWdlPzogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgcXVldWVOYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgc3VwZXIucHVibGlzaCh7ZGVzdGluYXRpb246IHF1ZXVlTmFtZSBhcyBzdHJpbmcsIGJvZHk6IG1lc3NhZ2UsIGhlYWRlcnN9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHViUGFyYW1zOiBwdWJsaXNoUGFyYW1zID0gcXVldWVOYW1lO1xuICAgICAgc3VwZXIucHVibGlzaChwdWJQYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHN1YnNjcmliZSB0byBzZXJ2ZXIgbWVzc2FnZSBxdWV1ZXNcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHNhZmVseSBjYWxsZWQgZXZlbiBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuXG4gICAqIElmIHRoZSB1bmRlcmx5aW5nIFNUT01QIGNvbm5lY3Rpb24gZHJvcHMgYW5kIHJlY29ubmVjdHMsIGl0IHdpbGwgcmVzdWJzY3JpYmUgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogSWYgYSBoZWFkZXIgZmllbGQgJ2FjaycgaXMgbm90IGV4cGxpY2l0bHkgcGFzc2VkLCAnYWNrJyB3aWxsIGJlIHNldCB0byAnYXV0bycuIElmIHlvdVxuICAgKiBkbyBub3QgdW5kZXJzdGFuZCB3aGF0IGl0IG1lYW5zLCBwbGVhc2UgbGVhdmUgaXQgYXMgaXMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB3aGVuIHdvcmtpbmcgd2l0aCB0ZW1wb3JhcnkgcXVldWVzIHdoZXJlIHRoZSBzdWJzY3JpcHRpb24gcmVxdWVzdFxuICAgKiBjcmVhdGVzIHRoZVxuICAgKiB1bmRlcmx5aW5nIHF1ZXVlLCBtc3NhZ2VzIG1pZ2h0IGJlIG1pc3NlZCBkdXJpbmcgcmVjb25uZWN0LiBUaGlzIGlzc3VlIGlzIG5vdCBzcGVjaWZpY1xuICAgKiB0byB0aGlzIGxpYnJhcnkgYnV0IHRoZSB3YXkgU1RPTVAgYnJva2VycyBhcmUgZGVzaWduZWQgdG8gd29yay5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHN1YnNjcmliZShxdWV1ZU5hbWU6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pOiBPYnNlcnZhYmxlPE1lc3NhZ2U+IHtcbiAgICByZXR1cm4gdGhpcy53YXRjaChxdWV1ZU5hbWUsIGhlYWRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNUT01QIGJyb2tlcnMgbWF5IGNhcnJ5IG91dCBvcGVyYXRpb24gYXN5bmNocm9ub3VzbHkgYW5kIGFsbG93IHJlcXVlc3RpbmcgZm9yIGFja25vd2xlZGdlbWVudC5cbiAgICogVG8gcmVxdWVzdCBhbiBhY2tub3dsZWRnZW1lbnQsIGEgYHJlY2VpcHRgIGhlYWRlciBuZWVkcyB0byBiZSBzZW50IHdpdGggdGhlIGFjdHVhbCByZXF1ZXN0LlxuICAgKiBUaGUgdmFsdWUgKHNheSByZWNlaXB0LWlkKSBmb3IgdGhpcyBoZWFkZXIgbmVlZHMgdG8gYmUgdW5pcXVlIGZvciBlYWNoIHVzZS4gVHlwaWNhbGx5IGEgc2VxdWVuY2UsIGEgVVVJRCwgYVxuICAgKiByYW5kb20gbnVtYmVyIG9yIGEgY29tYmluYXRpb24gbWF5IGJlIHVzZWQuXG4gICAqXG4gICAqIEEgY29tcGxhaW50IGJyb2tlciB3aWxsIHNlbmQgYSBSRUNFSVBUIGZyYW1lIHdoZW4gYW4gb3BlcmF0aW9uIGhhcyBhY3R1YWxseSBiZWVuIGNvbXBsZXRlZC5cbiAgICogVGhlIG9wZXJhdGlvbiBuZWVkcyB0byBiZSBtYXRjaGVkIGJhc2VkIGluIHRoZSB2YWx1ZSBvZiB0aGUgcmVjZWlwdC1pZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWxsb3cgd2F0Y2hpbmcgZm9yIGEgcmVjZWlwdCBhbmQgaW52b2tlIHRoZSBjYWxsYmFja1xuICAgKiB3aGVuIGNvcnJlc3BvbmRpbmcgcmVjZWlwdCBoYXMgYmVlbiByZWNlaXZlZC5cbiAgICpcbiAgICogVGhlIGFjdHVhbCB7QGxpbmsgaHR0cHM6Ly9zdG9tcC1qcy5naXRodWIuaW8vc3RvbXBqcy9jbGFzc2VzL0ZyYW1lLmh0bWx9XG4gICAqIHdpbGwgYmUgcGFzc2VkIGFzIHBhcmFtZXRlciB0byB0aGUgY2FsbGJhY2suXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogICAgICAgIC8vIFB1Ymxpc2hpbmcgd2l0aCBhY2tub3dsZWRnZW1lbnRcbiAgICogICAgICAgIGxldCByZWNlaXB0SWQgPSByYW5kb21UZXh0KCk7XG4gICAqXG4gICAqICAgICAgICByeFN0b21wLndhaXRGb3JSZWNlaXB0KHJlY2VpcHRJZCwgZnVuY3Rpb24oKSB7XG4gICAqICAgICAgICAgIC8vIFdpbGwgYmUgY2FsbGVkIGFmdGVyIHNlcnZlciBhY2tub3dsZWRnZXNcbiAgICogICAgICAgIH0pO1xuICAgKiAgICAgICAgcnhTdG9tcC5wdWJsaXNoKHtkZXN0aW5hdGlvbjogVEVTVC5kZXN0aW5hdGlvbiwgaGVhZGVyczoge3JlY2VpcHQ6IHJlY2VpcHRJZH0sIGJvZHk6IG1zZ30pO1xuICAgKiBgYGBcbiAgICpcbiAgICogTWFwcyB0bzogaHR0cHM6Ly9zdG9tcC1qcy5naXRodWIuaW8vc3RvbXBqcy9jbGFzc2VzL0NsaWVudC5odG1sI3dhdGNoRm9yUmVjZWlwdFxuICAgKi9cbiAgcHVibGljIHdhaXRGb3JSZWNlaXB0KHJlY2VpcHRJZDogc3RyaW5nLCBjYWxsYmFjazogKGZyYW1lOiBGcmFtZSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHN1cGVyLndhdGNoRm9yUmVjZWlwdChyZWNlaXB0SWQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGdldCBjbGllbnQoKTogQ2xpZW50IHtcbiAgICByZXR1cm4gdGhpcy5fc3RvbXBDbGllbnQ7XG4gIH1cblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+KFN0b21wU3RhdGUuQ0xPU0VEKTtcblxuICAgIHRoaXMuY29ubmVjdGlvblN0YXRlJC5zdWJzY3JpYmUoKHN0OiBSeFN0b21wU3RhdGUpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUubmV4dChTdG9tcFJTZXJ2aWNlLl9tYXBTdG9tcFN0YXRlKHN0KSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqICoqVGhpcyBjbGFzcyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIHtAbGluayBJbmplY3RhYmxlUnhTdG9tcENvbmZpZ30uXG4gKiBJdCB3aWxsIGJlIGRyb3BwZWQgYEBzdG9tcC9uZzItc3RvbXBqc0A4LngueGAuKipcbiAqXG4gKiBSZXByZXNlbnRzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZVxuICogU1RPTVBTZXJ2aWNlIHRvIGNvbm5lY3QgdG8uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcENvbmZpZyB7XG4gIC8qKlxuICAgKiBTZXJ2ZXIgVVJMIHRvIGNvbm5lY3QgdG8uIFBsZWFzZSByZWZlciB0byB5b3VyIFNUT01QIGJyb2tlciBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzLlxuICAgKlxuICAgKiBFeGFtcGxlOiB3czovLzEyNy4wLjAuMToxNTY3NC93cyAoZm9yIGEgUmFiYml0TVEgZGVmYXVsdCBzZXR1cCBydW5uaW5nIG9uIGxvY2FsaG9zdClcbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSB0aGlzIHBhcmFtZXRlciBjYW4gYmUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gb2JqZWN0IHNpbWlsYXIgdG8gV2ViU29ja2V0XG4gICAqICh0eXBpY2FsbHkgU29ja0pTIGluc3RhbmNlKS5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICpcbiAgICogKCkgPT4ge1xuICAgKiAgIHJldHVybiBuZXcgU29ja0pTKCdodHRwOi8vMTI3LjAuMC4xOjE1Njc0L3N0b21wJyk7XG4gICAqIH1cbiAgICovXG4gIHVybDogc3RyaW5nIHwgKCgpID0+IGFueSk7XG5cbiAgLyoqXG4gICAqIEhlYWRlcnNcbiAgICogVHlwaWNhbCBrZXlzOiBsb2dpbjogc3RyaW5nLCBwYXNzY29kZTogc3RyaW5nLlxuICAgKiBob3N0OnN0cmluZyB3aWxsIG5lZWVkIHRvIGJlIHBhc3NlZCBmb3IgdmlydHVhbCBob3N0cyBpbiBSYWJiaXRNUVxuICAgKi9cbiAgaGVhZGVyczogU3RvbXBIZWFkZXJzO1xuXG4gIC8qKiBIb3cgb2Z0ZW4gdG8gaW5jb21pbmcgaGVhcnRiZWF0P1xuICAgKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMsIHNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSAwIC0gZGlzYWJsZWRcbiAgICovXG4gIGhlYXJ0YmVhdF9pbjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIb3cgb2Z0ZW4gdG8gb3V0Z29pbmcgaGVhcnRiZWF0P1xuICAgKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMsIHNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSAyMDAwMCAtIGV2ZXJ5IDIwIHNlY29uZHNcbiAgICovXG4gIGhlYXJ0YmVhdF9vdXQ6IG51bWJlcjtcblxuICAvKipcbiAgICogV2FpdCBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIGF0dGVtcHRpbmcgYXV0byByZWNvbm5lY3RcbiAgICogU2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDUwMDAgKDUgc2Vjb25kcylcbiAgICovXG4gIHJlY29ubmVjdF9kZWxheTogbnVtYmVyO1xuXG4gIC8qKiBFbmFibGUgY2xpZW50IGRlYnVnZ2luZz8gKi9cbiAgZGVidWc6IGJvb2xlYW47XG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFN0b21wQ29uZmlnIH0gZnJvbSAnLi9zdG9tcC5jb25maWcnO1xuXG5pbXBvcnQgeyBTdG9tcFJTZXJ2aWNlIH0gZnJvbSAnLi9zdG9tcC1yLnNlcnZpY2UnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogKipUaGlzIGNsYXNzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2Yge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfSB3aXRoIHtAbGluayByeFN0b21wU2VydmljZUZhY3Rvcnl9LlxuICogSXQgd2lsbCBiZSBkcm9wcGVkIGBAc3RvbXAvbmcyLXN0b21wanNAOC54LnhgLioqXG4gKlxuICogQW5ndWxhcjIgU1RPTVAgU2VydmljZSB1c2luZyBAc3RvbXAvc3RvbXAuanNcbiAqXG4gKiBAZGVzY3JpcHRpb24gVGhpcyBzZXJ2aWNlIGhhbmRsZXMgc3Vic2NyaWJpbmcgdG8gYVxuICogbWVzc2FnZSBxdWV1ZSB1c2luZyB0aGUgc3RvbXAuanMgbGlicmFyeSwgYW5kIHJldHVybnNcbiAqIHZhbHVlcyB2aWEgdGhlIEVTNiBPYnNlcnZhYmxlIHNwZWNpZmljYXRpb24gZm9yXG4gKiBhc3luY2hyb25vdXMgdmFsdWUgc3RyZWFtaW5nIGJ5IHdpcmluZyB0aGUgU1RPTVBcbiAqIG1lc3NhZ2VzIGludG8gYW4gb2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byBtYW51YWxseSBjb25maWd1cmUgYW5kIGluaXRpYWxpemUgdGhlIHNlcnZpY2VcbiAqIHBsZWFzZSB1c2UgU3RvbXBSU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBTZXJ2aWNlIGV4dGVuZHMgU3RvbXBSU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIFNlZSBSRUFETUUgYW5kIHNhbXBsZXMgZm9yIGNvbmZpZ3VyYXRpb24gZXhhbXBsZXNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuaW5pdEFuZENvbm5lY3QoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUnhTdG9tcCB9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcH0gd2l0aCBleGFjdGx5IHNhbWUgZnVuY3Rpb25hbGl0eS5cbiAqIFBsZWFzZSBzZWUge0BsaW5rIFJ4U3RvbXB9IGZvciBkZXRhaWxzLlxuICpcbiAqIFNlZToge0BsaW5rIC9ndWlkZS9uZzItc3RvbXBqcy8yMDE4LzExLzA0L25nMi1zdG9tcC13aXRoLWFuZ3VsYXI3Lmh0bWx9XG4gKiBmb3IgYSBzdGVwLWJ5LXN0ZXAgZ3VpZGUuXG4gKlxuICogU2VlIGFsc28ge0BsaW5rIHJ4U3RvbXBTZXJ2aWNlRmFjdG9yeX0uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSeFN0b21wU2VydmljZSBleHRlbmRzIFJ4U3RvbXAgeyB9XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSeFN0b21wUlBDQ29uZmlnfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogSW5qZWN0YWJsZSB2ZXJzaW9uIG9mIHtAbGluayBSeFN0b21wUlBDQ29uZmlnfS5cbiAqXG4gKiBTZWUgZ3VpZGUgYXQge0BsaW5rIC9ndWlkZS9yeC1zdG9tcC9uZzItc3RvbXBqcy8yMDE4LzEwLzEyL3JlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sfVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSW5qZWN0YWJsZVJ4U3RvbXBScGNDb25maWcgZXh0ZW5kcyBSeFN0b21wUlBDQ29uZmlnIHsgfVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7UnhTdG9tcFJQQ30gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcbmltcG9ydCB7UnhTdG9tcFNlcnZpY2V9IGZyb20gJy4vcngtc3RvbXAuc2VydmljZSc7XG5pbXBvcnQge0luamVjdGFibGVSeFN0b21wUnBjQ29uZmlnfSBmcm9tICcuL2luamVjdGFibGUtcngtc3RvbXAtcnBjLWNvbmZpZyc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiBJbmplY3RhYmxlIHZlcnNpb24gb2Yge0BsaW5rIFJ4U3RvbXBSUEN9LlxuICpcbiAqIFNlZSBndWlkZSBhdCB7QGxpbmsgL2d1aWRlL3J4LXN0b21wL25nMi1zdG9tcGpzLzIwMTgvMTAvMTIvcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWx9XG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSeFN0b21wUlBDU2VydmljZSBleHRlbmRzIFJ4U3RvbXBSUEMge1xuICBjb25zdHJ1Y3RvcihyeFN0b21wOiBSeFN0b21wU2VydmljZSwgQE9wdGlvbmFsKCkgc3RvbXBSUENDb25maWc/OiBJbmplY3RhYmxlUnhTdG9tcFJwY0NvbmZpZykge1xuICAgIHN1cGVyKHJ4U3RvbXAsIHN0b21wUlBDQ29uZmlnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UnhTdG9tcENvbmZpZ30gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIFRoaXMgY2xhc3MgaXMgSW5qZWN0YWJsZSB2ZXJzaW9uIG9mIHtAbGluayBSeFN0b21wQ29uZmlnfSB3aXRoIGV4YWN0bHkgc2FtZSBmdW5jdGlvbmFsaXR5LlxuICogUGxlYXNlIHNlZSB7QGxpbmsgUnhTdG9tcENvbmZpZ30gZm9yIGRldGFpbHMuXG4gKlxuICogU2VlOiB7QGxpbmsgL2d1aWRlL25nMi1zdG9tcGpzLzIwMTgvMTEvMDQvbmcyLXN0b21wLXdpdGgtYW5ndWxhcjcuaHRtbH1cbiAqIGZvciBhIHN0ZXAtYnktc3RlcCBndWlkZS5cbiAqXG4gKiBJZiBhbGwgZmllbGRzIG9mIGNvbmZpZ3VyYXRpb24gYXJlIGZpeGVkIGFuZCBrbm93biBpbiBhZHZhbmNlIHlvdSB3b3VsZCB0eXBpY2FsbHkgZGVmaW5lXG4gKiBhIGBjb25zdGAgYW5kIGluamVjdCBpdCB1c2luZyB2YWx1ZS5cbiAqXG4gKiBJZiBzb21lIGZpZWxkcyB3aWxsIGJlIGtub3duIGJ5IGxhdGVyLCBpdCBjYW4gYmUgaW5qZWN0ZWQgdXNpbmcgYSBmYWN0b3J5IGZ1bmN0aW9uLlxuICpcbiAqIE9jY2FzaW9uYWxseSBpdCBtYXkgbmVlZCB0byBiZSBjb21iaW5lZCB3aXRoIEFuZ3VsYXIncyBBUFBfSU5JVElBTElaRVIgbWVjaGFuaXNtLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSW5qZWN0YWJsZVJ4U3RvbXBDb25maWcgZXh0ZW5kcyBSeFN0b21wQ29uZmlnIHsgfVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlUnhTdG9tcENvbmZpZ30gZnJvbSAnLi9pbmplY3RhYmxlLXJ4LXN0b21wLWNvbmZpZyc7XG5pbXBvcnQge1J4U3RvbXBTZXJ2aWNlfSBmcm9tICcuL3J4LXN0b21wLnNlcnZpY2UnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogVGhpcyBpcyBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgY2FuIGNyZWF0ZSB7QGxpbmsgUnhTdG9tcFNlcnZpY2V9XG4gKiB3aGVuIGNvbmZpZ3VyYXRpb24gaXMgYWxyZWFkeSBrbm93bi5cbiAqIFlvdSBjYW4gdXNlIHRoaXMgZnVuY3Rpb24gZm9yIGRlZmluaW5nIHByb3ZpZGVyIGZvciB7QGxpbmsgUnhTdG9tcFNlcnZpY2V9LlxuICoge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfSBjcmVhdGVkIHVzaW5nIHRoaXMgZnVuY3Rpb24gaXMgY29uZmlndXJlZCBhbmQgYWN0aXZhdGVkLlxuICogVGhpcyBwcm92aWRlcyB0aGUgc2ltcGxlc3QgbWVjaGFuaXNtIHRvIGRlZmluZSB7QGxpbmsgUnhTdG9tcFNlcnZpY2V9IGZvciBEZXBlbmRlbmN5IEluamVjdGlvbi5cbiAqXG4gKiBTZWU6IHtAbGluayAvZ3VpZGUvbmcyLXN0b21wanMvMjAxOC8xMS8wNC9uZzItc3RvbXAtd2l0aC1hbmd1bGFyNy5odG1sfVxuICogZm9yIGEgc3RlcC1ieS1zdGVwIGd1aWRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcnhTdG9tcFNlcnZpY2VGYWN0b3J5KHJ4U3RvbXBDb25maWc6IEluamVjdGFibGVSeFN0b21wQ29uZmlnKTogUnhTdG9tcFNlcnZpY2Uge1xuICBjb25zdCByeFN0b21wU2VydmljZSA9IG5ldyBSeFN0b21wU2VydmljZSgpO1xuXG4gIHJ4U3RvbXBTZXJ2aWNlLmNvbmZpZ3VyZShyeFN0b21wQ29uZmlnKTtcbiAgcnhTdG9tcFNlcnZpY2UuYWN0aXZhdGUoKTtcblxuICByZXR1cm4gcnhTdG9tcFNlcnZpY2U7XG59XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX2V4dGVuZHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWdDbUNBLGlDQUFPOztvQkErTHRDLGlCQUFPO1FBRVAsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBYSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFaEUsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxVQUFDLEVBQWdCO1lBQy9DLEtB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