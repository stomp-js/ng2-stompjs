/* tslint:disable:no-unused-variable */

import { filter } from 'rxjs/operators';
import { StompService, StompState, StompHeaders } from '../../../../../';

import { defaultConfig, MyStompService, stompServiceFactory } from './stomp.service.factory';
import { Message } from '@stomp/stompjs';
import { ensureStompConnected, disconnetStompRAndEnsure } from './helpers';

describe('StompService', () => {
  let stompService: StompService;
  const stompConfig = defaultConfig();

  // Wait till STOMP Service is actually connected
  beforeEach(() => {
    stompService = stompServiceFactory(stompConfig);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });

  // Disconnect and wait till it actually disconnects
  afterEach((done) => {
    disconnetStompRAndEnsure(stompService, done);
    stompService = null;
  });

  describe('Simple operations', () => {
    // Wait till STOMP Service is actually connected
    beforeEach((done) => {
      ensureStompConnected(stompService, done);
    });

    it('should already be connected', () => {
      expect(stompService.connected()).toBe(true);
    });

    it('send and receive a message', (done) => {

      const queueName = '/topic/ng-demo-sub';
      const msg = 'My very special message';

      // Subscribe and set up the Observable
      stompService.subscribe(queueName).subscribe((message: Message) => {
        expect(message.body).toBe(msg);
        done();
      });

      // Now publish to the same queue
      stompService.publish(queueName, msg);
    });
  });

  describe('Common Operations', () => {
    it('should be able to subscribe even before STOMP is connected', (done) => {
      const queueName = '/topic/ng-demo-sub01';
      const msg = 'My very special message 01';

      // Subscribe and set up the Observable, the underlying STOMP Service may not have been connected
      stompService.subscribe(queueName).subscribe((message: Message) => {
        expect(message.body).toBe(msg);
        done();
      });

      stompService.connectObservable.subscribe((state: StompState) => {
        // Now publish the message when STOMP Broker is connected
        stompService.publish(queueName, msg);
      });
    });

    xit('should be able to publish/subscribe even before STOMP is connected', (done) => {
      // Queue is a durable queue
      const queueName = '/queue/ng-demo-sub02';
      const msg = 'My very special message 02' + Math.random();

      // Subscribe and set up the Observable, the underlying STOMP Service may not have been connected
      stompService.subscribe(queueName).pipe(
        filter((message: Message) => {
          // Since the queue is durable, we may receive older messages as well, discard those
          return message.body === msg;
        })
      ).subscribe((message: Message) => {
        expect(message.body).toBe(msg);
        done();
      });

      stompService.publish(queueName, msg);
    });

    it('should be able to publish/subscribe when STOMP is disconnected', (done) => {
      // Queue is a durable queue
      const queueName = '/queue/ng-demo-sub02';
      const msg = 'My very special message 03' + Math.random();

      let firstTime = true;

      // Subscribe and set up the Observable, the underlying STOMP Service may not have been connected
      stompService.subscribe(queueName).pipe(
        filter((message: Message) => {
          // Since the queue is durable, we may receive older messages as well, discard those
          return message.body === msg;
        })
      ).subscribe((message: Message) => {
        expect(message.body).toBe(msg);
        done();
      });

      // Actively disconnect simulating error after STOMP connects, then publish the message
      stompService.connectObservable.subscribe((state: StompState) => {
        if (firstTime) {
          firstTime = false;

          (<MyStompService>stompService).forceDisconnect();

          setTimeout(() => {
            // Now publish the message when STOMP Broker has been disconnected
            stompService.publish(queueName, msg);
          }, 500);
        }
      });
    });

    it('should receive server headers', (done) => {
      stompService.serverHeadersObservable
        .subscribe((headers: StompHeaders) => {
          // Check that we have received at least one key in header
          expect(Object.keys(headers).length).toBeGreaterThan(0);

          // Subscribe again, we should get the same set of headers
          // (as per specifications, if STOMP has already connected it should immediately trigger)
          stompService.serverHeadersObservable
            .subscribe((headers1: StompHeaders) => {
              expect(headers1).toEqual(headers);
              done();
            });
        });
    });
  });
});
