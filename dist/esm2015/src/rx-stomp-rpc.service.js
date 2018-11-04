/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { RxStompRPC } from '@stomp/rx-stomp';
import { RxStompService } from './rx-stomp.service';
import { InjectableRxStompRpcConfig } from './injectable-rx-stomp-rpc-config';
/**
 * An implementation of RPC service using messaging.
 *
 * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
 */
export class RxStompRPCService extends RxStompRPC {
    /**
     * @param {?} rxStomp
     * @param {?=} stompRPCConfig
     */
    constructor(rxStomp, stompRPCConfig) {
        super(rxStomp, stompRPCConfig);
    }
}
RxStompRPCService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
RxStompRPCService.ctorParameters = () => [
    { type: RxStompService, },
    { type: InjectableRxStompRpcConfig, decorators: [{ type: Optional },] },
];
function RxStompRPCService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    RxStompRPCService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    RxStompRPCService.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicngtc3RvbXAtcnBjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvcngtc3RvbXAtcnBjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRW5ELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7Ozs7OztBQVE1RSxNQUFNLHdCQUF5QixTQUFRLFVBQVU7Ozs7O0lBQy9DLFlBQVksT0FBdUIsRUFBYztRQUMvQyxLQUFLLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQ2hDOzs7WUFKRixVQUFVOzs7O1lBUkgsY0FBYztZQUNkLDBCQUEwQix1QkFTTSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7UnhTdG9tcFJQQ30gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcbmltcG9ydCB7UnhTdG9tcFNlcnZpY2V9IGZyb20gJy4vcngtc3RvbXAuc2VydmljZSc7XG5pbXBvcnQge0luamVjdGFibGVSeFN0b21wUnBjQ29uZmlnfSBmcm9tICcuL2luamVjdGFibGUtcngtc3RvbXAtcnBjLWNvbmZpZyc7XG5cbi8qKlxuICogQW4gaW1wbGVtZW50YXRpb24gb2YgUlBDIHNlcnZpY2UgdXNpbmcgbWVzc2FnaW5nLlxuICpcbiAqIFBsZWFzZSBzZWUgdGhlIFtndWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3JwYy0tLXJlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sKSBmb3IgZGV0YWlscy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJ4U3RvbXBSUENTZXJ2aWNlIGV4dGVuZHMgUnhTdG9tcFJQQyB7XG4gIGNvbnN0cnVjdG9yKHJ4U3RvbXA6IFJ4U3RvbXBTZXJ2aWNlLCBAT3B0aW9uYWwoKSBzdG9tcFJQQ0NvbmZpZz86IEluamVjdGFibGVSeFN0b21wUnBjQ29uZmlnKSB7XG4gICAgc3VwZXIocnhTdG9tcCwgc3RvbXBSUENDb25maWcpO1xuICB9XG59XG4iXX0=