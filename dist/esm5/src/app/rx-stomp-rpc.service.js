/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var RxStompRPCService = /** @class */ (function (_super) {
    tslib_1.__extends(RxStompRPCService, _super);
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
export { RxStompRPCService };
function RxStompRPCService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    RxStompRPCService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    RxStompRPCService.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicngtc3RvbXAtcnBjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvYXBwL3J4LXN0b21wLXJwYy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7Ozs7Ozs7O0lBVXZDLDZDQUFVO0lBQy9DLDJCQUNFLE9BQXVCLEVBQ1g7ZUFFWixrQkFBTSxPQUFPLEVBQUUsY0FBYyxDQUFDO0tBQy9COztnQkFQRixVQUFVOzs7O2dCQVZGLGNBQWM7Z0JBQ2QsMEJBQTBCLHVCQWE5QixRQUFROzs0QkFqQmI7RUFjdUMsVUFBVTtTQUFwQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBSeFN0b21wUlBDIH0gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcbmltcG9ydCB7IFJ4U3RvbXBTZXJ2aWNlIH0gZnJvbSAnLi9yeC1zdG9tcC5zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGVSeFN0b21wUlBDQ29uZmlnIH0gZnJvbSAnLi9pbmplY3RhYmxlLXJ4LXN0b21wLXJwYy1jb25maWcnO1xuXG4vKipcbiAqIFBhcnQgb2YgYEBzdG9tcC9uZzItc3RvbXBqc2AuXG4gKlxuICogSW5qZWN0YWJsZSB2ZXJzaW9uIG9mIHtAbGluayBSeFN0b21wUlBDfS5cbiAqXG4gKiBTZWUgZ3VpZGUgYXQge0BsaW5rIC9ndWlkZS9yeC1zdG9tcC9uZzItc3RvbXBqcy8yMDE4LzEwLzEyL3JlbW90ZS1wcm9jZWR1cmUtY2FsbC5odG1sfVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUnhTdG9tcFJQQ1NlcnZpY2UgZXh0ZW5kcyBSeFN0b21wUlBDIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcnhTdG9tcDogUnhTdG9tcFNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgc3RvbXBSUENDb25maWc/OiBJbmplY3RhYmxlUnhTdG9tcFJQQ0NvbmZpZ1xuICApIHtcbiAgICBzdXBlcihyeFN0b21wLCBzdG9tcFJQQ0NvbmZpZyk7XG4gIH1cbn1cbiJdfQ==