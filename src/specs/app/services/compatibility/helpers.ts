/* tslint:disable:no-unused-variable */

// Helper functions
import {StompRService, StompState} from '../../../../../';

export function ensureStompConnected(stompService: StompRService, done) {
  stompService.connectObservable.subscribe((state: StompState) => {
    done();
  });
}

export function ensureStompRDisconnected (stompService: StompRService, done) {
  stompService.state.subscribe((state: StompState) => {
    if (state === StompState.CLOSED) {
      done();
    }
  });
}

export function  disconnetStompRAndEnsure(stompService: StompRService, done) {
  stompService.disconnect();
  ensureStompRDisconnected(stompService, done);
}
