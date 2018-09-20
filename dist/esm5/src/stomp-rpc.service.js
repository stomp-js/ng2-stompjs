/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { StompService } from './stomp.service';
import { UUID } from 'angular2-uuid';
import { Observable } from "rxjs";
import { filter, first } from "rxjs/operators";
var StompRPCService = /** @class */ (function () {
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
        return this.stream(serviceEndPoint, payload).pipe(first());
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
        return Observable.create(function (rpcObserver) {
            var /** @type {?} */ defaultMessagesSubscription;
            var /** @type {?} */ correlationId = UUID.UUID();
            defaultMessagesSubscription = _this.messagesObservable.pipe(filter(function (message) {
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
        { type: Injectable }
    ];
    /** @nocollapse */
    StompRPCService.ctorParameters = function () { return [
        { type: StompService, },
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
    StompRPCService.prototype.replyQueue;
    /** @type {?} */
    StompRPCService.prototype.messagesObservable;
    /** @type {?} */
    StompRPCService.prototype.stompService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtcnBjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvc3RvbXAtcnBjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFFLFVBQVUsRUFBbUMsTUFBTSxNQUFNLENBQUM7QUFDbkUsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7SUFRN0MseUJBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjOzBCQUp2QixhQUFhO1FBS2xDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDO0tBQ3ZFOzs7Ozs7SUFFTSw2QkFBRzs7Ozs7Y0FBQyxlQUF1QixFQUFFLE9BQWU7O1FBRWpELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OztJQUdyRCxnQ0FBTTs7Ozs7Y0FBQyxlQUF1QixFQUFFLE9BQWU7O1FBQ3JELE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUN0QixVQUFDLFdBQThCO1lBQzdCLHFCQUFJLDJCQUF5QyxDQUFDO1lBRTlDLHFCQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFbEMsMkJBQTJCLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFnQjtnQkFDakYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxhQUFhLENBQUM7YUFDNUQsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsT0FBZ0I7Z0JBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDM0IsQ0FBQyxDQUFDOztZQUdILHFCQUFNLE9BQU8sR0FBRztnQkFDZCxVQUFVLEVBQUUsaUJBQWUsS0FBSSxDQUFDLFVBQVk7Z0JBQzVDLGdCQUFnQixFQUFFLGFBQWE7YUFDaEMsQ0FBQztZQUVGLEtBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFN0QsTUFBTSxDQUFDOztnQkFDTCwyQkFBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUMzQyxDQUFDO1NBQ0gsQ0FDRixDQUFDOzs7Z0JBeENMLFVBQVU7Ozs7Z0JBTkYsWUFBWTs7MEJBRHJCOztTQVFhLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdG9tcFNlcnZpY2UgfSBmcm9tICcuL3N0b21wLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICdhbmd1bGFyMi11dWlkJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSUENTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIHJlcGx5UXVldWUgPSAncnBjLXJlcGxpZXMnO1xuXG4gIHByb3RlY3RlZCBtZXNzYWdlc09ic2VydmFibGU6IFN1YmplY3Q8TWVzc2FnZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdG9tcFNlcnZpY2U6IFN0b21wU2VydmljZSkge1xuICAgIHRoaXMubWVzc2FnZXNPYnNlcnZhYmxlID0gdGhpcy5zdG9tcFNlcnZpY2UuZGVmYXVsdE1lc3NhZ2VzT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHB1YmxpYyBycGMoc2VydmljZUVuZFBvaW50OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZyk6IE9ic2VydmFibGU8TWVzc2FnZT4ge1xuICAgIC8vIFdlIGtub3cgdGhlcmUgd2lsbCBiZSBvbmx5IG9uZSBtZXNzYWdlIGluIHJlcGx5XG4gICAgcmV0dXJuIHRoaXMuc3RyZWFtKHNlcnZpY2VFbmRQb2ludCwgcGF5bG9hZCkucGlwZShmaXJzdCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyZWFtKHNlcnZpY2VFbmRQb2ludDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jcmVhdGUoXG4gICAgICAocnBjT2JzZXJ2ZXI6IE9ic2VydmVyPE1lc3NhZ2U+KSA9PiB7XG4gICAgICAgIGxldCBkZWZhdWx0TWVzc2FnZXNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgICAgICBjb25zdCBjb3JyZWxhdGlvbklkID0gVVVJRC5VVUlEKCk7XG5cbiAgICAgICAgZGVmYXVsdE1lc3NhZ2VzU3Vic2NyaXB0aW9uID0gdGhpcy5tZXNzYWdlc09ic2VydmFibGUucGlwZShmaWx0ZXIoKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IHtcbiAgICAgICAgICByZXR1cm4gbWVzc2FnZS5oZWFkZXJzWydjb3JyZWxhdGlvbi1pZCddID09PSBjb3JyZWxhdGlvbklkO1xuICAgICAgICB9KSkuc3Vic2NyaWJlKChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgcnBjT2JzZXJ2ZXIubmV4dChtZXNzYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2VuZCBhbiBSUEMgcmVxdWVzdFxuICAgICAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgICAgICdyZXBseS10byc6IGAvdGVtcC1xdWV1ZS8ke3RoaXMucmVwbHlRdWV1ZX1gLFxuICAgICAgICAgICdjb3JyZWxhdGlvbi1pZCc6IGNvcnJlbGF0aW9uSWRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnN0b21wU2VydmljZS5wdWJsaXNoKHNlcnZpY2VFbmRQb2ludCwgcGF5bG9hZCwgaGVhZGVycyk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHsgLy8gQ2xlYW51cFxuICAgICAgICAgIGRlZmF1bHRNZXNzYWdlc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==