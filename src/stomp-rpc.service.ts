import { Injectable } from '@angular/core';
import { Message, StompHeaders } from '@stomp/stompjs';
import { UUID } from 'angular2-uuid';
import { Observable, Observer, Subject, Subscription } from "rxjs";
import { filter, first } from "rxjs/operators";
import { StompRService } from "./stomp-r.service";

@Injectable()
export class StompRPCService {
  protected replyQueue = '/temp-queue/rpc-replies';

  protected messagesObservable: Observable<Message>;

  constructor(private stompService: StompRService) {
    this.messagesObservable = this.stompService.defaultMessagesObservable;
  }

  public rpc(serviceEndPoint: string, payload: string, headers?: StompHeaders): Observable<Message> {
    // We know there will be only one message in reply
    return this.stream(serviceEndPoint, payload, headers).pipe(first());
  }

  private stream(serviceEndPoint: string, payload: string, headers: StompHeaders = {}) {
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
        headers['reply-to'] = this.replyQueue;
        headers['correlation-id'] = correlationId;

        this.stompService.publish(serviceEndPoint, payload, headers);

        return () => { // Cleanup
          defaultMessagesSubscription.unsubscribe();
        };
      }
    );
  }
}
