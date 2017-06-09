import {Injectable} from '@angular/core';
import {StompService} from './stomp.service';
import {Observable} from 'rxjs/Observable';
import {Message} from '@stomp/stompjs';
import {UUID} from 'angular2-uuid';

@Injectable()
export class RabbitRPCService {
  protected replyQueue = 'rpc-replies';

  constructor(private stompService: StompService) {
  }

  public rpc(serviceEndPoint: string, payload: string): Observable<Message> {
    const correlationId = UUID.UUID();

    // We know there will be only one message in reply
    const observable = this.stompService.defaultMessagesObservable.filter((message: Message) => {
      return message.headers['correlation-id'] === correlationId;
    }).first();

    // send an RPC request
    const headers = {
      'reply-to': `/temp-queue/${this.replyQueue}`,
      'correlation-id': correlationId
    };

    this.stompService.publish(serviceEndPoint, payload, headers);

    return observable;
  }
}
