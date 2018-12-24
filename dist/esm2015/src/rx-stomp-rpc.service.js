/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { RxStompRPC } from '@stomp/rx-stomp';
import { RxStompService } from './rx-stomp.service';
import { InjectableRxStompRPCConfig } from './injectable-rx-stomp-rpc-config';
/**
 * Part of `\@stomp/ng2-stompjs`.
 *
 * Injectable version of {\@link RxStompRPC}.
 *
 * See guide at {\@link /guide/rx-stomp/ng2-stompjs/2018/10/12/remote-procedure-call.html}
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
    { type: InjectableRxStompRPCConfig, decorators: [{ type: Optional },] },
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicngtc3RvbXAtcnBjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvcngtc3RvbXAtcnBjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRW5ELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7Ozs7Ozs7O0FBVTVFLE1BQU0sd0JBQXlCLFNBQVEsVUFBVTs7Ozs7SUFDL0MsWUFBWSxPQUF1QixFQUFjO1FBQy9DLEtBQUssQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7S0FDaEM7OztZQUpGLFVBQVU7Ozs7WUFWSCxjQUFjO1lBQ2QsMEJBQTBCLHVCQVdNLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtSeFN0b21wUlBDfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuaW1wb3J0IHtSeFN0b21wU2VydmljZX0gZnJvbSAnLi9yeC1zdG9tcC5zZXJ2aWNlJztcbmltcG9ydCB7SW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWd9IGZyb20gJy4vaW5qZWN0YWJsZS1yeC1zdG9tcC1ycGMtY29uZmlnJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcFJQQ30uXG4gKlxuICogU2VlIGd1aWRlIGF0IHtAbGluayAvZ3VpZGUvcngtc3RvbXAvbmcyLXN0b21wanMvMjAxOC8xMC8xMi9yZW1vdGUtcHJvY2VkdXJlLWNhbGwuaHRtbH1cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJ4U3RvbXBSUENTZXJ2aWNlIGV4dGVuZHMgUnhTdG9tcFJQQyB7XG4gIGNvbnN0cnVjdG9yKHJ4U3RvbXA6IFJ4U3RvbXBTZXJ2aWNlLCBAT3B0aW9uYWwoKSBzdG9tcFJQQ0NvbmZpZz86IEluamVjdGFibGVSeFN0b21wUlBDQ29uZmlnKSB7XG4gICAgc3VwZXIocnhTdG9tcCwgc3RvbXBSUENDb25maWcpO1xuICB9XG59XG4iXX0=