// Helper functions
import {StompService, StompState} from '../../../..';

export function ensureStompConnected(stompService: StompService, done) {
  stompService.connectObservable.subscribe((state: StompState) => {
    done();
  });
}

export function  ensureStompDisconnected(stompService: StompService, done) {
  stompService.state.subscribe((state: StompState) => {
    if (state === StompState.CLOSED) {
      stompService = null;
      done();
    }
  });

  stompService.disconnect();
}
