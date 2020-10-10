import { __extends } from 'tslib';
import { Injectable, Optional } from '@angular/core';
import { RxStomp, RxStompState, RxStompRPCConfig, RxStompRPC, RxStompConfig } from '@stomp/rx-stomp';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
export { StompHeaders } from '@stomp/stompjs';

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
        if (headers === void 0) { headers = {}; }
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
var InjectableRxStompRPCConfig = /** @class */ (function (_super) {
    __extends(InjectableRxStompRPCConfig, _super);
    function InjectableRxStompRPCConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InjectableRxStompRPCConfig.decorators = [
        { type: Injectable }
    ];
    return InjectableRxStompRPCConfig;
}(RxStompRPCConfig));
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
        { type: InjectableRxStompRPCConfig, decorators: [{ type: Optional },] },
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

export { StompRService, StompService, StompState, StompConfig, RxStompRPCService, RxStompService, InjectableRxStompConfig, InjectableRxStompRPCConfig, InjectableRxStompRpcConfig, rxStompServiceFactory };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtbmcyLXN0b21wanMuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvYXBwL2NvbXBhdGliaWxpdHkvc3RvbXAtci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL2FwcC9jb21wYXRpYmlsaXR5L3N0b21wLmNvbmZpZy50cyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9hcHAvY29tcGF0aWJpbGl0eS9zdG9tcC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL2FwcC9yeC1zdG9tcC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL2FwcC9pbmplY3RhYmxlLXJ4LXN0b21wLXJwYy1jb25maWcudHMiLCJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy9zcmMvYXBwL3J4LXN0b21wLXJwYy5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvc3JjL2FwcC9pbmplY3RhYmxlLXJ4LXN0b21wLWNvbmZpZy50cyIsIm5nOi8vQHN0b21wL25nMi1zdG9tcGpzL3NyYy9hcHAvcngtc3RvbXAtc2VydmljZS1mYWN0b3J5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgUnhTdG9tcCwgUnhTdG9tcENvbmZpZywgUnhTdG9tcFN0YXRlIH0gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcblxuaW1wb3J0IHsgcHVibGlzaFBhcmFtcywgQ2xpZW50LCBNZXNzYWdlLCBGcmFtZSB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcblxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFN0b21wU3RhdGUgfSBmcm9tICcuL3N0b21wLXN0YXRlJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJy4vc3RvbXAtaGVhZGVycyc7XG5pbXBvcnQgeyBTdG9tcENvbmZpZyB9IGZyb20gJy4vc3RvbXAuY29uZmlnJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqICoqVGhpcyBjbGFzcyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIHtAbGluayBSeFN0b21wU2VydmljZX0uXG4gKiBJdCB3aWxsIGJlIGRyb3BwZWQgYEBzdG9tcC9uZzItc3RvbXBqc0A4LngueGAuKipcbiAqXG4gKiBBbmd1bGFyMiBTVE9NUCBSYXcgU2VydmljZSB1c2luZyBAc3RvbXAvc3RvbXAuanNcbiAqXG4gKiBZb3Ugd2lsbCBvbmx5IG5lZWQgdGhlIHB1YmxpYyBwcm9wZXJ0aWVzIGFuZFxuICogbWV0aG9kcyBsaXN0ZWQgdW5sZXNzIHlvdSBhcmUgYW4gYWR2YW5jZWQgdXNlci4gVGhpcyBzZXJ2aWNlIGhhbmRsZXMgc3Vic2NyaWJpbmcgdG8gYVxuICogbWVzc2FnZSBxdWV1ZSB1c2luZyB0aGUgc3RvbXAuanMgbGlicmFyeSwgYW5kIHJldHVybnNcbiAqIHZhbHVlcyB2aWEgdGhlIEVTNiBPYnNlcnZhYmxlIHNwZWNpZmljYXRpb24gZm9yXG4gKiBhc3luY2hyb25vdXMgdmFsdWUgc3RyZWFtaW5nIGJ5IHdpcmluZyB0aGUgU1RPTVBcbiAqIG1lc3NhZ2VzIGludG8gYW4gb2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3Ugd2lsbCBsaWtlIHRvIHBhc3MgdGhlIGNvbmZpZ3VyYXRpb24gYXMgYSBkZXBlbmRlbmN5LFxuICogcGxlYXNlIHVzZSBTdG9tcFNlcnZpY2UgY2xhc3MuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFJTZXJ2aWNlIGV4dGVuZHMgUnhTdG9tcCB7XG4gIC8qKlxuICAgKiBTdGF0ZSBvZiB0aGUgU1RPTVBTZXJ2aWNlXG4gICAqXG4gICAqIEl0IGlzIGEgQmVoYXZpb3JTdWJqZWN0IGFuZCB3aWxsIGVtaXQgY3VycmVudCBzdGF0dXMgaW1tZWRpYXRlbHkuIFRoaXMgd2lsbCB0eXBpY2FsbHkgZ2V0XG4gICAqIHVzZWQgdG8gc2hvdyBjdXJyZW50IHN0YXR1cyB0byB0aGUgZW5kIHVzZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGU6IEJlaGF2aW9yU3ViamVjdDxTdG9tcFN0YXRlPjtcblxuICBwcml2YXRlIHN0YXRpYyBfbWFwU3RvbXBTdGF0ZShzdDogUnhTdG9tcFN0YXRlKTogU3RvbXBTdGF0ZSB7XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuQ09OTkVDVElORykge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuVFJZSU5HO1xuICAgIH1cbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5PUEVOKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5DT05ORUNURUQ7XG4gICAgfVxuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLkNMT1NJTkcpIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLkRJU0NPTk5FQ1RJTkc7XG4gICAgfVxuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLkNMT1NFRCkge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuQ0xPU0VEO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIHRyaWdnZXIgd2hlbiBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLiBVc2UgdGhpcyB0byBjYXJyeSBvdXQgaW5pdGlhbGl6YXRpb24uXG4gICAqIEl0IHdpbGwgdHJpZ2dlciBldmVyeSB0aW1lIGEgKHJlKWNvbm5lY3Rpb24gb2NjdXJzLiBJZiBpdCBpcyBhbHJlYWR5IGNvbm5lY3RlZFxuICAgKiBpdCB3aWxsIHRyaWdnZXIgaW1tZWRpYXRlbHkuIFlvdSBjYW4gc2FmZWx5IGlnbm9yZSB0aGUgdmFsdWUsIGFzIGl0IHdpbGwgYWx3YXlzIGJlXG4gICAqIFN0b21wU3RhdGUuQ09OTkVDVEVEXG4gICAqL1xuICBnZXQgY29ubmVjdE9ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxTdG9tcFN0YXRlPiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGVkJC5waXBlKFxuICAgICAgbWFwKFxuICAgICAgICAoc3Q6IFJ4U3RvbXBTdGF0ZSk6IFN0b21wU3RhdGUgPT4ge1xuICAgICAgICAgIHJldHVybiBTdG9tcFJTZXJ2aWNlLl9tYXBTdG9tcFN0YXRlKHN0KTtcbiAgICAgICAgfVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgaGVhZGVycyBmcm9tIG1vc3QgcmVjZW50IGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBhcyByZXR1cm4gYnkgdGhlIENPTk5FQ1RFRFxuICAgKiBmcmFtZS5cbiAgICogSWYgdGhlIFNUT01QIGNvbm5lY3Rpb24gaGFzIGFscmVhZHkgYmVlbiBlc3RhYmxpc2hlZCBpdCB3aWxsIHRyaWdnZXIgaW1tZWRpYXRlbHkuXG4gICAqIEl0IHdpbGwgYWRkaXRpb25hbGx5IHRyaWdnZXIgaW4gZXZlbnQgb2YgcmVjb25uZWN0aW9uLCB0aGUgdmFsdWUgd2lsbCBiZSBzZXQgb2YgaGVhZGVycyBmcm9tXG4gICAqIHRoZSByZWNlbnQgc2VydmVyIHJlc3BvbnNlLlxuICAgKi9cbiAgZ2V0IHNlcnZlckhlYWRlcnNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8U3RvbXBIZWFkZXJzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVySGVhZGVycyQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCBlbWl0IGFsbCBtZXNzYWdlcyB0byB0aGUgZGVmYXVsdCBxdWV1ZSAoYW55IG1lc3NhZ2UgdGhhdCBhcmUgbm90IGhhbmRsZWQgYnkgYSBzdWJzY3JpcHRpb24pXG4gICAqL1xuICBnZXQgZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZSgpOiBTdWJqZWN0PE1lc3NhZ2U+IHtcbiAgICByZXR1cm4gdGhpcy51bmhhbmRsZWRNZXNzYWdlJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIHJlY2VpcHRzXG4gICAqL1xuICBnZXQgcmVjZWlwdHNPYnNlcnZhYmxlKCk6IFN1YmplY3Q8RnJhbWU+IHtcbiAgICByZXR1cm4gdGhpcy51bmhhbmRsZWRSZWNlaXB0cyQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gYW4gZXJyb3Igb2NjdXJzLiBUaGlzIFN1YmplY3QgY2FuIGJlIHVzZWQgdG8gaGFuZGxlIGVycm9ycyBmcm9tXG4gICAqIHRoZSBzdG9tcCBicm9rZXIuXG4gICAqL1xuICBnZXQgZXJyb3JTdWJqZWN0KCk6IFN1YmplY3Q8c3RyaW5nIHwgRnJhbWU+IHtcbiAgICByZXR1cm4gdGhpcy5zdG9tcEVycm9ycyQ7XG4gIH1cblxuICAvKiogU2V0IGNvbmZpZ3VyYXRpb24gKi9cbiAgc2V0IGNvbmZpZyhjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgY29uc3QgcnhTdG9tcENvbmZpZzogUnhTdG9tcENvbmZpZyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBjb25maWcudXJsID09PSAnc3RyaW5nJykge1xuICAgICAgcnhTdG9tcENvbmZpZy5icm9rZXJVUkwgPSBjb25maWcudXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByeFN0b21wQ29uZmlnLndlYlNvY2tldEZhY3RvcnkgPSBjb25maWcudXJsO1xuICAgIH1cblxuICAgIC8vIENvbmZpZ3VyZSBjbGllbnQgaGVhcnQtYmVhdGluZ1xuICAgIHJ4U3RvbXBDb25maWcuaGVhcnRiZWF0SW5jb21pbmcgPSBjb25maWcuaGVhcnRiZWF0X2luO1xuICAgIHJ4U3RvbXBDb25maWcuaGVhcnRiZWF0T3V0Z29pbmcgPSBjb25maWcuaGVhcnRiZWF0X291dDtcblxuICAgIC8vIEF1dG8gcmVjb25uZWN0XG4gICAgcnhTdG9tcENvbmZpZy5yZWNvbm5lY3REZWxheSA9IGNvbmZpZy5yZWNvbm5lY3RfZGVsYXk7XG5cbiAgICBpZiAoY29uZmlnLmRlYnVnKSB7XG4gICAgICByeFN0b21wQ29uZmlnLmRlYnVnID0gKHN0cjogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCksIHN0cik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJ4U3RvbXBDb25maWcuY29ubmVjdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIHRoaXMuY29uZmlndXJlKHJ4U3RvbXBDb25maWcpO1xuICB9XG4gIC8qKlxuICAgKiBJdCB3aWxsIGNvbm5lY3QgdG8gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBpbml0QW5kQ29ubmVjdCgpOiB2b2lkIHtcbiAgICAvLyBkaXNjb25uZWN0IGlmIGNvbm5lY3RlZFxuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuXG4gICAgLy8gQXR0ZW1wdCBjb25uZWN0aW9uLCBwYXNzaW5nIGluIGEgY2FsbGJhY2tcbiAgICB0aGlzLmFjdGl2YXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBkaXNjb25uZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgc2VuZCBhIG1lc3NhZ2UgdG8gYSBuYW1lZCBkZXN0aW5hdGlvbi4gVGhlIG1lc3NhZ2UgbXVzdCBiZSBgc3RyaW5nYC5cbiAgICpcbiAgICogVGhlIG1lc3NhZ2Ugd2lsbCBnZXQgbG9jYWxseSBxdWV1ZWQgaWYgdGhlIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLiBJdCB3aWxsIGF0dGVtcHQgdG9cbiAgICogcHVibGlzaCBxdWV1ZWQgbWVzc2FnZXMgYXMgc29vbiBhcyB0aGUgYnJva2VyIGdldHMgY29ubmVjdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcXVldWVOYW1lXG4gICAqIEBwYXJhbSBtZXNzYWdlXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChcbiAgICBxdWV1ZU5hbWU6IHN0cmluZyB8IHB1Ymxpc2hQYXJhbXMsXG4gICAgbWVzc2FnZT86IHN0cmluZyxcbiAgICBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fVxuICApOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHF1ZXVlTmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN1cGVyLnB1Ymxpc2goe1xuICAgICAgICBkZXN0aW5hdGlvbjogcXVldWVOYW1lIGFzIHN0cmluZyxcbiAgICAgICAgYm9keTogbWVzc2FnZSxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwdWJQYXJhbXM6IHB1Ymxpc2hQYXJhbXMgPSBxdWV1ZU5hbWU7XG4gICAgICBzdXBlci5wdWJsaXNoKHB1YlBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgc3Vic2NyaWJlIHRvIHNlcnZlciBtZXNzYWdlIHF1ZXVlc1xuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgc2FmZWx5IGNhbGxlZCBldmVuIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC5cbiAgICogSWYgdGhlIHVuZGVybHlpbmcgU1RPTVAgY29ubmVjdGlvbiBkcm9wcyBhbmQgcmVjb25uZWN0cywgaXQgd2lsbCByZXN1YnNjcmliZSBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBJZiBhIGhlYWRlciBmaWVsZCAnYWNrJyBpcyBub3QgZXhwbGljaXRseSBwYXNzZWQsICdhY2snIHdpbGwgYmUgc2V0IHRvICdhdXRvJy4gSWYgeW91XG4gICAqIGRvIG5vdCB1bmRlcnN0YW5kIHdoYXQgaXQgbWVhbnMsIHBsZWFzZSBsZWF2ZSBpdCBhcyBpcy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHdoZW4gd29ya2luZyB3aXRoIHRlbXBvcmFyeSBxdWV1ZXMgd2hlcmUgdGhlIHN1YnNjcmlwdGlvbiByZXF1ZXN0XG4gICAqIGNyZWF0ZXMgdGhlXG4gICAqIHVuZGVybHlpbmcgcXVldWUsIG1lc3NhZ2VzIG1pZ2h0IGJlIG1pc3NlZCBkdXJpbmcgcmVjb25uZWN0LiBUaGlzIGlzc3VlIGlzIG5vdCBzcGVjaWZpY1xuICAgKiB0byB0aGlzIGxpYnJhcnkgYnV0IHRoZSB3YXkgU1RPTVAgYnJva2VycyBhcmUgZGVzaWduZWQgdG8gd29yay5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHN1YnNjcmliZShcbiAgICBxdWV1ZU5hbWU6IHN0cmluZyxcbiAgICBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fVxuICApOiBPYnNlcnZhYmxlPE1lc3NhZ2U+IHtcbiAgICByZXR1cm4gdGhpcy53YXRjaChxdWV1ZU5hbWUsIGhlYWRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNUT01QIGJyb2tlcnMgbWF5IGNhcnJ5IG91dCBvcGVyYXRpb24gYXN5bmNocm9ub3VzbHkgYW5kIGFsbG93IHJlcXVlc3RpbmcgZm9yIGFja25vd2xlZGdlbWVudC5cbiAgICogVG8gcmVxdWVzdCBhbiBhY2tub3dsZWRnZW1lbnQsIGEgYHJlY2VpcHRgIGhlYWRlciBuZWVkcyB0byBiZSBzZW50IHdpdGggdGhlIGFjdHVhbCByZXF1ZXN0LlxuICAgKiBUaGUgdmFsdWUgKHNheSByZWNlaXB0LWlkKSBmb3IgdGhpcyBoZWFkZXIgbmVlZHMgdG8gYmUgdW5pcXVlIGZvciBlYWNoIHVzZS4gVHlwaWNhbGx5IGEgc2VxdWVuY2UsIGEgVVVJRCwgYVxuICAgKiByYW5kb20gbnVtYmVyIG9yIGEgY29tYmluYXRpb24gbWF5IGJlIHVzZWQuXG4gICAqXG4gICAqIEEgY29tcGxhaW50IGJyb2tlciB3aWxsIHNlbmQgYSBSRUNFSVBUIGZyYW1lIHdoZW4gYW4gb3BlcmF0aW9uIGhhcyBhY3R1YWxseSBiZWVuIGNvbXBsZXRlZC5cbiAgICogVGhlIG9wZXJhdGlvbiBuZWVkcyB0byBiZSBtYXRjaGVkIGJhc2VkIGluIHRoZSB2YWx1ZSBvZiB0aGUgcmVjZWlwdC1pZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWxsb3cgd2F0Y2hpbmcgZm9yIGEgcmVjZWlwdCBhbmQgaW52b2tlIHRoZSBjYWxsYmFja1xuICAgKiB3aGVuIGNvcnJlc3BvbmRpbmcgcmVjZWlwdCBoYXMgYmVlbiByZWNlaXZlZC5cbiAgICpcbiAgICogVGhlIGFjdHVhbCB7QGxpbmsgRnJhbWV9XG4gICAqIHdpbGwgYmUgcGFzc2VkIGFzIHBhcmFtZXRlciB0byB0aGUgY2FsbGJhY2suXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogICAgICAgIC8vIFB1Ymxpc2hpbmcgd2l0aCBhY2tub3dsZWRnZW1lbnRcbiAgICogICAgICAgIGxldCByZWNlaXB0SWQgPSByYW5kb21UZXh0KCk7XG4gICAqXG4gICAqICAgICAgICByeFN0b21wLndhaXRGb3JSZWNlaXB0KHJlY2VpcHRJZCwgZnVuY3Rpb24oKSB7XG4gICAqICAgICAgICAgIC8vIFdpbGwgYmUgY2FsbGVkIGFmdGVyIHNlcnZlciBhY2tub3dsZWRnZXNcbiAgICogICAgICAgIH0pO1xuICAgKiAgICAgICAgcnhTdG9tcC5wdWJsaXNoKHtkZXN0aW5hdGlvbjogVEVTVC5kZXN0aW5hdGlvbiwgaGVhZGVyczoge3JlY2VpcHQ6IHJlY2VpcHRJZH0sIGJvZHk6IG1zZ30pO1xuICAgKiBgYGBcbiAgICpcbiAgICogTWFwcyB0bzogW0NsaWVudCN3YXRjaEZvclJlY2VpcHRde0BsaW5rIENsaWVudCN3YXRjaEZvclJlY2VpcHR9XG4gICAqL1xuICBwdWJsaWMgd2FpdEZvclJlY2VpcHQoXG4gICAgcmVjZWlwdElkOiBzdHJpbmcsXG4gICAgY2FsbGJhY2s6IChmcmFtZTogRnJhbWUpID0+IHZvaWRcbiAgKTogdm9pZCB7XG4gICAgc3VwZXIud2F0Y2hGb3JSZWNlaXB0KHJlY2VpcHRJZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZ2V0IGNsaWVudCgpOiBDbGllbnQge1xuICAgIHJldHVybiB0aGlzLl9zdG9tcENsaWVudDtcbiAgfVxuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U3RvbXBTdGF0ZT4oU3RvbXBTdGF0ZS5DTE9TRUQpO1xuXG4gICAgdGhpcy5jb25uZWN0aW9uU3RhdGUkLnN1YnNjcmliZSgoc3Q6IFJ4U3RvbXBTdGF0ZSkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wUlNlcnZpY2UuX21hcFN0b21wU3RhdGUoc3QpKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3RvbXBIZWFkZXJzIH0gZnJvbSAnQHN0b21wL3N0b21wanMnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogKipUaGlzIGNsYXNzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2Yge0BsaW5rIEluamVjdGFibGVSeFN0b21wQ29uZmlnfS5cbiAqIEl0IHdpbGwgYmUgZHJvcHBlZCBgQHN0b21wL25nMi1zdG9tcGpzQDgueC54YC4qKlxuICpcbiAqIFJlcHJlc2VudHMgYSBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlXG4gKiBTVE9NUFNlcnZpY2UgdG8gY29ubmVjdCB0by5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNlcnZlciBVUkwgdG8gY29ubmVjdCB0by4gUGxlYXNlIHJlZmVyIHRvIHlvdXIgU1RPTVAgYnJva2VyIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMuXG4gICAqXG4gICAqIEV4YW1wbGU6IHdzOi8vMTI3LjAuMC4xOjE1Njc0L3dzIChmb3IgYSBSYWJiaXRNUSBkZWZhdWx0IHNldHVwIHJ1bm5pbmcgb24gbG9jYWxob3N0KVxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5IHRoaXMgcGFyYW1ldGVyIGNhbiBiZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYmplY3Qgc2ltaWxhciB0byBXZWJTb2NrZXRcbiAgICogKHR5cGljYWxseSBTb2NrSlMgaW5zdGFuY2UpLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKlxuICAgKiAoKSA9PiB7XG4gICAqICAgcmV0dXJuIG5ldyBTb2NrSlMoJ2h0dHA6Ly8xMjcuMC4wLjE6MTU2NzQvc3RvbXAnKTtcbiAgICogfVxuICAgKi9cbiAgdXJsOiBzdHJpbmcgfCAoKCkgPT4gYW55KTtcblxuICAvKipcbiAgICogSGVhZGVyc1xuICAgKiBUeXBpY2FsIGtleXM6IGxvZ2luOiBzdHJpbmcsIHBhc3Njb2RlOiBzdHJpbmcuXG4gICAqIGhvc3Q6c3RyaW5nIHdpbGwgbmVlZWQgdG8gYmUgcGFzc2VkIGZvciB2aXJ0dWFsIGhvc3RzIGluIFJhYmJpdE1RXG4gICAqL1xuICBoZWFkZXJzOiBTdG9tcEhlYWRlcnM7XG5cbiAgLyoqIEhvdyBvZnRlbiB0byBpbmNvbWluZyBoZWFydGJlYXQ/XG4gICAqIEludGVydmFsIGluIG1pbGxpc2Vjb25kcywgc2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDAgLSBkaXNhYmxlZFxuICAgKi9cbiAgaGVhcnRiZWF0X2luOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhvdyBvZnRlbiB0byBvdXRnb2luZyBoZWFydGJlYXQ/XG4gICAqIEludGVydmFsIGluIG1pbGxpc2Vjb25kcywgc2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDIwMDAwIC0gZXZlcnkgMjAgc2Vjb25kc1xuICAgKi9cbiAgaGVhcnRiZWF0X291dDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXYWl0IGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgYXR0ZW1wdGluZyBhdXRvIHJlY29ubmVjdFxuICAgKiBTZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgNTAwMCAoNSBzZWNvbmRzKVxuICAgKi9cbiAgcmVjb25uZWN0X2RlbGF5OiBudW1iZXI7XG5cbiAgLyoqIEVuYWJsZSBjbGllbnQgZGVidWdnaW5nPyAqL1xuICBkZWJ1ZzogYm9vbGVhbjtcbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU3RvbXBDb25maWcgfSBmcm9tICcuL3N0b21wLmNvbmZpZyc7XG5cbmltcG9ydCB7IFN0b21wUlNlcnZpY2UgfSBmcm9tICcuL3N0b21wLXIuc2VydmljZSc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiAqKlRoaXMgY2xhc3MgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiB7QGxpbmsgUnhTdG9tcFNlcnZpY2V9IHdpdGgge0BsaW5rIHJ4U3RvbXBTZXJ2aWNlRmFjdG9yeX0uXG4gKiBJdCB3aWxsIGJlIGRyb3BwZWQgYEBzdG9tcC9uZzItc3RvbXBqc0A4LngueGAuKipcbiAqXG4gKiBBbmd1bGFyMiBTVE9NUCBTZXJ2aWNlIHVzaW5nIEBzdG9tcC9zdG9tcC5qc1xuICpcbiAqIEBkZXNjcmlwdGlvbiBUaGlzIHNlcnZpY2UgaGFuZGxlcyBzdWJzY3JpYmluZyB0byBhXG4gKiBtZXNzYWdlIHF1ZXVlIHVzaW5nIHRoZSBzdG9tcC5qcyBsaWJyYXJ5LCBhbmQgcmV0dXJuc1xuICogdmFsdWVzIHZpYSB0aGUgRVM2IE9ic2VydmFibGUgc3BlY2lmaWNhdGlvbiBmb3JcbiAqIGFzeW5jaHJvbm91cyB2YWx1ZSBzdHJlYW1pbmcgYnkgd2lyaW5nIHRoZSBTVE9NUFxuICogbWVzc2FnZXMgaW50byBhbiBvYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSB3YW50IHRvIG1hbnVhbGx5IGNvbmZpZ3VyZSBhbmQgaW5pdGlhbGl6ZSB0aGUgc2VydmljZVxuICogcGxlYXNlIHVzZSBTdG9tcFJTZXJ2aWNlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcFNlcnZpY2UgZXh0ZW5kcyBTdG9tcFJTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIFNlZSBSRUFETUUgYW5kIHNhbXBsZXMgZm9yIGNvbmZpZ3VyYXRpb24gZXhhbXBsZXNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuaW5pdEFuZENvbm5lY3QoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUnhTdG9tcCB9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcH0gd2l0aCBleGFjdGx5IHNhbWUgZnVuY3Rpb25hbGl0eS5cbiAqIFBsZWFzZSBzZWUge0BsaW5rIFJ4U3RvbXB9IGZvciBkZXRhaWxzLlxuICpcbiAqIFNlZToge0BsaW5rIC9ndWlkZS9uZzItc3RvbXBqcy8yMDE4LzExLzA0L25nMi1zdG9tcC13aXRoLWFuZ3VsYXI3Lmh0bWx9XG4gKiBmb3IgYSBzdGVwLWJ5LXN0ZXAgZ3VpZGUuXG4gKlxuICogU2VlIGFsc28ge0BsaW5rIHJ4U3RvbXBTZXJ2aWNlRmFjdG9yeX0uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSeFN0b21wU2VydmljZSBleHRlbmRzIFJ4U3RvbXAge31cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJ4U3RvbXBSUENDb25maWcgfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogSW5qZWN0YWJsZSB2ZXJzaW9uIG9mIHtAbGluayBSeFN0b21wUlBDQ29uZmlnfS5cbiAqXG4gKiBTZWUgZ3VpZGUgYXQge0BsaW5rIC9ndWlkZS9yeC1zdG9tcC9uZzItc3RvbXBqcy8yMDE4LzEwLzEyL3JlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sfVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWcgZXh0ZW5kcyBSeFN0b21wUlBDQ29uZmlnIHt9XG5cbi8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbi8qKlxuICogRGVwcmVjYXRlZCwgdXNlIHtAbGluayBJbmplY3RhYmxlUnhTdG9tcFJQQ0NvbmZpZ30gaW5zdGVhZFxuICovXG5leHBvcnQgY29uc3QgSW5qZWN0YWJsZVJ4U3RvbXBScGNDb25maWcgPSBJbmplY3RhYmxlUnhTdG9tcFJQQ0NvbmZpZztcbiIsImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFJ4U3RvbXBSUEMgfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuaW1wb3J0IHsgUnhTdG9tcFNlcnZpY2UgfSBmcm9tICcuL3J4LXN0b21wLnNlcnZpY2UnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWcgfSBmcm9tICcuL2luamVjdGFibGUtcngtc3RvbXAtcnBjLWNvbmZpZyc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiBJbmplY3RhYmxlIHZlcnNpb24gb2Yge0BsaW5rIFJ4U3RvbXBSUEN9LlxuICpcbiAqIFNlZSBndWlkZSBhdCB7QGxpbmsgL2d1aWRlL3J4LXN0b21wL25nMi1zdG9tcGpzLzIwMTgvMTAvMTIvcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWx9XG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSeFN0b21wUlBDU2VydmljZSBleHRlbmRzIFJ4U3RvbXBSUEMge1xuICBjb25zdHJ1Y3RvcihcbiAgICByeFN0b21wOiBSeFN0b21wU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBzdG9tcFJQQ0NvbmZpZz86IEluamVjdGFibGVSeFN0b21wUlBDQ29uZmlnXG4gICkge1xuICAgIHN1cGVyKHJ4U3RvbXAsIHN0b21wUlBDQ29uZmlnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUnhTdG9tcENvbmZpZyB9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcENvbmZpZ30gd2l0aCBleGFjdGx5IHNhbWUgZnVuY3Rpb25hbGl0eS5cbiAqIFBsZWFzZSBzZWUge0BsaW5rIFJ4U3RvbXBDb25maWd9IGZvciBkZXRhaWxzLlxuICpcbiAqIFNlZToge0BsaW5rIC9ndWlkZS9uZzItc3RvbXBqcy8yMDE4LzExLzA0L25nMi1zdG9tcC13aXRoLWFuZ3VsYXI3Lmh0bWx9XG4gKiBmb3IgYSBzdGVwLWJ5LXN0ZXAgZ3VpZGUuXG4gKlxuICogSWYgYWxsIGZpZWxkcyBvZiBjb25maWd1cmF0aW9uIGFyZSBmaXhlZCBhbmQga25vd24gaW4gYWR2YW5jZSB5b3Ugd291bGQgdHlwaWNhbGx5IGRlZmluZVxuICogYSBgY29uc3RgIGFuZCBpbmplY3QgaXQgdXNpbmcgdmFsdWUuXG4gKlxuICogSWYgc29tZSBmaWVsZHMgd2lsbCBiZSBrbm93biBieSBsYXRlciwgaXQgY2FuIGJlIGluamVjdGVkIHVzaW5nIGEgZmFjdG9yeSBmdW5jdGlvbi5cbiAqXG4gKiBPY2Nhc2lvbmFsbHkgaXQgbWF5IG5lZWQgdG8gYmUgY29tYmluZWQgd2l0aCBBbmd1bGFyJ3MgQVBQX0lOSVRJQUxJWkVSIG1lY2hhbmlzbS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEluamVjdGFibGVSeFN0b21wQ29uZmlnIGV4dGVuZHMgUnhTdG9tcENvbmZpZyB7fVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZVJ4U3RvbXBDb25maWcgfSBmcm9tICcuL2luamVjdGFibGUtcngtc3RvbXAtY29uZmlnJztcbmltcG9ydCB7IFJ4U3RvbXBTZXJ2aWNlIH0gZnJvbSAnLi9yeC1zdG9tcC5zZXJ2aWNlJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIFRoaXMgaXMgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGNhbiBjcmVhdGUge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfVxuICogd2hlbiBjb25maWd1cmF0aW9uIGlzIGFscmVhZHkga25vd24uXG4gKiBZb3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIGZvciBkZWZpbmluZyBwcm92aWRlciBmb3Ige0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfS5cbiAqIHtAbGluayBSeFN0b21wU2VydmljZX0gY3JlYXRlZCB1c2luZyB0aGlzIGZ1bmN0aW9uIGlzIGNvbmZpZ3VyZWQgYW5kIGFjdGl2YXRlZC5cbiAqIFRoaXMgcHJvdmlkZXMgdGhlIHNpbXBsZXN0IG1lY2hhbmlzbSB0byBkZWZpbmUge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfSBmb3IgRGVwZW5kZW5jeSBJbmplY3Rpb24uXG4gKlxuICogU2VlOiB7QGxpbmsgL2d1aWRlL25nMi1zdG9tcGpzLzIwMTgvMTEvMDQvbmcyLXN0b21wLXdpdGgtYW5ndWxhcjcuaHRtbH1cbiAqIGZvciBhIHN0ZXAtYnktc3RlcCBndWlkZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJ4U3RvbXBTZXJ2aWNlRmFjdG9yeShcbiAgcnhTdG9tcENvbmZpZzogSW5qZWN0YWJsZVJ4U3RvbXBDb25maWdcbik6IFJ4U3RvbXBTZXJ2aWNlIHtcbiAgY29uc3QgcnhTdG9tcFNlcnZpY2UgPSBuZXcgUnhTdG9tcFNlcnZpY2UoKTtcblxuICByeFN0b21wU2VydmljZS5jb25maWd1cmUocnhTdG9tcENvbmZpZyk7XG4gIHJ4U3RvbXBTZXJ2aWNlLmFjdGl2YXRlKCk7XG5cbiAgcmV0dXJuIHJ4U3RvbXBTZXJ2aWNlO1xufVxuIl0sIm5hbWVzIjpbInRzbGliXzEuX19leHRlbmRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0NtQ0EsaUNBQU87O29CQWlOdEMsaUJBQU87UUFFUCxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZUFBZSxDQUFhLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFVBQUMsRUFBZ0I7WUFDL0MsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ25ELENBQUMsQ0FBQzs7Ozs7OztJQTlNVSw0QkFBYzs7OztjQUFDLEVBQWdCO1FBQzVDLElBQUksRUFBRSxLQUFLLFlBQVksQ0FBQyxVQUFVLEVBQUU7WUFDbEMsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxFQUFFLEtBQUssWUFBWSxDQUFDLElBQUksRUFBRTtZQUM1QixPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUM7U0FDN0I7UUFDRCxJQUFJLEVBQUUsS0FBSyxZQUFZLENBQUMsT0FBTyxFQUFFO1lBQy9CLE9BQU8sVUFBVSxDQUFDLGFBQWEsQ0FBQztTQUNqQztRQUNELElBQUksRUFBRSxLQUFLLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDOUIsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQzFCOztJQVNILHNCQUFJLDRDQUFpQjs7Ozs7Ozs7Ozs7Ozs7UUFBckI7WUFDRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUN6QixHQUFHLENBQ0QsVUFBQyxFQUFnQjtnQkFDZixPQUFPLGFB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