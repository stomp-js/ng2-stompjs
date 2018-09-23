/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable } from "rxjs";
import { filter, first } from "rxjs/operators";
import { StompRService } from "./stomp-r.service";
import { StompRPCConfig } from "./stomp-rpc.config";
/**
 * An implementation of RPC service using messaging.
 *
 * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
 */
var StompRPCService = /** @class */ (function () {
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
        return this.stream(serviceEndPoint, payload, headers).pipe(first());
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
        if (headers === void 0) { headers = {}; }
        if (!this._repliesObservable) {
            this._repliesObservable = this._setupReplyQueue(this._replyQueueName, this.stompService);
        }
        return Observable.create(function (rpcObserver) {
            var /** @type {?} */ defaultMessagesSubscription;
            var /** @type {?} */ correlationId = UUID.UUID();
            defaultMessagesSubscription = _this._repliesObservable.pipe(filter(function (message) {
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
        { type: Injectable }
    ];
    /** @nocollapse */
    StompRPCService.ctorParameters = function () { return [
        { type: StompRService, },
        { type: StompRPCConfig, },
    ]; };
    return StompRPCService;
}());
export { StompRPCService };
function StompRPCService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StompRPCService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StompRPCService.ctorParameters;
    /** @type {?} */
    StompRPCService.prototype._replyQueueName;
    /** @type {?} */
    StompRPCService.prototype._setupReplyQueue;
    /** @type {?} */
    StompRPCService.prototype._repliesObservable;
    /** @type {?} */
    StompRPCService.prototype.stompService;
    /** @type {?} */
    StompRPCService.prototype.stompRPCConfig;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtcnBjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvc3RvbXAtcnBjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuQyxPQUFPLEVBQUMsVUFBVSxFQUF5QixNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQXdCLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7Ozs7O0lBaUJ2RTs7T0FFRztJQUNILHlCQUFvQixZQUEyQixFQUFVLGNBQStCO1FBQXhGLGlCQVNDO1FBVG1CLGlCQUFZLEdBQVosWUFBWSxDQUFlO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWlCOytCQVg5RCx5QkFBeUI7Z0NBRUQ7WUFDaEQsTUFBTSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMseUJBQXlCLENBQUM7U0FDcEQ7UUFRQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUM7YUFDdEQ7WUFDRCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxlQUFlLENBQUM7YUFDeEQ7U0FDRjtLQUNGOzs7Ozs7OztJQUtNLDZCQUFHOzs7Ozs7O2NBQUMsZUFBdUIsRUFBRSxPQUFlLEVBQUUsT0FBc0I7O1FBRXpFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Ozs7Ozs7OztJQU0vRCxnQ0FBTTs7Ozs7OztjQUFDLGVBQXVCLEVBQUUsT0FBZSxFQUFFLE9BQTBCOztRQUExQix3QkFBQSxFQUFBLFlBQTBCO1FBQ2hGLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzFGO1FBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ3RCLFVBQUMsV0FBOEI7WUFDN0IscUJBQUksMkJBQXlDLENBQUM7WUFFOUMscUJBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVsQywyQkFBMkIsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQWdCO2dCQUNqRixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLGFBQWEsQ0FBQzthQUM1RCxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxPQUFnQjtnQkFDN0IsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQixDQUFDLENBQUM7O1lBR0gsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUM7WUFDM0MsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsYUFBYSxDQUFDO1lBRTFDLEtBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFN0QsTUFBTSxDQUFDOztnQkFDTCwyQkFBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUMzQyxDQUFDO1NBQ0gsQ0FDRixDQUFDOzs7Z0JBOURMLFVBQVU7Ozs7Z0JBUkgsYUFBYTtnQkFDVSxjQUFjOzswQkFON0M7O1NBY2EsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01lc3NhZ2UsIFN0b21wSGVhZGVyc30gZnJvbSAnQHN0b21wL3N0b21wanMnO1xuaW1wb3J0IHtVVUlEfSBmcm9tICdhbmd1bGFyMi11dWlkJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIFN1YnNjcmlwdGlvbn0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7ZmlsdGVyLCBmaXJzdH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XG5pbXBvcnQge1N0b21wUlNlcnZpY2V9IGZyb20gXCIuL3N0b21wLXIuc2VydmljZVwiO1xuaW1wb3J0IHtzZXR1cFJlcGx5UXVldWVGblR5cGUsIFN0b21wUlBDQ29uZmlnfSBmcm9tIFwiLi9zdG9tcC1ycGMuY29uZmlnXCI7XG5cbi8qKlxuICogQW4gaW1wbGVtZW50YXRpb24gb2YgUlBDIHNlcnZpY2UgdXNpbmcgbWVzc2FnaW5nLlxuICpcbiAqIFBsZWFzZSBzZWUgdGhlIFtndWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3JwYy0tLXJlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sKSBmb3IgZGV0YWlscy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wUlBDU2VydmljZSB7XG4gIHByaXZhdGUgX3JlcGx5UXVldWVOYW1lID0gJy90ZW1wLXF1ZXVlL3JwYy1yZXBsaWVzJztcblxuICBwcml2YXRlIF9zZXR1cFJlcGx5UXVldWU6IHNldHVwUmVwbHlRdWV1ZUZuVHlwZSA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zdG9tcFNlcnZpY2UuZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZTtcbiAgfTtcblxuICBwcml2YXRlIF9yZXBsaWVzT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxNZXNzYWdlPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlLCBzZWUgdGhlIFtndWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3JwYy0tLXJlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sKSBmb3IgZGV0YWlscy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RvbXBTZXJ2aWNlOiBTdG9tcFJTZXJ2aWNlLCBwcml2YXRlIHN0b21wUlBDQ29uZmlnPzogU3RvbXBSUENDb25maWcpIHtcbiAgICBpZiAoc3RvbXBSUENDb25maWcpIHtcbiAgICAgIGlmIChzdG9tcFJQQ0NvbmZpZy5yZXBseVF1ZXVlTmFtZSkge1xuICAgICAgICB0aGlzLl9yZXBseVF1ZXVlTmFtZSA9IHN0b21wUlBDQ29uZmlnLnJlcGx5UXVldWVOYW1lO1xuICAgICAgfVxuICAgICAgaWYgKHN0b21wUlBDQ29uZmlnLnNldHVwUmVwbHlRdWV1ZSkge1xuICAgICAgICB0aGlzLl9zZXR1cFJlcGx5UXVldWUgPSBzdG9tcFJQQ0NvbmZpZy5zZXR1cFJlcGx5UXVldWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gUlBDIHJlcXVlc3QuIFNlZSB0aGUgW2d1aWRlXSguLi9hZGRpdGlvbmFsLWRvY3VtZW50YXRpb24vcnBjLS0tcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWwpIGZvciBleGFtcGxlLlxuICAgKi9cbiAgcHVibGljIHJwYyhzZXJ2aWNlRW5kUG9pbnQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nLCBoZWFkZXJzPzogU3RvbXBIZWFkZXJzKTogT2JzZXJ2YWJsZTxNZXNzYWdlPiB7XG4gICAgLy8gV2Uga25vdyB0aGVyZSB3aWxsIGJlIG9ubHkgb25lIG1lc3NhZ2UgaW4gcmVwbHlcbiAgICByZXR1cm4gdGhpcy5zdHJlYW0oc2VydmljZUVuZFBvaW50LCBwYXlsb2FkLCBoZWFkZXJzKS5waXBlKGZpcnN0KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gUlBDIHN0cmVhbSByZXF1ZXN0LiBTZWUgdGhlIFtndWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3JwYy0tLXJlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sKS5cbiAgICovXG4gIHB1YmxpYyBzdHJlYW0oc2VydmljZUVuZFBvaW50OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZywgaGVhZGVyczogU3RvbXBIZWFkZXJzID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX3JlcGxpZXNPYnNlcnZhYmxlKSB7XG4gICAgICB0aGlzLl9yZXBsaWVzT2JzZXJ2YWJsZSA9IHRoaXMuX3NldHVwUmVwbHlRdWV1ZSh0aGlzLl9yZXBseVF1ZXVlTmFtZSwgdGhpcy5zdG9tcFNlcnZpY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShcbiAgICAgIChycGNPYnNlcnZlcjogT2JzZXJ2ZXI8TWVzc2FnZT4pID0+IHtcbiAgICAgICAgbGV0IGRlZmF1bHRNZXNzYWdlc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPSBVVUlELlVVSUQoKTtcblxuICAgICAgICBkZWZhdWx0TWVzc2FnZXNTdWJzY3JpcHRpb24gPSB0aGlzLl9yZXBsaWVzT2JzZXJ2YWJsZS5waXBlKGZpbHRlcigobWVzc2FnZTogTWVzc2FnZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlLmhlYWRlcnNbJ2NvcnJlbGF0aW9uLWlkJ10gPT09IGNvcnJlbGF0aW9uSWQ7XG4gICAgICAgIH0pKS5zdWJzY3JpYmUoKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IHtcbiAgICAgICAgICBycGNPYnNlcnZlci5uZXh0KG1lc3NhZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZW5kIGFuIFJQQyByZXF1ZXN0XG4gICAgICAgIGhlYWRlcnNbJ3JlcGx5LXRvJ10gPSB0aGlzLl9yZXBseVF1ZXVlTmFtZTtcbiAgICAgICAgaGVhZGVyc1snY29ycmVsYXRpb24taWQnXSA9IGNvcnJlbGF0aW9uSWQ7XG5cbiAgICAgICAgdGhpcy5zdG9tcFNlcnZpY2UucHVibGlzaChzZXJ2aWNlRW5kUG9pbnQsIHBheWxvYWQsIGhlYWRlcnMpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7IC8vIENsZWFudXBcbiAgICAgICAgICBkZWZhdWx0TWVzc2FnZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXX0=