/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
export class StompRService extends RxStomp {
    constructor() {
        super();
        this.state = new BehaviorSubject(StompState.CLOSED);
        this.connectionState$.subscribe((st) => {
            this.state.next(StompRService._mapStompState(st));
        });
    }
    /**
     * @param {?} st
     * @return {?}
     */
    static _mapStompState(st) {
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
    }
    /**
     * Will trigger when connection is established. Use this to carry out initialization.
     * It will trigger every time a (re)connection occurs. If it is already connected
     * it will trigger immediately. You can safely ignore the value, as it will always be
     * StompState.CONNECTED
     * @return {?}
     */
    get connectObservable() {
        return this.connected$.pipe(map((st) => {
            return StompRService._mapStompState(st);
        }));
    }
    /**
     * Provides headers from most recent connection to the server as return by the CONNECTED
     * frame.
     * If the STOMP connection has already been established it will trigger immediately.
     * It will additionally trigger in event of reconnection, the value will be set of headers from
     * the recent server response.
     * @return {?}
     */
    get serverHeadersObservable() {
        return this.serverHeaders$;
    }
    /**
     * Will emit all messages to the default queue (any message that are not handled by a subscription)
     * @return {?}
     */
    get defaultMessagesObservable() {
        return this.unhandledMessage$;
    }
    /**
     * Will emit all receipts
     * @return {?}
     */
    get receiptsObservable() {
        return this.unhandledReceipts$;
    }
    /**
     * Will trigger when an error occurs. This Subject can be used to handle errors from
     * the stomp broker.
     * @return {?}
     */
    get errorSubject() {
        return this.stompErrors$;
    }
    /**
     * Set configuration
     * @param {?} config
     * @return {?}
     */
    set config(config) {
        const /** @type {?} */ rxStompConfig = {};
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
            rxStompConfig.debug = (str) => {
                console.log(new Date(), str);
            };
        }
        rxStompConfig.connectHeaders = config.headers;
        this.configure(rxStompConfig);
    }
    /**
     * It will connect to the STOMP broker.
     * @return {?}
     */
    initAndConnect() {
        // disconnect if connected
        this.deactivate();
        // Attempt connection, passing in a callback
        this.activate();
    }
    /**
     * It will disconnect from the STOMP broker.
     * @return {?}
     */
    disconnect() {
        this.deactivate();
    }
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
    publish(queueName, message, headers = {}) {
        if (typeof queueName === 'string') {
            super.publish({
                destination: /** @type {?} */ (queueName),
                body: message,
                headers,
            });
        }
        else {
            const /** @type {?} */ pubParams = queueName;
            super.publish(pubParams);
        }
    }
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
    subscribe(queueName, headers = {}) {
        return this.watch(queueName, headers);
    }
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
    waitForReceipt(receiptId, callback) {
        super.watchForReceipt(receiptId, callback);
    }
    /**
     * @return {?}
     */
    get client() {
        return this._stompClient;
    }
}
StompRService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StompRService.ctorParameters = () => [];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN0b21wL25nMi1zdG9tcGpzLyIsInNvdXJjZXMiOlsic3JjL2FwcC9jb21wYXRpYmlsaXR5L3N0b21wLXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUFpQixZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUl2RSxPQUFPLEVBQUUsZUFBZSxFQUF1QixNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCM0MsTUFBTSxvQkFBcUIsU0FBUSxPQUFPOztRQWlOdEMsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZUFBZSxDQUFhLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBZ0IsRUFBRSxFQUFFO1lBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRCxDQUFDLENBQUM7Ozs7OztJQTlNRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQWdCO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztTQUMxQjtRQUNELEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMs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U0FBaUIsRUFDakIsVUFBd0IsRUFBRTtRQUUxQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQStCakMsY0FBYyxDQUNuQixTQUFpQixFQUNqQixRQUFnQztRQUVoQyxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7Ozs7SUFHN0MsSUFBSSxNQUFNO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7S0FDMUI7OztZQS9NRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBSeFN0b21wLCBSeFN0b21wQ29uZmlnLCBSeFN0b21wU3RhdGUgfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuXG5pbXBvcnQgeyBwdWJsaXNoUGFyYW1zLCBDbGllbnQsIE1lc3NhZ2UsIEZyYW1lIH0gZnJvbSAnQHN0b21wL3N0b21wanMnO1xuXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgU3RvbXBTdGF0ZSB9IGZyb20gJy4vc3RvbXAtc3RhdGUnO1xuaW1wb3J0IHsgU3RvbXBIZWFkZXJzIH0gZnJvbSAnLi9zdG9tcC1oZWFkZXJzJztcbmltcG9ydCB7IFN0b21wQ29uZmlnIH0gZnJvbSAnLi9zdG9tcC5jb25maWcnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogKipUaGlzIGNsYXNzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2Yge0BsaW5rIFJ4U3RvbXBTZXJ2aWNlfS5cbiAqIEl0IHdpbGwgYmUgZHJvcHBlZCBgQHN0b21wL25nMi1zdG9tcGpzQDgueC54YC4qKlxuICpcbiAqIEFuZ3VsYXIyIFNUT01QIFJhdyBTZXJ2aWNlIHVzaW5nIEBzdG9tcC9zdG9tcC5qc1xuICpcbiAqIFlvdSB3aWxsIG9ubHkgbmVlZCB0aGUgcHVibGljIHByb3BlcnRpZXMgYW5kXG4gKiBtZXRob2RzIGxpc3RlZCB1bmxlc3MgeW91IGFyZSBhbiBhZHZhbmNlZCB1c2VyLiBUaGlzIHNlcnZpY2UgaGFuZGxlcyBzdWJzY3JpYmluZyB0byBhXG4gKiBtZXNzYWdlIHF1ZXVlIHVzaW5nIHRoZSBzdG9tcC5qcyBsaWJyYXJ5LCBhbmQgcmV0dXJuc1xuICogdmFsdWVzIHZpYSB0aGUgRVM2IE9ic2VydmFibGUgc3BlY2lmaWNhdGlvbiBmb3JcbiAqIGFzeW5jaHJvbm91cyB2YWx1ZSBzdHJlYW1pbmcgYnkgd2lyaW5nIHRoZSBTVE9NUFxuICogbWVzc2FnZXMgaW50byBhbiBvYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSB3aWxsIGxpa2UgdG8gcGFzcyB0aGUgY29uZmlndXJhdGlvbiBhcyBhIGRlcGVuZGVuY3ksXG4gKiBwbGVhc2UgdXNlIFN0b21wU2VydmljZSBjbGFzcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlNlcnZpY2UgZXh0ZW5kcyBSeFN0b21wIHtcbiAgLyoqXG4gICAqIFN0YXRlIG9mIHRoZSBTVE9NUFNlcnZpY2VcbiAgICpcbiAgICogSXQgaXMgYSBCZWhhdmlvclN1YmplY3QgYW5kIHdpbGwgZW1pdCBjdXJyZW50IHN0YXR1cyBpbW1lZGlhdGVseS4gVGhpcyB3aWxsIHR5cGljYWxseSBnZXRcbiAgICogdXNlZCB0byBzaG93IGN1cnJlbnQgc3RhdHVzIHRvIHRoZSBlbmQgdXNlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0ZTogQmVoYXZpb3JTdWJqZWN0PFN0b21wU3RhdGU+O1xuXG4gIHByaXZhdGUgc3RhdGljIF9tYXBTdG9tcFN0YXRlKHN0OiBSeFN0b21wU3RhdGUpOiBTdG9tcFN0YXRlIHtcbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DT05ORUNUSU5HKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5UUllJTkc7XG4gICAgfVxuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLk9QRU4pIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLkNPTk5FQ1RFRDtcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuQ0xPU0lORykge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuRElTQ09OTkVDVElORztcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuQ0xPU0VEKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5DTE9TRUQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgdHJpZ2dlciB3aGVuIGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQuIFVzZSB0aGlzIHRvIGNhcnJ5IG91dCBpbml0aWFsaXphdGlvbi5cbiAgICogSXQgd2lsbCB0cmlnZ2VyIGV2ZXJ5IHRpbWUgYSAocmUpY29ubmVjdGlvbiBvY2N1cnMuIElmIGl0IGlzIGFscmVhZHkgY29ubmVjdGVkXG4gICAqIGl0IHdpbGwgdHJpZ2dlciBpbW1lZGlhdGVseS4gWW91IGNhbiBzYWZlbHkgaWdub3JlIHRoZSB2YWx1ZSwgYXMgaXQgd2lsbCBhbHdheXMgYmVcbiAgICogU3RvbXBTdGF0ZS5DT05ORUNURURcbiAgICovXG4gIGdldCBjb25uZWN0T2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFN0b21wU3RhdGU+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0ZWQkLnBpcGUoXG4gICAgICBtYXAoXG4gICAgICAgIChzdDogUnhTdG9tcFN0YXRlKTogU3RvbXBTdGF0ZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFN0b21wUlNlcnZpY2UuX21hcFN0b21wU3RhdGUoc3QpO1xuICAgICAgICB9XG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBoZWFkZXJzIGZyb20gbW9zdCByZWNlbnQgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyIGFzIHJldHVybiBieSB0aGUgQ09OTkVDVEVEXG4gICAqIGZyYW1lLlxuICAgKiBJZiB0aGUgU1RPTVAgY29ubmVjdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGVzdGFibGlzaGVkIGl0IHdpbGwgdHJpZ2dlciBpbW1lZGlhdGVseS5cbiAgICogSXQgd2lsbCBhZGRpdGlvbmFsbHkgdHJpZ2dlciBpbiBldmVudCBvZiByZWNvbm5lY3Rpb24sIHRoZSB2YWx1ZSB3aWxsIGJlIHNldCBvZiBoZWFkZXJzIGZyb21cbiAgICogdGhlIHJlY2VudCBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAqL1xuICBnZXQgc2VydmVySGVhZGVyc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxTdG9tcEhlYWRlcnM+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXJIZWFkZXJzJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIG1lc3NhZ2VzIHRvIHRoZSBkZWZhdWx0IHF1ZXVlIChhbnkgbWVzc2FnZSB0aGF0IGFyZSBub3QgaGFuZGxlZCBieSBhIHN1YnNjcmlwdGlvbilcbiAgICovXG4gIGdldCBkZWZhdWx0TWVzc2FnZXNPYnNlcnZhYmxlKCk6IFN1YmplY3Q8TWVzc2FnZT4ge1xuICAgIHJldHVybiB0aGlzLnVuaGFuZGxlZE1lc3NhZ2UkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbGwgZW1pdCBhbGwgcmVjZWlwdHNcbiAgICovXG4gIGdldCByZWNlaXB0c09ic2VydmFibGUoKTogU3ViamVjdDxGcmFtZT4ge1xuICAgIHJldHVybiB0aGlzLnVuaGFuZGxlZFJlY2VpcHRzJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIHRyaWdnZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMuIFRoaXMgU3ViamVjdCBjYW4gYmUgdXNlZCB0byBoYW5kbGUgZXJyb3JzIGZyb21cbiAgICogdGhlIHN0b21wIGJyb2tlci5cbiAgICovXG4gIGdldCBlcnJvclN1YmplY3QoKTogU3ViamVjdDxzdHJpbmcgfCBGcmFtZT4ge1xuICAgIHJldHVybiB0aGlzLnN0b21wRXJyb3JzJDtcbiAgfVxuXG4gIC8qKiBTZXQgY29uZmlndXJhdGlvbiAqL1xuICBzZXQgY29uZmlnKGNvbmZpZzogU3RvbXBDb25maWcpIHtcbiAgICBjb25zdCByeFN0b21wQ29uZmlnOiBSeFN0b21wQ29uZmlnID0ge307XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy51cmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICByeFN0b21wQ29uZmlnLmJyb2tlclVSTCA9IGNvbmZpZy51cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJ4U3RvbXBDb25maWcud2ViU29ja2V0RmFjdG9yeSA9IGNvbmZpZy51cmw7XG4gICAgfVxuXG4gICAgLy8gQ29uZmlndXJlIGNsaWVudCBoZWFydC1iZWF0aW5nXG4gICAgcnhTdG9tcENvbmZpZy5oZWFydGJlYXRJbmNvbWluZyA9IGNvbmZpZy5oZWFydGJlYXRfaW47XG4gICAgcnhTdG9tcENvbmZpZy5oZWFydGJlYXRPdXRnb2luZyA9IGNvbmZpZy5oZWFydGJlYXRfb3V0O1xuXG4gICAgLy8gQXV0byByZWNvbm5lY3RcbiAgICByeFN0b21wQ29uZmlnLnJlY29ubmVjdERlbGF5ID0gY29uZmlnLnJlY29ubmVjdF9kZWxheTtcblxuICAgIGlmIChjb25maWcuZGVidWcpIHtcbiAgICAgIHJ4U3RvbXBDb25maWcuZGVidWcgPSAoc3RyOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cobmV3IERhdGUoKSwgc3RyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcnhTdG9tcENvbmZpZy5jb25uZWN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgdGhpcy5jb25maWd1cmUocnhTdG9tcENvbmZpZyk7XG4gIH1cbiAgLyoqXG4gICAqIEl0IHdpbGwgY29ubmVjdCB0byB0aGUgU1RPTVAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGluaXRBbmRDb25uZWN0KCk6IHZvaWQge1xuICAgIC8vIGRpc2Nvbm5lY3QgaWYgY29ubmVjdGVkXG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG5cbiAgICAvLyBBdHRlbXB0IGNvbm5lY3Rpb24sIHBhc3NpbmcgaW4gYSBjYWxsYmFja1xuICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGRpc2Nvbm5lY3QgZnJvbSB0aGUgU1RPTVAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGRpc2Nvbm5lY3QoKTogdm9pZCB7XG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBzZW5kIGEgbWVzc2FnZSB0byBhIG5hbWVkIGRlc3RpbmF0aW9uLiBUaGUgbWVzc2FnZSBtdXN0IGJlIGBzdHJpbmdgLlxuICAgKlxuICAgKiBUaGUgbWVzc2FnZSB3aWxsIGdldCBsb2NhbGx5IHF1ZXVlZCBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuIEl0IHdpbGwgYXR0ZW1wdCB0b1xuICAgKiBwdWJsaXNoIHF1ZXVlZCBtZXNzYWdlcyBhcyBzb29uIGFzIHRoZSBicm9rZXIgZ2V0cyBjb25uZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBxdWV1ZU5hbWVcbiAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICogQHBhcmFtIGhlYWRlcnNcbiAgICovXG4gIHB1YmxpYyBwdWJsaXNoKFxuICAgIHF1ZXVlTmFtZTogc3RyaW5nIHwgcHVibGlzaFBhcmFtcyxcbiAgICBtZXNzYWdlPzogc3RyaW5nLFxuICAgIGhlYWRlcnM6IFN0b21wSGVhZGVycyA9IHt9XG4gICk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgcXVldWVOYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgc3VwZXIucHVibGlzaCh7XG4gICAgICAgIGRlc3RpbmF0aW9uOiBxdWV1ZU5hbWUgYXMgc3RyaW5nLFxuICAgICAgICBib2R5OiBtZXNzYWdlLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHB1YlBhcmFtczogcHVibGlzaFBhcmFtcyA9IHF1ZXVlTmFtZTtcbiAgICAgIHN1cGVyLnB1Ymxpc2gocHViUGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBzdWJzY3JpYmUgdG8gc2VydmVyIG1lc3NhZ2UgcXVldWVzXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzYWZlbHkgY2FsbGVkIGV2ZW4gaWYgdGhlIFNUT01QIGJyb2tlciBpcyBub3QgY29ubmVjdGVkLlxuICAgKiBJZiB0aGUgdW5kZXJseWluZyBTVE9NUCBjb25uZWN0aW9uIGRyb3BzIGFuZCByZWNvbm5lY3RzLCBpdCB3aWxsIHJlc3Vic2NyaWJlIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIElmIGEgaGVhZGVyIGZpZWxkICdhY2snIGlzIG5vdCBleHBsaWNpdGx5IHBhc3NlZCwgJ2Fjaycgd2lsbCBiZSBzZXQgdG8gJ2F1dG8nLiBJZiB5b3VcbiAgICogZG8gbm90IHVuZGVyc3RhbmQgd2hhdCBpdCBtZWFucywgcGxlYXNlIGxlYXZlIGl0IGFzIGlzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgd2hlbiB3b3JraW5nIHdpdGggdGVtcG9yYXJ5IHF1ZXVlcyB3aGVyZSB0aGUgc3Vic2NyaXB0aW9uIHJlcXVlc3RcbiAgICogY3JlYXRlcyB0aGVcbiAgICogdW5kZXJseWluZyBxdWV1ZSwgbWVzc2FnZXMgbWlnaHQgYmUgbWlzc2VkIGR1cmluZyByZWNvbm5lY3QuIFRoaXMgaXNzdWUgaXMgbm90IHNwZWNpZmljXG4gICAqIHRvIHRoaXMgbGlicmFyeSBidXQgdGhlIHdheSBTVE9NUCBicm9rZXJzIGFyZSBkZXNpZ25lZCB0byB3b3JrLlxuICAgKlxuICAgKiBAcGFyYW0gcXVldWVOYW1lXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBwdWJsaWMgc3Vic2NyaWJlKFxuICAgIHF1ZXVlTmFtZTogc3RyaW5nLFxuICAgIGhlYWRlcnM6IFN0b21wSGVhZGVycyA9IHt9XG4gICk6IE9ic2VydmFibGU8TWVzc2FnZT4ge1xuICAgIHJldHVybiB0aGlzLndhdGNoKHF1ZXVlTmFtZSwgaGVhZGVycyk7XG4gIH1cblxuICAvKipcbiAgICogU1RPTVAgYnJva2VycyBtYXkgY2Fycnkgb3V0IG9wZXJhdGlvbiBhc3luY2hyb25vdXNseSBhbmQgYWxsb3cgcmVxdWVzdGluZyBmb3IgYWNrbm93bGVkZ2VtZW50LlxuICAgKiBUbyByZXF1ZXN0IGFuIGFja25vd2xlZGdlbWVudCwgYSBgcmVjZWlwdGAgaGVhZGVyIG5lZWRzIHRvIGJlIHNlbnQgd2l0aCB0aGUgYWN0dWFsIHJlcXVlc3QuXG4gICAqIFRoZSB2YWx1ZSAoc2F5IHJlY2VpcHQtaWQpIGZvciB0aGlzIGhlYWRlciBuZWVkcyB0byBiZSB1bmlxdWUgZm9yIGVhY2ggdXNlLiBUeXBpY2FsbHkgYSBzZXF1ZW5jZSwgYSBVVUlELCBhXG4gICAqIHJhbmRvbSBudW1iZXIgb3IgYSBjb21iaW5hdGlvbiBtYXkgYmUgdXNlZC5cbiAgICpcbiAgICogQSBjb21wbGFpbnQgYnJva2VyIHdpbGwgc2VuZCBhIFJFQ0VJUFQgZnJhbWUgd2hlbiBhbiBvcGVyYXRpb24gaGFzIGFjdHVhbGx5IGJlZW4gY29tcGxldGVkLlxuICAgKiBUaGUgb3BlcmF0aW9uIG5lZWRzIHRvIGJlIG1hdGNoZWQgYmFzZWQgaW4gdGhlIHZhbHVlIG9mIHRoZSByZWNlaXB0LWlkLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBhbGxvdyB3YXRjaGluZyBmb3IgYSByZWNlaXB0IGFuZCBpbnZva2UgdGhlIGNhbGxiYWNrXG4gICAqIHdoZW4gY29ycmVzcG9uZGluZyByZWNlaXB0IGhhcyBiZWVuIHJlY2VpdmVkLlxuICAgKlxuICAgKiBUaGUgYWN0dWFsIHtAbGluayBGcmFtZX1cbiAgICogd2lsbCBiZSBwYXNzZWQgYXMgcGFyYW1ldGVyIHRvIHRoZSBjYWxsYmFjay5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiAgICAgICAgLy8gUHVibGlzaGluZyB3aXRoIGFja25vd2xlZGdlbWVudFxuICAgKiAgICAgICAgbGV0IHJlY2VpcHRJZCA9IHJhbmRvbVRleHQoKTtcbiAgICpcbiAgICogICAgICAgIHJ4U3RvbXAud2FpdEZvclJlY2VpcHQocmVjZWlwdElkLCBmdW5jdGlvbigpIHtcbiAgICogICAgICAgICAgLy8gV2lsbCBiZSBjYWxsZWQgYWZ0ZXIgc2VydmVyIGFja25vd2xlZGdlc1xuICAgKiAgICAgICAgfSk7XG4gICAqICAgICAgICByeFN0b21wLnB1Ymxpc2goe2Rlc3RpbmF0aW9uOiBURVNULmRlc3RpbmF0aW9uLCBoZWFkZXJzOiB7cmVjZWlwdDogcmVjZWlwdElkfSwgYm9keTogbXNnfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBNYXBzIHRvOiBbQ2xpZW50I3dhdGNoRm9yUmVjZWlwdF17QGxpbmsgQ2xpZW50I3dhdGNoRm9yUmVjZWlwdH1cbiAgICovXG4gIHB1YmxpYyB3YWl0Rm9yUmVjZWlwdChcbiAgICByZWNlaXB0SWQ6IHN0cmluZyxcbiAgICBjYWxsYmFjazogKGZyYW1lOiBGcmFtZSkgPT4gdm9pZFxuICApOiB2b2lkIHtcbiAgICBzdXBlci53YXRjaEZvclJlY2VpcHQocmVjZWlwdElkLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXQgY2xpZW50KCk6IENsaWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b21wQ2xpZW50O1xuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTdG9tcFN0YXRlPihTdG9tcFN0YXRlLkNMT1NFRCk7XG5cbiAgICB0aGlzLmNvbm5lY3Rpb25TdGF0ZSQuc3Vic2NyaWJlKChzdDogUnhTdG9tcFN0YXRlKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBSU2VydmljZS5fbWFwU3RvbXBTdGF0ZShzdCkpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=