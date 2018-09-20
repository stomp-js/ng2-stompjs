import { StompService } from './stomp.service';
import { Message } from '@stomp/stompjs';
import { Observable, Subject } from "rxjs";
export declare class StompRPCService {
    private stompService;
    protected replyQueue: string;
    protected messagesObservable: Subject<Message>;
    constructor(stompService: StompService);
    rpc(serviceEndPoint: string, payload: string): Observable<Message>;
    private stream(serviceEndPoint, payload);
}
