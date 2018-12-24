import { RxStompRPC } from '@stomp/rx-stomp';
import { RxStompService } from './rx-stomp.service';
import { InjectableRxStompRPCConfig } from './injectable-rx-stomp-rpc-config';
/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * Injectable version of {@link RxStompRPC}.
 *
 * See guide at {@link /guide/rx-stomp/ng2-stompjs/2018/10/12/remote-procedure-call.html}
 */
export declare class RxStompRPCService extends RxStompRPC {
    constructor(rxStomp: RxStompService, stompRPCConfig?: InjectableRxStompRPCConfig);
}
