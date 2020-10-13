import { Injectable } from '@angular/core';
import { RxStompRPCConfig } from '@stomp/rx-stomp';

/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * Injectable version of {@link RxStompRPCConfig}.
 *
 * See guide at {@link /guide/rx-stomp/ng2-stompjs/remote-procedure-call.html}
 */
@Injectable()
export class InjectableRxStompRPCConfig extends RxStompRPCConfig {}

// Backward compatibility
/**
 * Deprecated, use {@link InjectableRxStompRPCConfig} instead
 */
export const InjectableRxStompRpcConfig = InjectableRxStompRPCConfig;
