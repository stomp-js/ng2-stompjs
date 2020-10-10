// These are likely to fail on any broker other than RabbitMQ
import { IMessage } from '@stomp/stompjs';
import {
  InjectableRxStompConfig,
  RxStompRPCService,
  RxStompService,
  rxStompServiceFactory,
} from '../../../..';
import { UUID } from 'angular2-uuid';
import { TestBed } from '@angular/core/testing';
import { defaultRxStompConfig } from './rx-helpers';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { take } from 'rxjs/operators';

describe('Rabbit RPC', () => {
  const myServiceEndPoint = '/topic/echo';

  let rxStompService: RxStompService;
  let stompRPCService: RxStompRPCService;

  // To be used by the RPC server
  let rxStomp: RxStomp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RxStompService,
          useFactory: rxStompServiceFactory,
          deps: [InjectableRxStompConfig],
        },
        {
          provide: InjectableRxStompConfig,
          useValue: defaultRxStompConfig,
        },
        RxStompRPCService,
      ],
    });

    stompRPCService = TestBed.get(RxStompRPCService);
    rxStompService = TestBed.get(RxStompService);
  });

  beforeEach(done => {
    rxStomp = new RxStomp();
    const rxStompConfig: RxStompConfig = (Object as any).assign(
      {},
      defaultRxStompConfig
    );
    // Identify log messages on the server side
    rxStompConfig.debug = (str: string) => {
      console.log('RPC Server: ', new Date(), str);
    };
    rxStomp.configure(rxStompConfig);
    rxStomp.activate();

    rxStomp.connected$.pipe(take(1)).subscribe(() => {
      const receiptId = UUID.UUID();

      rxStomp
        .watch(myServiceEndPoint, { receipt: receiptId })
        .subscribe((message: IMessage) => {
          const replyTo = message.headers['reply-to'];
          const correlationId = message.headers['correlation-id'];
          const incomingMessage = message.body;

          const outgoingMessage = 'Echoing - ' + incomingMessage;
          rxStomp.publish({
            destination: replyTo,
            body: outgoingMessage,
            headers: { 'correlation-id': correlationId },
          });
        });

      rxStomp.watchForReceipt(receiptId, () => {
        done();
      });
    });
  });

  it('Simple RPC', done => {
    // Watch for RPC response
    stompRPCService
      .rpc({ destination: myServiceEndPoint, body: 'Hello' })
      .subscribe((message: IMessage) => {
        expect(message.body).toBe('Echoing - Hello');
        done();
      });
  });

  it('Should not leak', done => {
    const numSubscribers = () => {
      return rxStompService.unhandledMessage$.observers.length;
    };

    const origNumSubcribers = numSubscribers();

    // Watch for RPC response
    stompRPCService
      .rpc({ destination: myServiceEndPoint, body: 'Hello' })
      .subscribe((message: IMessage) => {
        expect(message.body).toBe('Echoing - Hello');
        setTimeout(() => {
          expect(numSubscribers()).toBe(origNumSubcribers);
          done();
        }, 0);
      });

    expect(numSubscribers()).toBe(origNumSubcribers + 1);
  });
});
