import { Injectable } from '@angular/core';
import { StompService } from './stomp.service';
import { Message } from '@stomp/stompjs';
import { UUID } from 'angular2-uuid';
import { Observable, Observer, Subject, Subscription } from "rxjs";
import { filter, first } from "rxjs/operators";

@Injectable()
export class StompRPCService {
  protected replyQueue = 'rpc-replies';

  protected messagesObservable: Subject<Message>;

  constructor(private stompService: StompService) {
    this.messagesObservable = this.stompService.defaultMessagesObservable;
  }

  public rpc(serviceEndPoint: string, payload: string): Observable<Message> {
    // We know there will be only one message in reply
    return this.stream(serviceEndPoint, payload).pipe(first());
  }

  private stream(serviceEndPoint: string, payload: string) {
    return Observable.create(
      (rpcObserver: Observer<Message>) => {
        let defaultMessagesSubscription: Subscription;

        const correlationId = UUID.UUID();

        defaultMessagesSubscription = this.messagesObservable.pipe(filter((message: Message) => {
          return message.headers['correlation-id'] === correlationId;
        })).subscribe((message: Message) => {
          rpcObserver.next(message);
        });

        // send an RPC request
        const headers = {
          'reply-to': `/temp-queue/${this.replyQueue}`,
          'correlation-id': correlationId
        };

        this.stompService.publish(serviceEndPoint, payload, headers);

        return () => { // Cleanup
          defaultMessagesSubscription.unsubscribe();
        };
      }
    );
  }
}
