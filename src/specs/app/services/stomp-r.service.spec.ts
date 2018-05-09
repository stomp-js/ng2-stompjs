/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StompRService, StompService, StompState, StompConfig } from '../../../..';
import { Observable } from 'rxjs';

import {defaultConfig, MyStompRService, MyStompService, stompServiceFactory} from './stomp.service.factory';
import { Message } from '@stomp/stompjs';
import {ensureStompConnected, disconnetStompRAndEnsure, ensureStompRDisconnected} from './helpers';
import { StompHeaders } from '../../../stomp-headers';

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
    // Ask service to disconnect and wait for 2200 ms (more than double
    // of reconnect delay)
    beforeEach((done) => {
      stompService.disconnect();
      setTimeout(() => { done(); }, 2200);
    });

    it('and not reconnect', () => {
      expect(stompService.state.getValue()).toEqual(StompState.CLOSED);
    });
  });

  describe('should disconnect even when underlying connection is not there', () => {
    // Simulate error on Websocket and wait for while and call disconnect
    beforeEach((done) => {
      stompService.forceDisconnect();
      disconnetStompRAndEnsure(stompService, done);
    });

    // Ask service to disconnect and wait for 2200 ms (more than double
    // of reconnect delay)
    beforeEach((done) => {
      stompService.disconnect();
      setTimeout(() => { done(); }, 2200);
    });

    it('and not reconnect', () => {
      expect(stompService.state.getValue()).toEqual(StompState.CLOSED);
    });
  });
});
