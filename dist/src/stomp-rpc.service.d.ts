import { Message, StompHeaders } from '@stomp/stompjs';
import { Observable } from "rxjs";
import { StompRService } from "./stomp-r.service";
export declare class StompRPCService {
    private stompService;
    protected replyQueue: string;
    protected messagesObservable: Observable<Message>;
    constructor(stompService: StompRService);
    rpc(serviceEndPoint: string, payload: string, headers?: StompHeaders): Observable<Message>;
    private stream(serviceEndPoint, payload, headers?);
}
