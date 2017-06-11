/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {StompService, StompState, StompConfig} from '../../../..';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {defaultConfig, MyStompService, stompServiceFactory} from './stomp.service.factory';
import {Message} from '@stomp/stompjs';

describe('StompService', () => {
  let stompService: StompService;

  // Wait till STOMP Service is actually connected
  beforeEach(() => {
    stompService = stompServiceFactory(defaultConfig());
  });

  // Disconnect and wait till it actually disconnects
  afterEach((done) => {
    stompService.state.subscribe((state: StompState) => {
      if (state === StompState.CLOSED) {
        stompService = null;
        done();
      }
    });

    stompService.disconnect();
  });

  describe('Simple operations', () => {
    // Wait till STOMP Service is actually connected
    beforeEach((done) => {
      stompService.connectObservable.subscribe((state: StompState) => {
        done();
      });
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

    it('should be able to publish/subscribe even before STOMP is connected', (done) => {
      // Queue is a durable queue
      const queueName = '/queue/ng-demo-sub02';
      const msg = 'My very special message 02' + Math.random();

      // Subscribe and set up the Observable, the underlying STOMP Service may not have been connected
      stompService.subscribe(queueName).filter((message: Message) => {
        // Since the queue is durable, we may receive older messages as well, discard those
        return message.body === msg;
      }).subscribe((message: Message) => {
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
      stompService.subscribe(queueName).filter((message: Message) => {
        // Since the queue is durable, we may receive older messages as well, discard those
        return message.body === msg;
      }).subscribe((message: Message) => {
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
          }, 100);
        }
      });
    });
  });
});
