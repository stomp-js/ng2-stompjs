// These are likely to fail on any broker other than RabbitMQ
import {StompService} from '../../../stomp.service';
import {defaultConfig, stompServiceFactory} from './stomp.service.factory';
import {ensureStompConnected} from './helpers';
import {Message} from '@stomp/stompjs';
import {StompRPCService} from '../../../..';
import {UUID} from 'angular2-uuid';

describe('Rabbit RPC', () => {
  const myServiceEndPoint = '/topic/echo';

  let stompService: StompService;
  let stompRPCService: StompRPCService;
  const stompConfig = defaultConfig();

  // Wait till STOMP Service is actually connected
  beforeAll(() => {
    stompService = stompServiceFactory(stompConfig);
    stompRPCService = new StompRPCService(stompService);
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
    stompRPCService.rpc(myServiceEndPoint, 'Hello').subscribe((message: Message) => {
      expect(message.body).toBe('Echoing - Hello');
      done();
    });
  });

  it('Should not leak', (done) => {
    let numSubscribers = () => {
      return stompService.defaultMessagesObservable.observers.length;
    };

    let origNumSubcribers = numSubscribers();

    // Watch for RPC response
    stompRPCService.rpc(myServiceEndPoint, 'Hello').subscribe((message: Message) => {
      expect(message.body).toBe('Echoing - Hello');
      setTimeout(() => {
        expect(numSubscribers()).toBe(origNumSubcribers);
        done();
      }, 0);
    });

    expect(numSubscribers()).toBe(origNumSubcribers + 1);
  });

});
