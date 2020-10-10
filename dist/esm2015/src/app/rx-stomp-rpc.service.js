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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicngtc3RvbXAtcnBjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvYXBwL3J4LXN0b21wLXJwYy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7Ozs7OztBQVU5RSxNQUFNLHdCQUF5QixTQUFRLFVBQVU7Ozs7O0lBQy9DLFlBQ0UsT0FBdUIsRUFDWDtRQUVaLEtBQUssQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7S0FDaEM7OztZQVBGLFVBQVU7Ozs7WUFWRixjQUFjO1lBQ2QsMEJBQTBCLHVCQWE5QixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgUnhTdG9tcFJQQyB9IGZyb20gJ0BzdG9tcC9yeC1zdG9tcCc7XG5pbXBvcnQgeyBSeFN0b21wU2VydmljZSB9IGZyb20gJy4vcngtc3RvbXAuc2VydmljZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlUnhTdG9tcFJQQ0NvbmZpZyB9IGZyb20gJy4vaW5qZWN0YWJsZS1yeC1zdG9tcC1ycGMtY29uZmlnJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIEluamVjdGFibGUgdmVyc2lvbiBvZiB7QGxpbmsgUnhTdG9tcFJQQ30uXG4gKlxuICogU2VlIGd1aWRlIGF0IHtAbGluayAvZ3VpZGUvcngtc3RvbXAvbmcyLXN0b21wanMvMjAxOC8xMC8xMi9yZW1vdGUtcHJvY2VkdXJlLWNhbGwuaHRtbH1cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJ4U3RvbXBSUENTZXJ2aWNlIGV4dGVuZHMgUnhTdG9tcFJQQyB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHJ4U3RvbXA6IFJ4U3RvbXBTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHN0b21wUlBDQ29uZmlnPzogSW5qZWN0YWJsZVJ4U3RvbXBSUENDb25maWdcbiAgKSB7XG4gICAgc3VwZXIocnhTdG9tcCwgc3RvbXBSUENDb25maWcpO1xuICB9XG59XG4iXX0=