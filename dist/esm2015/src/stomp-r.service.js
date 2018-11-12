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
            super.publish({ destination: /** @type {?} */ (queueName), body: message, headers });
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
     * underlying queue, mssages might be missed during reconnect. This issue is not specific
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN0b21wL25nMi1zdG9tcGpzLyIsInNvdXJjZXMiOlsic3JjL3N0b21wLXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsT0FBTyxFQUFpQixZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUlyRSxPQUFPLEVBQUMsZUFBZSxFQUFzQixNQUFNLE1BQU0sQ0FBQztBQUMxRCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCekMsTUFBTSxvQkFBcUIsU0FBUSxPQUFPOztRQStMdEMsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZUFBZSxDQUFhLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBZ0IsRUFBRSxFQUFFO1lBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRCxDQUFDLENBQUM7Ozs7OztJQTVMRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQWdCO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztTQUMxQjtRQUNELEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztTQUM3QjtRQUNELEVB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d0IsRUFBRTtRQUM1RCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQStCakMsY0FBYyxDQUFDLFNBQWlCLEVBQUUsUUFBZ0M7UUFDdkUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Ozs7O0lBRzdDLElBQUksTUFBTTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzFCOzs7WUE3TEYsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7UnhTdG9tcCwgUnhTdG9tcENvbmZpZywgUnhTdG9tcFN0YXRlfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuXG5pbXBvcnQge3B1Ymxpc2hQYXJhbXMsIENsaWVudCwgTWVzc2FnZSwgRnJhbWV9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcblxuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtTdG9tcFN0YXRlfSBmcm9tICcuL3N0b21wLXN0YXRlJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJy4vc3RvbXAtaGVhZGVycyc7XG5pbXBvcnQge1N0b21wQ29uZmlnfSBmcm9tICcuL3N0b21wLmNvbmZpZyc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiAqKlRoaXMgY2xhc3MgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiB7QGxpbmsgUnhTdG9tcFNlcnZpY2V9LlxuICogSXQgd2lsbCBiZSBkcm9wcGVkIGBAc3RvbXAvbmcyLXN0b21wanNAOC54LnhgLioqXG4gKlxuICogQW5ndWxhcjIgU1RPTVAgUmF3IFNlcnZpY2UgdXNpbmcgQHN0b21wL3N0b21wLmpzXG4gKlxuICogWW91IHdpbGwgb25seSBuZWVkIHRoZSBwdWJsaWMgcHJvcGVydGllcyBhbmRcbiAqIG1ldGhvZHMgbGlzdGVkIHVubGVzcyB5b3UgYXJlIGFuIGFkdmFuY2VkIHVzZXIuIFRoaXMgc2VydmljZSBoYW5kbGVzIHN1YnNjcmliaW5nIHRvIGFcbiAqIG1lc3NhZ2UgcXVldWUgdXNpbmcgdGhlIHN0b21wLmpzIGxpYnJhcnksIGFuZCByZXR1cm5zXG4gKiB2YWx1ZXMgdmlhIHRoZSBFUzYgT2JzZXJ2YWJsZSBzcGVjaWZpY2F0aW9uIGZvclxuICogYXN5bmNocm9ub3VzIHZhbHVlIHN0cmVhbWluZyBieSB3aXJpbmcgdGhlIFNUT01QXG4gKiBtZXNzYWdlcyBpbnRvIGFuIG9ic2VydmFibGUuXG4gKlxuICogSWYgeW91IHdpbGwgbGlrZSB0byBwYXNzIHRoZSBjb25maWd1cmF0aW9uIGFzIGEgZGVwZW5kZW5jeSxcbiAqIHBsZWFzZSB1c2UgU3RvbXBTZXJ2aWNlIGNsYXNzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSU2VydmljZSBleHRlbmRzIFJ4U3RvbXAge1xuICAvKipcbiAgICogU3RhdGUgb2YgdGhlIFNUT01QU2VydmljZVxuICAgKlxuICAgKiBJdCBpcyBhIEJlaGF2aW9yU3ViamVjdCBhbmQgd2lsbCBlbWl0IGN1cnJlbnQgc3RhdHVzIGltbWVkaWF0ZWx5LiBUaGlzIHdpbGwgdHlwaWNhbGx5IGdldFxuICAgKiB1c2VkIHRvIHNob3cgY3VycmVudCBzdGF0dXMgdG8gdGhlIGVuZCB1c2VyLlxuICAgKi9cbiAgcHVibGljIHN0YXRlOiBCZWhhdmlvclN1YmplY3Q8U3RvbXBTdGF0ZT47XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX21hcFN0b21wU3RhdGUoc3Q6IFJ4U3RvbXBTdGF0ZSk6IFN0b21wU3RhdGUge1xuICAgIGlmIChzdCA9PT0gUnhTdG9tcFN0YXRlLkNPTk5FQ1RJTkcpIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLlRSWUlORztcbiAgICB9XG4gICAgaWYgKHN0ID09PSBSeFN0b21wU3RhdGUuT1BFTikge1xuICAgICAgcmV0dXJuIFN0b21wU3RhdGUuQ09OTkVDVEVEO1xuICAgIH1cbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DTE9TSU5HKSB7XG4gICAgICByZXR1cm4gU3RvbXBTdGF0ZS5ESVNDT05ORUNUSU5HO1xuICAgIH1cbiAgICBpZiAoc3QgPT09IFJ4U3RvbXBTdGF0ZS5DTE9TRUQpIHtcbiAgICAgIHJldHVybiBTdG9tcFN0YXRlLkNMT1NFRDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZC4gVXNlIHRoaXMgdG8gY2Fycnkgb3V0IGluaXRpYWxpemF0aW9uLlxuICAgKiBJdCB3aWxsIHRyaWdnZXIgZXZlcnkgdGltZSBhIChyZSljb25uZWN0aW9uIG9jY3Vycy4gSWYgaXQgaXMgYWxyZWFkeSBjb25uZWN0ZWRcbiAgICogaXQgd2lsbCB0cmlnZ2VyIGltbWVkaWF0ZWx5LiBZb3UgY2FuIHNhZmVseSBpZ25vcmUgdGhlIHZhbHVlLCBhcyBpdCB3aWxsIGFsd2F5cyBiZVxuICAgKiBTdG9tcFN0YXRlLkNPTk5FQ1RFRFxuICAgKi9cbiAgZ2V0IGNvbm5lY3RPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8U3RvbXBTdGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3RlZCQucGlwZShtYXAoKHN0OiBSeFN0b21wU3RhdGUpOiBTdG9tcFN0YXRlID0+IHtcbiAgICAgIHJldHVybiBTdG9tcFJTZXJ2aWNlLl9tYXBTdG9tcFN0YXRlKHN0KTtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgaGVhZGVycyBmcm9tIG1vc3QgcmVjZW50IGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBhcyByZXR1cm4gYnkgdGhlIENPTk5FQ1RFRFxuICAgKiBmcmFtZS5cbiAgICogSWYgdGhlIFNUT01QIGNvbm5lY3Rpb24gaGFzIGFscmVhZHkgYmVlbiBlc3RhYmxpc2hlZCBpdCB3aWxsIHRyaWdnZXIgaW1tZWRpYXRlbHkuXG4gICAqIEl0IHdpbGwgYWRkaXRpb25hbGx5IHRyaWdnZXIgaW4gZXZlbnQgb2YgcmVjb25uZWN0aW9uLCB0aGUgdmFsdWUgd2lsbCBiZSBzZXQgb2YgaGVhZGVycyBmcm9tXG4gICAqIHRoZSByZWNlbnQgc2VydmVyIHJlc3BvbnNlLlxuICAgKi9cbiAgZ2V0IHNlcnZlckhlYWRlcnNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8U3RvbXBIZWFkZXJzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVySGVhZGVycyQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCBlbWl0IGFsbCBtZXNzYWdlcyB0byB0aGUgZGVmYXVsdCBxdWV1ZSAoYW55IG1lc3NhZ2UgdGhhdCBhcmUgbm90IGhhbmRsZWQgYnkgYSBzdWJzY3JpcHRpb24pXG4gICAqL1xuICBnZXQgZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZSgpOiBTdWJqZWN0PE1lc3NhZ2U+IHtcbiAgICByZXR1cm4gdGhpcy51bmhhbmRsZWRNZXNzYWdlJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIGVtaXQgYWxsIHJlY2VpcHRzXG4gICAqL1xuICBnZXQgcmVjZWlwdHNPYnNlcnZhYmxlKCk6IFN1YmplY3Q8RnJhbWU+IHtcbiAgICByZXR1cm4gdGhpcy51bmhhbmRsZWRSZWNlaXB0cyQ7XG4gIH1cblxuICAvKipcbiAgICogV2lsbCB0cmlnZ2VyIHdoZW4gYW4gZXJyb3Igb2NjdXJzLiBUaGlzIFN1YmplY3QgY2FuIGJlIHVzZWQgdG8gaGFuZGxlIGVycm9ycyBmcm9tXG4gICAqIHRoZSBzdG9tcCBicm9rZXIuXG4gICAqL1xuICBnZXQgZXJyb3JTdWJqZWN0KCk6IFN1YmplY3Q8c3RyaW5nIHwgRnJhbWU+IHtcbiAgICByZXR1cm4gdGhpcy5zdG9tcEVycm9ycyQ7XG4gIH1cblxuICAvKiogU2V0IGNvbmZpZ3VyYXRpb24gKi9cbiAgc2V0IGNvbmZpZyhjb25maWc6IFN0b21wQ29uZmlnKSB7XG4gICAgY29uc3QgcnhTdG9tcENvbmZpZzogUnhTdG9tcENvbmZpZyA9IHsgfTtcblxuICAgIGlmICh0eXBlb2YoY29uZmlnLnVybCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByeFN0b21wQ29uZmlnLmJyb2tlclVSTCA9IGNvbmZpZy51cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJ4U3RvbXBDb25maWcud2ViU29ja2V0RmFjdG9yeSA9IGNvbmZpZy51cmw7XG4gICAgfVxuXG4gICAgLy8gQ29uZmlndXJlIGNsaWVudCBoZWFydC1iZWF0aW5nXG4gICAgcnhTdG9tcENvbmZpZy5oZWFydGJlYXRJbmNvbWluZyA9IGNvbmZpZy5oZWFydGJlYXRfaW47XG4gICAgcnhTdG9tcENvbmZpZy5oZWFydGJlYXRPdXRnb2luZyA9IGNvbmZpZy5oZWFydGJlYXRfb3V0O1xuXG4gICAgLy8gQXV0byByZWNvbm5lY3RcbiAgICByeFN0b21wQ29uZmlnLnJlY29ubmVjdERlbGF5ID0gY29uZmlnLnJlY29ubmVjdF9kZWxheTtcblxuICAgIGlmIChjb25maWcuZGVidWcpIHtcbiAgICAgIHJ4U3RvbXBDb25maWcuZGVidWcgPSAoc3RyOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cobmV3IERhdGUoKSwgc3RyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcnhTdG9tcENvbmZpZy5jb25uZWN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgdGhpcy5jb25maWd1cmUocnhTdG9tcENvbmZpZyk7XG4gIH1cbiAgLyoqXG4gICAqIEl0IHdpbGwgY29ubmVjdCB0byB0aGUgU1RPTVAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGluaXRBbmRDb25uZWN0KCk6IHZvaWQge1xuICAgIC8vIGRpc2Nvbm5lY3QgaWYgY29ubmVjdGVkXG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG5cbiAgICAvLyBBdHRlbXB0IGNvbm5lY3Rpb24sIHBhc3NpbmcgaW4gYSBjYWxsYmFja1xuICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCB3aWxsIGRpc2Nvbm5lY3QgZnJvbSB0aGUgU1RPTVAgYnJva2VyLlxuICAgKi9cbiAgcHVibGljIGRpc2Nvbm5lY3QoKTogdm9pZCB7XG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBzZW5kIGEgbWVzc2FnZSB0byBhIG5hbWVkIGRlc3RpbmF0aW9uLiBUaGUgbWVzc2FnZSBtdXN0IGJlIGBzdHJpbmdgLlxuICAgKlxuICAgKiBUaGUgbWVzc2FnZSB3aWxsIGdldCBsb2NhbGx5IHF1ZXVlZCBpZiB0aGUgU1RPTVAgYnJva2VyIGlzIG5vdCBjb25uZWN0ZWQuIEl0IHdpbGwgYXR0ZW1wdCB0b1xuICAgKiBwdWJsaXNoIHF1ZXVlZCBtZXNzYWdlcyBhcyBzb29uIGFzIHRoZSBicm9rZXIgZ2V0cyBjb25uZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBxdWV1ZU5hbWVcbiAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICogQHBhcmFtIGhlYWRlcnNcbiAgICovXG4gIHB1YmxpYyBwdWJsaXNoKHF1ZXVlTmFtZTogc3RyaW5nfHB1Ymxpc2hQYXJhbXMsIG1lc3NhZ2U/OiBzdHJpbmcsIGhlYWRlcnM6IFN0b21wSGVhZGVycyA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBxdWV1ZU5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzdXBlci5wdWJsaXNoKHtkZXN0aW5hdGlvbjogcXVldWVOYW1lIGFzIHN0cmluZywgYm9keTogbWVzc2FnZSwgaGVhZGVyc30pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwdWJQYXJhbXM6IHB1Ymxpc2hQYXJhbXMgPSBxdWV1ZU5hbWU7XG4gICAgICBzdXBlci5wdWJsaXNoKHB1YlBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0IHdpbGwgc3Vic2NyaWJlIHRvIHNlcnZlciBtZXNzYWdlIHF1ZXVlc1xuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgc2FmZWx5IGNhbGxlZCBldmVuIGlmIHRoZSBTVE9NUCBicm9rZXIgaXMgbm90IGNvbm5lY3RlZC5cbiAgICogSWYgdGhlIHVuZGVybHlpbmcgU1RPTVAgY29ubmVjdGlvbiBkcm9wcyBhbmQgcmVjb25uZWN0cywgaXQgd2lsbCByZXN1YnNjcmliZSBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBJZiBhIGhlYWRlciBmaWVsZCAnYWNrJyBpcyBub3QgZXhwbGljaXRseSBwYXNzZWQsICdhY2snIHdpbGwgYmUgc2V0IHRvICdhdXRvJy4gSWYgeW91XG4gICAqIGRvIG5vdCB1bmRlcnN0YW5kIHdoYXQgaXQgbWVhbnMsIHBsZWFzZSBsZWF2ZSBpdCBhcyBpcy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHdoZW4gd29ya2luZyB3aXRoIHRlbXBvcmFyeSBxdWV1ZXMgd2hlcmUgdGhlIHN1YnNjcmlwdGlvbiByZXF1ZXN0XG4gICAqIGNyZWF0ZXMgdGhlXG4gICAqIHVuZGVybHlpbmcgcXVldWUsIG1zc2FnZXMgbWlnaHQgYmUgbWlzc2VkIGR1cmluZyByZWNvbm5lY3QuIFRoaXMgaXNzdWUgaXMgbm90IHNwZWNpZmljXG4gICAqIHRvIHRoaXMgbGlicmFyeSBidXQgdGhlIHdheSBTVE9NUCBicm9rZXJzIGFyZSBkZXNpZ25lZCB0byB3b3JrLlxuICAgKlxuICAgKiBAcGFyYW0gcXVldWVOYW1lXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBwdWJsaWMgc3Vic2NyaWJlKHF1ZXVlTmFtZTogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fSk6IE9ic2VydmFibGU8TWVzc2FnZT4ge1xuICAgIHJldHVybiB0aGlzLndhdGNoKHF1ZXVlTmFtZSwgaGVhZGVycyk7XG4gIH1cblxuICAvKipcbiAgICogU1RPTVAgYnJva2VycyBtYXkgY2Fycnkgb3V0IG9wZXJhdGlvbiBhc3luY2hyb25vdXNseSBhbmQgYWxsb3cgcmVxdWVzdGluZyBmb3IgYWNrbm93bGVkZ2VtZW50LlxuICAgKiBUbyByZXF1ZXN0IGFuIGFja25vd2xlZGdlbWVudCwgYSBgcmVjZWlwdGAgaGVhZGVyIG5lZWRzIHRvIGJlIHNlbnQgd2l0aCB0aGUgYWN0dWFsIHJlcXVlc3QuXG4gICAqIFRoZSB2YWx1ZSAoc2F5IHJlY2VpcHQtaWQpIGZvciB0aGlzIGhlYWRlciBuZWVkcyB0byBiZSB1bmlxdWUgZm9yIGVhY2ggdXNlLiBUeXBpY2FsbHkgYSBzZXF1ZW5jZSwgYSBVVUlELCBhXG4gICAqIHJhbmRvbSBudW1iZXIgb3IgYSBjb21iaW5hdGlvbiBtYXkgYmUgdXNlZC5cbiAgICpcbiAgICogQSBjb21wbGFpbnQgYnJva2VyIHdpbGwgc2VuZCBhIFJFQ0VJUFQgZnJhbWUgd2hlbiBhbiBvcGVyYXRpb24gaGFzIGFjdHVhbGx5IGJlZW4gY29tcGxldGVkLlxuICAgKiBUaGUgb3BlcmF0aW9uIG5lZWRzIHRvIGJlIG1hdGNoZWQgYmFzZWQgaW4gdGhlIHZhbHVlIG9mIHRoZSByZWNlaXB0LWlkLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBhbGxvdyB3YXRjaGluZyBmb3IgYSByZWNlaXB0IGFuZCBpbnZva2UgdGhlIGNhbGxiYWNrXG4gICAqIHdoZW4gY29ycmVzcG9uZGluZyByZWNlaXB0IGhhcyBiZWVuIHJlY2VpdmVkLlxuICAgKlxuICAgKiBUaGUgYWN0dWFsIHtAbGluayBGcmFtZX1cbiAgICogd2lsbCBiZSBwYXNzZWQgYXMgcGFyYW1ldGVyIHRvIHRoZSBjYWxsYmFjay5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiAgICAgICAgLy8gUHVibGlzaGluZyB3aXRoIGFja25vd2xlZGdlbWVudFxuICAgKiAgICAgICAgbGV0IHJlY2VpcHRJZCA9IHJhbmRvbVRleHQoKTtcbiAgICpcbiAgICogICAgICAgIHJ4U3RvbXAud2FpdEZvclJlY2VpcHQocmVjZWlwdElkLCBmdW5jdGlvbigpIHtcbiAgICogICAgICAgICAgLy8gV2lsbCBiZSBjYWxsZWQgYWZ0ZXIgc2VydmVyIGFja25vd2xlZGdlc1xuICAgKiAgICAgICAgfSk7XG4gICAqICAgICAgICByeFN0b21wLnB1Ymxpc2goe2Rlc3RpbmF0aW9uOiBURVNULmRlc3RpbmF0aW9uLCBoZWFkZXJzOiB7cmVjZWlwdDogcmVjZWlwdElkfSwgYm9keTogbXNnfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBNYXBzIHRvOiBbQ2xpZW50I3dhdGNoRm9yUmVjZWlwdF17QGxpbmsgQ2xpZW50I3dhdGNoRm9yUmVjZWlwdH1cbiAgICovXG4gIHB1YmxpYyB3YWl0Rm9yUmVjZWlwdChyZWNlaXB0SWQ6IHN0cmluZywgY2FsbGJhY2s6IChmcmFtZTogRnJhbWUpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBzdXBlci53YXRjaEZvclJlY2VpcHQocmVjZWlwdElkLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXQgY2xpZW50KCk6IENsaWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b21wQ2xpZW50O1xuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTdG9tcFN0YXRlPihTdG9tcFN0YXRlLkNMT1NFRCk7XG5cbiAgICB0aGlzLmNvbm5lY3Rpb25TdGF0ZSQuc3Vic2NyaWJlKChzdDogUnhTdG9tcFN0YXRlKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlLm5leHQoU3RvbXBSU2VydmljZS5fbWFwU3RvbXBTdGF0ZShzdCkpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=