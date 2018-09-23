import {Injectable} from '@angular/core';
import {Message, StompHeaders} from '@stomp/stompjs';
import {UUID} from 'angular2-uuid';
import {Observable, Observer, Subscription} from "rxjs";
import {filter, first} from "rxjs/operators";
import {StompRService} from "./stomp-r.service";
import {setupReplyQueueFnType, StompRPCConfig} from "./stomp-rpc.config";

/**
 * An implementation of RPC service using messaging.
 *
 * Please see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
 */
@Injectable()
export class StompRPCService {
  private _replyQueueName = '/temp-queue/rpc-replies';

  private _setupReplyQueue: setupReplyQueueFnType = () => {
    return this.stompService.defaultMessagesObservable;
  };

  private _repliesObservable: Observable<Message>;

  /**
   * Create an instance, see the [guide](../additional-documentation/rpc---remote-procedure-call.html) for details.
   */
  constructor(private stompService: StompRService, private stompRPCConfig?: StompRPCConfig) {
    if (stompRPCConfig) {
      if (stompRPCConfig.replyQueueName) {
        this._replyQueueName = stompRPCConfig.replyQueueName;
      }
      if (stompRPCConfig.setupReplyQueue) {
        this._setupReplyQueue = stompRPCConfig.setupReplyQueue;
      }
    }
  }

  /**
   * Make an RPC request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html) for example.
   */
  public rpc(serviceEndPoint: string, payload: string, headers?: StompHeaders): Observable<Message> {
    // We know there will be only one message in reply
    return this.stream(serviceEndPoint, payload, headers).pipe(first());
  }

  /**
   * Make an RPC stream request. See the [guide](../additional-documentation/rpc---remote-procedure-call.html).
   */
  public stream(serviceEndPoint: string, payload: string, headers: StompHeaders = {}) {
    if (!this._repliesObservable) {
      this._repliesObservable = this._setupReplyQueue(this._replyQueueName, this.stompService);
    }

    return Observable.create(
      (rpcObserver: Observer<Message>) => {
        let defaultMessagesSubscription: Subscription;

        const correlationId = UUID.UUID();

        defaultMessagesSubscription = this._repliesObservable.pipe(filter((message: Message) => {
          return message.headers['correlation-id'] === correlationId;
        })).subscribe((message: Message) => {
          rpcObserver.next(message);
        });

        // send an RPC request
        headers['reply-to'] = this._replyQueueName;
        headers['correlation-id'] = correlationId;

        this.stompService.publish(serviceEndPoint, payload, headers);

        return () => { // Cleanup
          defaultMessagesSubscription.unsubscribe();
        };
      }
    );
  }
}
