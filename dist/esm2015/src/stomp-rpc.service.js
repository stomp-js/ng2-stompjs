/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable } from "rxjs";
import { filter, first } from "rxjs/operators";
import { StompRService } from "./stomp-r.service";
export class StompRPCService {
    /**
     * @param {?} stompService
     */
    constructor(stompService) {
        this.stompService = stompService;
        this.replyQueue = '/temp-queue/rpc-replies';
        this.messagesObservable = this.stompService.defaultMessagesObservable;
    }
    /**
     * @param {?} serviceEndPoint
     * @param {?} payload
     * @param {?=} headers
     * @return {?}
     */
    rpc(serviceEndPoint, payload, headers) {
        // We know there will be only one message in reply
        return this.stream(serviceEndPoint, payload, headers).pipe(first());
    }
    /**
     * @param {?} serviceEndPoint
     * @param {?} payload
     * @param {?=} headers
     * @return {?}
     */
    stream(serviceEndPoint, payload, headers = {}) {
        return Observable.create((rpcObserver) => {
            let /** @type {?} */ defaultMessagesSubscription;
            const /** @type {?} */ correlationId = UUID.UUID();
            defaultMessagesSubscription = this.messagesObservable.pipe(filter((message) => {
                return message.headers['correlation-id'] === correlationId;
            })).subscribe((message) => {
                rpcObserver.next(message);
            });
            // send an RPC request
            headers['reply-to'] = this.replyQueue;
            headers['correlation-id'] = correlationId;
            this.stompService.publish(serviceEndPoint, payload, headers);
            return () => {
                // Cleanup
                defaultMessagesSubscription.unsubscribe();
            };
        });
    }
}
StompRPCService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StompRPCService.ctorParameters = () => [
    { type: StompRService, },
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAtcnBjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvc3RvbXAtcnBjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUUsVUFBVSxFQUFtQyxNQUFNLE1BQU0sQ0FBQztBQUNuRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUdsRCxNQUFNOzs7O0lBS0osWUFBb0IsWUFBMkI7UUFBM0IsaUJBQVksR0FBWixZQUFZLENBQWU7MEJBSnhCLHlCQUF5QjtRQUs5QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQztLQUN2RTs7Ozs7OztJQUVNLEdBQUcsQ0FBQyxlQUF1QixFQUFFLE9BQWUsRUFBRSxPQUFzQjs7UUFFekUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7Ozs7SUFHOUQsTUFBTSxDQUFDLGVBQXVCLEVBQUUsT0FBZSxFQUFFLFVBQXdCLEVBQUU7UUFDakYsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ3RCLENBQUMsV0FBOEIsRUFBRSxFQUFFO1lBQ2pDLHFCQUFJLDJCQUF5QyxDQUFDO1lBRTlDLHVCQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFbEMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFnQixFQUFFLEVBQUU7Z0JBQ3JGLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssYUFBYSxDQUFDO2FBQzVELENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtnQkFDakMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQixDQUFDLENBQUM7O1lBR0gsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDdEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsYUFBYSxDQUFDO1lBRTFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFN0QsTUFBTSxDQUFDLEdBQUcsRUFBRTs7Z0JBQ1YsMkJBQTJCLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDM0MsQ0FBQztTQUNILENBQ0YsQ0FBQzs7OztZQXRDTCxVQUFVOzs7O1lBRkYsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1lc3NhZ2UsIFN0b21wSGVhZGVycyB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICdhbmd1bGFyMi11dWlkJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuaW1wb3J0IHsgU3RvbXBSU2VydmljZSB9IGZyb20gXCIuL3N0b21wLXIuc2VydmljZVwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBSUENTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIHJlcGx5UXVldWUgPSAnL3RlbXAtcXVldWUvcnBjLXJlcGxpZXMnO1xuXG4gIHByb3RlY3RlZCBtZXNzYWdlc09ic2VydmFibGU6IE9ic2VydmFibGU8TWVzc2FnZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdG9tcFNlcnZpY2U6IFN0b21wUlNlcnZpY2UpIHtcbiAgICB0aGlzLm1lc3NhZ2VzT2JzZXJ2YWJsZSA9IHRoaXMuc3RvbXBTZXJ2aWNlLmRlZmF1bHRNZXNzYWdlc09ic2VydmFibGU7XG4gIH1cblxuICBwdWJsaWMgcnBjKHNlcnZpY2VFbmRQb2ludDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcsIGhlYWRlcnM/OiBTdG9tcEhlYWRlcnMpOiBPYnNlcnZhYmxlPE1lc3NhZ2U+IHtcbiAgICAvLyBXZSBrbm93IHRoZXJlIHdpbGwgYmUgb25seSBvbmUgbWVzc2FnZSBpbiByZXBseVxuICAgIHJldHVybiB0aGlzLnN0cmVhbShzZXJ2aWNlRW5kUG9pbnQsIHBheWxvYWQsIGhlYWRlcnMpLnBpcGUoZmlyc3QoKSk7XG4gIH1cblxuICBwcml2YXRlIHN0cmVhbShzZXJ2aWNlRW5kUG9pbnQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nLCBoZWFkZXJzOiBTdG9tcEhlYWRlcnMgPSB7fSkge1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShcbiAgICAgIChycGNPYnNlcnZlcjogT2JzZXJ2ZXI8TWVzc2FnZT4pID0+IHtcbiAgICAgICAgbGV0IGRlZmF1bHRNZXNzYWdlc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPSBVVUlELlVVSUQoKTtcblxuICAgICAgICBkZWZhdWx0TWVzc2FnZXNTdWJzY3JpcHRpb24gPSB0aGlzLm1lc3NhZ2VzT2JzZXJ2YWJsZS5waXBlKGZpbHRlcigobWVzc2FnZTogTWVzc2FnZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlLmhlYWRlcnNbJ2NvcnJlbGF0aW9uLWlkJ10gPT09IGNvcnJlbGF0aW9uSWQ7XG4gICAgICAgIH0pKS5zdWJzY3JpYmUoKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IHtcbiAgICAgICAgICBycGNPYnNlcnZlci5uZXh0KG1lc3NhZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZW5kIGFuIFJQQyByZXF1ZXN0XG4gICAgICAgIGhlYWRlcnNbJ3JlcGx5LXRvJ10gPSB0aGlzLnJlcGx5UXVldWU7XG4gICAgICAgIGhlYWRlcnNbJ2NvcnJlbGF0aW9uLWlkJ10gPSBjb3JyZWxhdGlvbklkO1xuXG4gICAgICAgIHRoaXMuc3RvbXBTZXJ2aWNlLnB1Ymxpc2goc2VydmljZUVuZFBvaW50LCBwYXlsb2FkLCBoZWFkZXJzKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4geyAvLyBDbGVhbnVwXG4gICAgICAgICAgZGVmYXVsdE1lc3NhZ2VzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuIl19