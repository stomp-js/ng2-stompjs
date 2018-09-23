import { Message, StompHeaders } from '@stomp/stompjs';
import { Observable } from "rxjs";
import { StompRService } from "./stomp-r.service";
import { StompRPCConfig } from "./stomp-rpc.config";
/**
 * An implementation of RPC service using messaging.
 *
 * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
 */
export declare class StompRPCService {
    private stompService;
    private stompRPCConfig;
    private _replyQueueName;
    private _setupReplyQueue;
    private _repliesObservable;
    /**
     * Create an instance, see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
     */
    constructor(stompService: StompRService, stompRPCConfig?: StompRPCConfig);
    /**
     * Make an RPC request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html) for example.
     */
    rpc(serviceEndPoint: string, payload: string, headers?: StompHeaders): Observable<Message>;
    /**
     * Make an RPC stream request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html).
     */
    stream(serviceEndPoint: string, payload: string, headers?: StompHeaders): any;
}
