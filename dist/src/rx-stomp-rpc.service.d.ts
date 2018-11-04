import { RxStompRPC } from '@stomp/rx-stomp';
import { RxStompService } from './rx-stomp.service';
import { InjectableRxStompRpcConfig } from './injectable-rx-stomp-rpc-config';
/**
 * An implementation of RPC service using messaging.
 *
 * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
 */
export declare class RxStompRPCService extends RxStompRPC {
    constructor(rxStomp: RxStompService, stompRPCConfig?: InjectableRxStompRpcConfig);
}
