import {Injectable, Optional} from '@angular/core';

import {RxStompRPC} from '@stomp/rx-stomp';
import {RxStompService} from './rx-stomp.service';
import {InjectableRxStompRpcConfig} from './injectable-rx-stomp-rpc-config';

/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * Injectable version of {@link RxStompRPC}.
 *
 * See guide at {@link /guide/rx-stomp/ng2-stompjs/2018/10/12/remote-procedure-call.html}
 */
@Injectable()
export class RxStompRPCService extends RxStompRPC {
  constructor(rxStomp: RxStompService, @Optional() stompRPCConfig?: InjectableRxStompRpcConfig) {
    super(rxStomp, stompRPCConfig);
  }
}
