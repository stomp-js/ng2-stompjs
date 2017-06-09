// These are likely to fail on any broker other than RabbitMQ
import {StompService} from '../../../stomp.service';
import {defaultConfig, stompServiceFactory} from './stomp.service.factory';
import {ensureStompConnected} from './helpers';
import {Message} from '@stomp/stompjs';
import {RabbitRPCService} from '../../../..';

describe('Rabbit RPC', () => {
  const myServiceEndPoint = '/topic/echo';

  let stompService: StompService;
  let rabbitRPCService: RabbitRPCService;
  const stompConfig = defaultConfig();

  // Wait till STOMP Service is actually connected
  beforeAll(() => {
    stompService = stompServiceFactory(stompConfig);
    rabbitRPCService = new RabbitRPCService(stompService);
  });

  // Wait till STOMP Service is actually connected
  beforeAll((done) => {
    ensureStompConnected(stompService, done);
  });

  beforeAll((done) => {
    stompService.subscribe(myServiceEndPoint).subscribe((message: Message) => {
      const replyTo = message.headers['reply-to'];
      const correlationId = message.headers['correlation-id'];
      const incomingMessage = message.body;

      const outgoingMessage = 'Echoing - ' + incomingMessage;
      stompService.publish(replyTo, outgoingMessage, {'correlation-id' : correlationId});
    });

    // Wait for a second to ensure that subscription has been effected at the broker
    setTimeout(() => {
      done();
    }, 1000);
  });

  it('Simple RPC', (done) => {
    // Watch for RPC response
    rabbitRPCService.rpc(myServiceEndPoint, 'Hello').subscribe((message: Message) => {
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
    rabbitRPCService.rpc(myServiceEndPoint, 'Hello').subscribe((message: Message) => {
      expect(message.body).toBe('Echoing - Hello');
      setTimeout(() => {
        expect(numSubscribers()).toBe(origNumSubcribers);
        done();
      }, 0);
    });

    expect(numSubscribers()).toBe(origNumSubcribers + 1);
  });

});
