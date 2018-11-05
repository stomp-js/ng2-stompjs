import {Injectable} from '@angular/core';
import {RxStompRPCConfig} from '@stomp/rx-stomp';

/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * Injectable version of {@link RxStompRPCConfig}.
 *
 * See guide at {@link /guide/rx-stomp/ng2-stompjs/2018/10/12/remote-procedure-call.html}
 */
@Injectable()
export class InjectableRxStompRpcConfig extends RxStompRPCConfig { }
