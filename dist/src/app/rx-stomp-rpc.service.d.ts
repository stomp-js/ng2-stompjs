import { RxStompRPC } from '@stomp/rx-stomp';
import { RxStompService } from './rx-stomp.service';
import { InjectableRxStompRPCConfig } from './injectable-rx-stomp-rpc-config';
/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * Injectable version of {@link RxStompRPC}.
 *
 * See guide at {@link /guide/rx-stomp/ng2-stompjs/remote-procedure-call.html}
 */
export declare class RxStompRPCService extends RxStompRPC {
    /**
     * Create an instance, typically called by Angular Dependency Injection framework.
     *
     * @param rxStomp
     * @param stompRPCConfig
     */
    constructor(rxStomp: RxStompService, stompRPCConfig?: InjectableRxStompRPCConfig);
}
