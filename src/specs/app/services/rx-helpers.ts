/* tslint:disable:no-unused-variable */

// Helper functions
import { RxStomp, RxStompState } from '@stomp/rx-stomp';

export const defaultRxStompConfig = {
  // Which server?
  brokerURL: 'ws://127.0.0.1:15674/ws',

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 0, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnectDelay: 200,

  // Will log diagnostics on console
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
};

export function ensureRxStompConnected(rxStomp: RxStomp, done: any) {
  rxStomp.connected$.subscribe((state: RxStompState) => {
    done();
  });
}

export function ensureRxStompDisconnected(rxStomp: RxStomp, done: any) {
  rxStomp.connectionState$.subscribe((state: RxStompState) => {
    if (state === RxStompState.CLOSED) {
      done();
    }
  });
}

export function disconnectRxStompAndEnsure(rxStomp: RxStomp, done: any) {
  rxStomp.deactivate();
  ensureRxStompDisconnected(rxStomp, done);
}
