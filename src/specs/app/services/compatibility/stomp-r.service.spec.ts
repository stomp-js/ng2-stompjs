/* tslint:disable:no-unused-variable */

import { StompRService, StompState, StompConfig } from '../../../../../';

import { defaultConfig, MyStompRService } from './stomp.service.factory';
import { ensureStompConnected, disconnetStompRAndEnsure, ensureStompRDisconnected } from './helpers';

describe('StompRService', () => {
  let stompService: MyStompRService;
  const stompConfig: StompConfig = defaultConfig();

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });

  // Wait till STOMP Service is actually connected
  beforeEach((done) => {
    stompService = new MyStompRService();
    stompService.config = stompConfig;
    stompService.initAndConnect();
    ensureStompConnected(stompService, done);
  });

  // Disconnect and wait till it actually disconnects
  afterEach((done) => {
    ensureStompRDisconnected(stompService, done);
    stompService = null;
  });

  describe('should disconnect', () => {
    // Ask service to disconnect and wait for 500 ms (more than double
    // of reconnect delay)
    beforeEach((done) => {
      stompService.disconnect();
      setTimeout(() => { done(); }, 500);
    });

    it('and not reconnect', () => {
      expect(stompService.state.getValue()).toEqual(StompState.CLOSED);
    });
  });

  describe('should disconnect even when underlying connection is not there', () => {
    // Simulate error on Websocket and wait for while and call disconnect
    beforeEach((done) => {
      disconnetStompRAndEnsure(stompService, done);
    });

    // Ask service to disconnect and wait for 500 ms (more than double
    // of reconnect delay)
    beforeEach((done) => {
      stompService.disconnect();
      setTimeout(() => { done(); }, 500);
    });

    it('and not reconnect', () => {
      expect(stompService.state.getValue()).not.toEqual(StompState.CONNECTED);
    });
  });
});
