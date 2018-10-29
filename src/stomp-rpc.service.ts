import {Injectable} from '@angular/core';

import {RxStompRPC} from "@stomp/rx-stomp";

/**
 * An implementation of RPC service using messaging.
 *
 * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
 */
@Injectable()
export class StompRPCService extends RxStompRPC { }
