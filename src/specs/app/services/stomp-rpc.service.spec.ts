// These are likely to fail on any broker other than RabbitMQ
import {defaultConfig, stompServiceFactory} from './compatibility/stomp.service.factory';
import {ensureStompConnected} from './compatibility/helpers';
import {Message} from '@stomp/stompjs';
import {StompService, RxStompRPCService} from '../../../..';
import {UUID} from 'angular2-uuid';

describe('Rabbit RPC', () => {
  const myServiceEndPoint = '/topic/echo';

  let stompService: StompService;
  let stompRPCService: RxStompRPCService;
  const stompConfig = defaultConfig();

  // Wait till STOMP Service is actually connected
  beforeAll(() => {
    stompService = stompServiceFactory(stompConfig);
    stompRPCService = new RxStompRPCService(stompService);
  });

  // Wait till STOMP Service is actually connected
  beforeAll((done) => {
    ensureStompConnected(stompService, done);
  });

  beforeAll((done) => {
    const receiptId = UUID.UUID();

    stompService.subscribe(myServiceEndPoint, {receipt: receiptId}).subscribe((message: Message) => {
      const replyTo = message.headers['reply-to'];
      const correlationId = message.headers['correlation-id'];
      const incomingMessage = message.body;

      const outgoingMessage = 'Echoing - ' + incomingMessage;
      stompService.publish(replyTo, outgoingMessage, {'correlation-id' : correlationId});
    });

    stompService.waitForReceipt(receiptId, () => {
      done();
    });
  });

  it('Simple RPC', (done) => {
    // Watch for RPC response
    stompRPCService.rpc({destination: myServiceEndPoint, body: 'Hello'}).subscribe((message: Message) => {
      expect(message.body).toBe('Echoing - Hello');
      done();
    });
  });

  it('Should not leak', (done) => {
    const numSubscribers = () => {
      return stompService.defaultMessagesObservable.observers.length;
    };

    const origNumSubcribers = numSubscribers();

    // Watch for RPC response
    stompRPCService.rpc({destination: myServiceEndPoint, body: 'Hello'}).subscribe((message: Message) => {
      expect(message.body).toBe('Echoing - Hello');
      setTimeout(() => {
        expect(numSubscribers()).toBe(origNumSubcribers);
        done();
      }, 0);
    });

    expect(numSubscribers()).toBe(origNumSubcribers + 1);
  });

});
