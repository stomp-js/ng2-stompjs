import { Observable } from "rxjs";
import { Message } from "@stomp/stompjs";
import { StompRService } from "./stomp-r.service";
/**
 * See the guide for example
 */
export declare type setupReplyQueueFnType = (replyQueueName: string, stompService: StompRService) => Observable<Message>;
/**
 * RPC Config. See the guide for example.
 */
export declare class StompRPCConfig {
    /**
     * Name of the reply queue
     */
    replyQueueName?: string;
    /**
     * Setup the reply queue
     */
    setupReplyQueue?: setupReplyQueueFnType;
}
