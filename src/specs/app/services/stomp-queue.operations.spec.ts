/* tslint:disable:no-unused-variable */

import { StompService} from '../../../..';
import { defaultConfig, stompServiceFactory } from './stomp.service.factory';
import { ensureStompConnected, disconnetStompRAndEnsure} from './helpers';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

describe('StompService Queues', () => {
  let stompService: StompService;
  const stompConfig = defaultConfig();

  // Wait till STOMP Service is actually connected
  beforeEach((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

    stompService = stompServiceFactory(stompConfig);
    ensureStompConnected(stompService, done);
  });

  // Disconnect and wait till it actually disconnects
  afterEach((done) => {
    disconnetStompRAndEnsure(stompService, done);
    stompService = null;
  });

  describe('should handle two simultaneous subscriptions', () => {
    const queueName1 = '/topic/ng-demo-sub01';
    const queueName2 = '/topic/ng-demo-sub02';

    let queSubscription1: Subscription;
    let queSubscription2: Subscription;

    const handlers = {
      handler1: () => {},
      handler2: () => {}
    };

    let spyHandler1: jasmine.Spy;
    let spyHandler2: jasmine.Spy;

    beforeEach(() => {
      spyHandler1 = spyOn(handlers, 'handler1');
      spyHandler2 = spyOn(handlers, 'handler2');
    });

    // Subscribe to both queues
    beforeEach((done) => {
      queSubscription1 = stompService.subscribe(queueName1)
        .map((message) => message.body)
        .subscribe(spyHandler1);
      queSubscription2 = stompService.subscribe(queueName2)
        .map((message) => message.body)
        .subscribe(spyHandler2);

      setTimeout(() => {
        done();
      }, 200);
    });

    // Send one message to each queue and verify that these are received in respective subscriptions
    beforeEach((done) => {
      stompService.publish(queueName1, 'Message 01-01');
      stompService.publish(queueName2, 'Message 02-01');

      setTimeout(() => {
        expect(spyHandler1).toHaveBeenCalledWith('Message 01-01');
        expect(spyHandler2).toHaveBeenCalledWith('Message 02-01');

        done();
      }, 200);
    });

    it('should receive message in correct queue', () => {
      // It is ensured by all beforeEach blocks
      expect(true).toBe(true);
    });

    describe('unsubscribe first queue', () => {
      beforeEach((done) => {
        queSubscription1.unsubscribe();
        setTimeout(() => {
          done();
        }, 200);
      });

      it('should not receive message in the first queue', (done) => {
        stompService.publish(queueName1, 'Message 01-02');
        stompService.publish(queueName2, 'Message 02-02');

        setTimeout(() => {
          expect(spyHandler1.calls.count()).toBe(1);
          expect(spyHandler2.calls.count()).toBe(2);

          done();
        }, 200);
      });
    });

    describe('unsubscribe second queue', () => {
      beforeEach((done) => {
        queSubscription2.unsubscribe();
        setTimeout(() => {
          done();
        }, 200);
      });

      it('should not receive message in the second queue', (done) => {
        stompService.publish(queueName1, 'Message 01-02');
        stompService.publish(queueName2, 'Message 02-02');

        setTimeout(() => {
          expect(spyHandler1.calls.count()).toBe(2);
          expect(spyHandler2.calls.count()).toBe(1);

          done();
        }, 200);
      });
    });

    describe('unsubscribe both queues', () => {
      beforeEach((done) => {
        queSubscription1.unsubscribe();
        queSubscription2.unsubscribe();
        setTimeout(() => {
          done();
        }, 200);
      });

      it('should not receive message in any of the  queues', (done) => {
        stompService.publish(queueName1, 'Message 01-02');
        stompService.publish(queueName2, 'Message 02-02');

        setTimeout(() => {
          expect(spyHandler1.calls.count()).toBe(1);
          expect(spyHandler2.calls.count()).toBe(1);

          done();
        }, 200);
      });
    });
  });
});
