/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable, Optional } from '@angular/core';
import { RxStompRPC } from '@stomp/rx-stomp';
import { RxStompService } from './rx-stomp.service';
import { InjectableRxStompRpcConfig } from './injectable-rx-stomp-rpc-config';
/**
 * An implementation of RPC service using messaging.
 *
 * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
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
        { type: InjectableRxStompRpcConfig, decorators: [{ type: Optional },] },
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicngtc3RvbXAtcnBjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvcngtc3RvbXAtcnBjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDOzs7Ozs7O0lBUXJDLDZDQUFVO0lBQy9DLDJCQUFZLE9BQXVCLEVBQWM7ZUFDL0Msa0JBQU0sT0FBTyxFQUFFLGNBQWMsQ0FBQztLQUMvQjs7Z0JBSkYsVUFBVTs7OztnQkFSSCxjQUFjO2dCQUNkLDBCQUEwQix1QkFTTSxRQUFROzs0QkFiaEQ7RUFZdUMsVUFBVTtTQUFwQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtSeFN0b21wUlBDfSBmcm9tICdAc3RvbXAvcngtc3RvbXAnO1xuaW1wb3J0IHtSeFN0b21wU2VydmljZX0gZnJvbSAnLi9yeC1zdG9tcC5zZXJ2aWNlJztcbmltcG9ydCB7SW5qZWN0YWJsZVJ4U3RvbXBScGNDb25maWd9IGZyb20gJy4vaW5qZWN0YWJsZS1yeC1zdG9tcC1ycGMtY29uZmlnJztcblxuLyoqXG4gKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiBSUEMgc2VydmljZSB1c2luZyBtZXNzYWdpbmcuXG4gKlxuICogUGxlYXNlIHNlZSB0aGUgW2d1aWRlXSguLi9hZGRpdGlvbmFsLWRvY3VtZW50YXRpb24vcnBjLS0tcmVtb3RlLXByb2NlZHVyZS1jYWxsLmh0bWwpIGZvciBkZXRhaWxzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUnhTdG9tcFJQQ1NlcnZpY2UgZXh0ZW5kcyBSeFN0b21wUlBDIHtcbiAgY29uc3RydWN0b3IocnhTdG9tcDogUnhTdG9tcFNlcnZpY2UsIEBPcHRpb25hbCgpIHN0b21wUlBDQ29uZmlnPzogSW5qZWN0YWJsZVJ4U3RvbXBScGNDb25maWcpIHtcbiAgICBzdXBlcihyeFN0b21wLCBzdG9tcFJQQ0NvbmZpZyk7XG4gIH1cbn1cbiJdfQ==