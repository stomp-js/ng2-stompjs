/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { StompState } from './stomp-state';
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
    tslib_1.__extends(StompRService, _super);
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
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN0b21wL25nMi1zdG9tcGpzLyIsInNvdXJjZXMiOlsic3JjL3N0b21wLXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLE9BQU8sRUFBaUIsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFJckUsT0FBTyxFQUFDLGVBQWUsRUFBc0IsTUFBTSxNQUFNLENBQUM7QUFDMUQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJOLHlDQUFPOztvQkErTHRDLGlCQUFPO1FBRVAsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBYSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFaEUsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxVQUFDLEVBQWdCO1lBQy9DLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRCxDQUFDLENBQUM7Ozs7Ozs7SUE1TFUsNEJBQWM7Ozs7Y0FBQyxFQUFnQjtRQUM1QyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7U0FDMUI7UUFDRCxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7U0FDN0I7UUFDRCxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssWUFBWSxDQUFDLE9BQU8s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LElBQUksQ0FBQyxDQUFDO1lBQ04scUJBQU0sU0FBUyxHQUFrQixTQUFTLENBQUM7WUFDM0MsaUJBQU0sT0FBTyxZQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW9CSSxpQ0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2NBQUMsU0FBaUIsRUFBRSxPQUEwQjtRQUExQix3QkFBQSxFQUFBLFlBQTBCO1FBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0JqQyxzQ0FBYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQUFDLFNBQWlCLEVBQUUsUUFBZ0M7UUFDdkUsaUJBQU0sZUFBZSxZQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7SUFHN0Msc0JBQUksaUNBQU07Ozs7UUFBVjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQzFCOzs7T0FBQTs7Z0JBN0xGLFVBQVU7Ozs7d0JBL0JYO0VBZ0NtQyxPQUFPO1NBQTdCLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1J4U3RvbXAsIFJ4U3RvbXBDb25maWcsIFJ4U3RvbXBTdGF0ZX0gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcblxuaW1wb3J0IHtwdWJsaXNoUGFyYW1zLCBDbGllbnQsIE1lc3NhZ2UsIEZyYW1lfSBmcm9tICdAc3RvbXAvc3RvbXBqcyc7XG5cbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7U3RvbXBTdGF0ZX0gZnJvbSAnLi9zdG9tcC1zdGF0ZSc7XG5pbXBvcnQgeyBTdG9tcEhlYWRlcnMgfSBmcm9tICcuL3N0b21wLWhlYWRlcnMnO1xuaW1wb3J0IHtTdG9tcENvbmZpZ30gZnJvbSAnLi9zdG9tcC5jb25maWcnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogKipUaGlzIGNsYXNzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2Yge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfS5cbiAqIEl0IHdpbGwgYmUgZHJvcHBlZCBgQHN0b21wL25nMi1zdG9tcGpzQDgueC54YC4qKlxuICpcbiAqIEFuZ3VsYXIyIFNUT01QIFJhdyBTZXJ2aWNlIHVzaW5nIEBzdG9tcC9zdG9tcC5qc1xuICpcbiAqIFlvdSB3aWxsIG9ubHkgbmVlZCB0aGUgcHVibGljIHByb3BlcnRpZXMgYW5kXG4gKiBtZXRob2RzIGxpc3RlZCB1bmxlc3MgeW91IGFyZSBhbiBhZHZhbmNlZCB1c2VyLiBUaGlzIHNlcnZpY2UgaGFuZGxlcyBzdWJzY3JpYmluZyB0byBhXG4gKiBtZXNzYWdlIHF1ZXVlIHVzaW5nIHRoZSBzdG9tcC5qcyBsaWJyYXJ5LCBhbmQgcmV0dXJuc1xuICogdmFsdWVzIHZpYSB0aGUgRVM2IE9ic2VydmFibGUgc3BlY2lmaWNhdGlvbiBmb3JcbiAqIGFzeW5jaHJvbm91cyB2YWx1ZSBzdHJlYW1pbmcgYnkgd2lyaW5nIHRoZSBTVE9NUFxuICogbWVzc2FnZXMgaW50byBhbiBvYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSB3aWxsIGxpa2UgdG8gcGFzcyB0aGUgY29uZmlndXJhdGlvbiBhcyBhIGRlcGVuZGVuY3ksXG4gKiBwbGVhc2UgdXNlIFN0b21wU2VydmljZSBjbGFzcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlNlcnZpY2UgZXh0ZW5kcyBSeFN0b21wIHtcbiAgLyoqXG4gICAqIFN0YXRlIG9mIHRoZSBTVE9NUFNlcnZpY2VcbiAgICpcbiAgICogSXQgaXMgYSBCZWhhdmlvclN1YmplY3QgYW5kIHdpbGwgZW1pdCBjdXJyZW50IHN0YXR1cyBpbW1lZGlhdGVseS4gVGhpcyB3aWxsIHR5cGljYWxseSBnZXRcbiAgICogdXNlZCB0byBzaG93IGN1cnJlbnQgc3RhdHVzIHRvIHRoZSBlbmQgdXNlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0ZTogQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+O1xuXG4gIHByaXZhdGUgc3RhdGljIF9tYXBTdG9tcFN0YXRlKHN0OiBSeFN0b21wU3RhdGUpOiBTdG9tcFN0YXRlIHtcbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DT05ORUNUSU5HKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5UUllJTkc7XG4gICAgfVxuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLk9QRU4pIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLkNPTk5FQ1RFRDtcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuQ0xPU0lORykge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuRElTQ09OTkVDVElORztcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuQ0xPU0VEKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5DTE9TRUQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgdHJpZ2dlciB3aGVuIGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQuIFVzZSB0aGlzIHRvIGNhcnJ5IG91dCBpbml0aWFsaXphdGlvbi5cbiAgICogSXQgd2lsbCB0cmlnZ2VyIGV2ZXJ5IHRpbWUgYSAocmUpY29ubmVjdGlvbiBvY2N1cnMuIElmIGl0IGlzIGFscmVhZHkgY29ubmVjdGVkXG4gICAqIGl0IHdpbGwgdHJpZ2dlciBpbW1lZGlhdGVseS4gWW91IGNhbiBzYWZlbHkgaWdub3JlIHRoZSB2YWx1ZSwgYXMgaXQgd2lsbCBhbHdheXMgYmVcbiAgICogU3RvbXBTdGF0ZS5DT05ORUNURURcbiAgICovXG4gIGdldCBjb25uZWN0T2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFN0b21wU3RhdGU+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0ZWQkLnBpcGUobWFwKChzdDogUnhTdG9tcFN0YXRlKTogU3RvbXBTdGF0ZSA9PiB7XG4gICAgICByZXR1cm4gU3RvbXBSU2VydmljZS5fbWFwU3RvbXBTdGF0ZShzdCk7XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGhlYWRlcnMgZnJvbSBtb3N0IHJlY2VudCBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgYXMgcmV0dXJuIGJ5IHRoZSBDT05ORUNURURcbiAgICogZnJhbWUuXG4gICAqIElmIHRoZSBTVE9NUCBjb25uZWN0aW9uIGhhcyBhbHJlYWR5IGJlZW4gZXN0YWJsaXNoZWQgaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LlxuICAgKiBJdCB3aWxsIGFkZGl0aW9uYWxseSB0cmlnZ2VyIGluIGV2ZW50IG9mIHJlY29ubmVjdGlvbiwgdGhlIHZhbHVlIHdpbGwgYmUgc2V0IG9mIGhlYWRlcnMgZnJvbVxuICAgKiB0aGUgcmVjZW50IHNlcnZlciByZXNwb25zZS5cbiAgICovXG4gIGdldCBzZXJ2ZXJIZWFkZXJzT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFN0b21wSGVhZGVycz4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlckhlYWRlcnMkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgbWVzc2FnZXMgdG8gdGhlIGRlZmF1bHQgcXVldWUgKGFueSBtZXNzYWdlIHRoYXQgYXJlIG5vdCBoYW5kbGVkIGJ5IGEgc3Vic2NyaXB0aW9uKVxuICAgKi9cbiAgZ2V0IGRlZmF1bHRNZXNzYWdlc09ic2VydmFibGUoKTogU3ViamVjdDxNZXNzYWdlPiB7XG4gICAgcmV0dXJuIHRoaXMudW5oYW5kbGVkTWVzc2FnZSQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCBlbWl0IGFsbCByZWNlaXB0c1xuICAgKi9cbiAgZ2V0IHJlY2VpcHRzT2JzZXJ2YWJsZSgpOiBTdWJqZWN0PEZyYW1lPiB7XG4gICAgcmV0dXJuIHRoaXMudW5oYW5kbGVkUmVjZWlwdHMkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgdHJpZ2dlciB3aGVuIGFuIGVycm9yIG9jY3Vycy4gVGhpcyBTdWJqZWN0IGNhbiBiZSB1c2VkIHRvIGhhbmRsZSBlcnJvcnMgZnJvbVxuICAgKiB0aGUgc3RvbXAgYnJva2VyLlxuICAgKi9cbiAgZ2V0IGVycm9yU3ViamVjdCgpOiBTdWJqZWN0PHN0cmluZyB8IEZyYW1lPiB7XG4gICAgcmV0dXJuIHRoaXMuc3RvbXBFcnJvcnMkO1xuICB9XG5cbiAgLyoqIFNldCBjb25maWd1cmF0aW9uICovXG4gIHNldCBjb25maWcoY29uZmlnOiBTdG9tcENvbmZpZykge1xuICAgIGNvbnN0IHJ4U3RvbXBDb25maWc6IFJ4U3RvbXBDb25maWcgPSB7IH07XG5cbiAgICBpZiAodHlwZW9mKGNvbmZpZy51cmwpID09PSAnc3RyaW5nJykge1xuICAgICAgcnhTdG9tcENvbmZpZy5icm9rZXJVUkwgPSBjb25maWcudXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByeFN0b21wQ29uZmlnLndlYlNvY2tldEZhY3RvcnkgPSBjb25maWcudXJsO1xuICAgIH1cblxuICAgIC8vIENvbmZpZ3VyZSBjbGllbnQgaGVhcnQtYmVhdGluZ1xuICAgIHJ4U3RvbXBDb25maWcuaGVhcnRiZWF0SW5jb21pbmcgPSBjb25maWcuaGVhcnRiZWF0X2luO1xuICAgIHJ4U3RvbXBDb25maWcuaGVhcnRiZWF0T3V0Z29pbmcgPSBjb25maWcuaGVhcnRiZWF0X291dDtcblxuICAgIC8vIEF1dG8gcmVjb25uZWN0XG4gICAgcnhTdG9tcENvbmZpZy5yZWNvbm5lY3REZWxheSA9IGNvbmZpZy5yZWNvbm5lY3RfZGVsYXk7XG5cbiAgICBpZiAoY29uZmlnLmRlYnVnKSB7XG4gICAgICByeFN0b21wQ29uZmlnLmRlYnVnID0gKHN0cjogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCksIHN0cik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJ4U3RvbXBDb25maWcuY29ubmVjdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIHRoaXMuY29uZmlndXJlKHJ4U3RvbXBDb25maWcpO1xuICB9XG4gIC8qKlxuICAgKiBJdCB3aWxsIGNvbm5lY3QgdG8gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBpbml0QW5kQ29ubmVjdCgpOiB2b2lkIHtcbiAgICAvLyBkaXNjb25uZWN0IGlmIGNvbm5lY3RlZFxuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuXG4gICAgLy8gQXR0ZW1wdCBjb25uZWN0aW9uLCBwYXNzaW5nIGluIGEgY2FsbGJhY2tcbiAgICB0aGlzLmFjdGl2YXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIFNUT01QIGJyb2tlci5cbiAgICovXG4gIHB1YmxpYyBkaXNjb25uZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgc2VuZCBhIG1lc3NhZ2UgdG8gYSBuYW1lZCBkZXN0aW5hdGlvbi4gVGhlIG1lc3NhZ2UgbXVzdCBiZSBgc3RyaW5nYC5cbiAgICpcbiAgICogVGhlIG1lc3NhZ2Ugd2lsbCBnZXQgbG9jYWxseSBxdWV1ZWQgaWYgdGhlIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLiBJdCB3aWxsIGF0dGVtcHQgdG9cbiAgICogcHVibGlzaCBxdWV1ZWQgbWVzc2FnZXMgYXMgc29vbiBhcyB0aGUgYnJva2VyIGdldHMgY29ubmVjdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcXVldWVOYW1lXG4gICAqIEBwYXJhbSBtZXNzYWdlXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChxdWV1ZU5hbWU6IHN0cmluZ3xwdWJsaXNoUGFyYW1zLCBtZXNzYWdlPzogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgcXVldWVOYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgc3VwZXIucHVibGlzaCh7ZGVzdGluYXRpb246IHF1ZXVlTmFtZSBhcyBzdHJpbmcsIGJvZHk6IG1lc3NhZ2UsIGhlYWRlcnN9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHViUGFyYW1zOiBwdWJsaXNoUGFyYW1zID0gcXVldWVOYW1lO1xuICAgICAgc3VwZXIucHVibGlzaChwdWJQYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIHN1YnNjcmliZSB0byBzZXJ2ZXIgbWVzc2FnZSBxdWV1ZXNcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHNhZmVseSBjYWxsZWQgZXZlbiBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuXG4gICAqIElmIHRoZSB1bmRlcmx5aW5nIFNUT01QIGNvbm5lY3Rpb24gZHJvcHMgYW5kIHJlY29ubmVjdHMsIGl0IHdpbGwgcmVzdWJzY3JpYmUgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogSWYgYSBoZWFkZXIgZmllbGQgJ2FjaycgaXMgbm90IGV4cGxpY2l0bHkgcGFzc2VkLCAnYWNrJyB3aWxsIGJlIHNldCB0byAnYXV0bycuIElmIHlvdVxuICAgKiBkbyBub3QgdW5kZXJzdGFuZCB3aGF0IGl0IG1lYW5zLCBwbGVhc2UgbGVhdmUgaXQgYXMgaXMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB3aGVuIHdvcmtpbmcgd2l0aCB0ZW1wb3JhcnkgcXVldWVzIHdoZXJlIHRoZSBzdWJzY3JpcHRpb24gcmVxdWVzdFxuICAgKiBjcmVhdGVzIHRoZVxuICAgKiB1bmRlcmx5aW5nIHF1ZXVlLCBtc3NhZ2VzIG1pZ2h0IGJlIG1pc3NlZCBkdXJpbmcgcmVjb25uZWN0LiBUaGlzIGlzc3VlIGlzIG5vdCBzcGVjaWZpY1xuICAgKiB0byB0aGlzIGxpYnJhcnkgYnV0IHRoZSB3YXkgU1RPTVAgYnJva2VycyBhcmUgZGVzaWduZWQgdG8gd29yay5cbiAgICpcbiAgICogQHBhcmFtIHF1ZXVlTmFtZVxuICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHN1YnNjcmliZShxdWV1ZU5hbWU6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pOiBPYnNlcnZhYmxlPE1lc3NhZ2U+IHtcbiAgICByZXR1cm4gdGhpcy53YXRjaChxdWV1ZU5hbWUsIGhlYWRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNUT01QIGJyb2tlcnMgbWF5IGNhcnJ5IG91dCBvcGVyYXRpb24gYXN5bmNocm9ub3VzbHkgYW5kIGFsbG93IHJlcXVlc3RpbmcgZm9yIGFja25vd2xlZGdlbWVudC5cbiAgICogVG8gcmVxdWVzdCBhbiBhY2tub3dsZWRnZW1lbnQsIGEgYHJlY2VpcHRgIGhlYWRlciBuZWVkcyB0byBiZSBzZW50IHdpdGggdGhlIGFjdHVhbCByZXF1ZXN0LlxuICAgKiBUaGUgdmFsdWUgKHNheSByZWNlaXB0LWlkKSBmb3IgdGhpcyBoZWFkZXIgbmVlZHMgdG8gYmUgdW5pcXVlIGZvciBlYWNoIHVzZS4gVHlwaWNhbGx5IGEgc2VxdWVuY2UsIGEgVVVJRCwgYVxuICAgKiByYW5kb20gbnVtYmVyIG9yIGEgY29tYmluYXRpb24gbWF5IGJlIHVzZWQuXG4gICAqXG4gICAqIEEgY29tcGxhaW50IGJyb2tlciB3aWxsIHNlbmQgYSBSRUNFSVBUIGZyYW1lIHdoZW4gYW4gb3BlcmF0aW9uIGhhcyBhY3R1YWxseSBiZWVuIGNvbXBsZXRlZC5cbiAgICogVGhlIG9wZXJhdGlvbiBuZWVkcyB0byBiZSBtYXRjaGVkIGJhc2VkIGluIHRoZSB2YWx1ZSBvZiB0aGUgcmVjZWlwdC1pZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWxsb3cgd2F0Y2hpbmcgZm9yIGEgcmVjZWlwdCBhbmQgaW52b2tlIHRoZSBjYWxsYmFja1xuICAgKiB3aGVuIGNvcnJlc3BvbmRpbmcgcmVjZWlwdCBoYXMgYmVlbiByZWNlaXZlZC5cbiAgICpcbiAgICogVGhlIGFjdHVhbCB7QGxpbmsgRnJhbWV9XG4gICAqIHdpbGwgYmUgcGFzc2VkIGFzIHBhcmFtZXRlciB0byB0aGUgY2FsbGJhY2suXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogICAgICAgIC8vIFB1Ymxpc2hpbmcgd2l0aCBhY2tub3dsZWRnZW1lbnRcbiAgICogICAgICAgIGxldCByZWNlaXB0SWQgPSByYW5kb21UZXh0KCk7XG4gICAqXG4gICAqICAgICAgICByeFN0b21wLndhaXRGb3JSZWNlaXB0KHJlY2VpcHRJZCwgZnVuY3Rpb24oKSB7XG4gICAqICAgICAgICAgIC8vIFdpbGwgYmUgY2FsbGVkIGFmdGVyIHNlcnZlciBhY2tub3dsZWRnZXNcbiAgICogICAgICAgIH0pO1xuICAgKiAgICAgICAgcnhTdG9tcC5wdWJsaXNoKHtkZXN0aW5hdGlvbjogVEVTVC5kZXN0aW5hdGlvbiwgaGVhZGVyczoge3JlY2VpcHQ6IHJlY2VpcHRJZH0sIGJvZHk6IG1zZ30pO1xuICAgKiBgYGBcbiAgICpcbiAgICogTWFwcyB0bzogW0NsaWVudCN3YXRjaEZvclJlY2VpcHRde0BsaW5rIENsaWVudCN3YXRjaEZvclJlY2VpcHR9XG4gICAqL1xuICBwdWJsaWMgd2FpdEZvclJlY2VpcHQocmVjZWlwdElkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZnJhbWU6IEZyYW1lKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgc3VwZXIud2F0Y2hGb3JSZWNlaXB0KHJlY2VpcHRJZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZ2V0IGNsaWVudCgpOiBDbGllbnQge1xuICAgIHJldHVybiB0aGlzLl9zdG9tcENsaWVudDtcbiAgfVxuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U3RvbXBTdGF0ZT4oU3RvbXBTdGF0ZS5DTE9TRUQpO1xuXG4gICAgdGhpcy5jb25uZWN0aW9uU3RhdGUkLnN1YnNjcmliZSgoc3Q6IFJ4U3RvbXBTdGF0ZSkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5uZXh0KFN0b21wUlNlcnZpY2UuX21hcFN0b21wU3RhdGUoc3QpKTtcbiAgICB9KTtcbiAgfVxufVxuIl19