/* tslint:disable:no-unused-variable */

import {StompService, StompConfig} from '../../../..';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as SockJS from 'sockjs-client';


export function socketProvider() {
  // See below (url property of defaultConfig)
  return new SockJS('http://127.0.0.1:15674/stomp');
}

export function defaultConfig(): StompConfig {
  return {
    // Which server?
    url: 'ws://127.0.0.1:15674/ws',

    // Comment above and uncomment below to test with SockJS
    // url: socketProvider,

    // Headers
    // Typical keys: login, passcode, host
    headers: {
      login: 'guest',
      passcode: 'guest'
    },

    // How often to heartbeat?
    // Interval in milliseconds, set to 0 to disable
    heartbeat_in: 0, // Typical value 0 - disabled
    heartbeat_out: 0, // Typical value 20000 - every 20 seconds

    // Wait in milliseconds before attempting auto reconnect
    // Set to 0 to disable
    // Typical value 5000 (5 seconds)
    reconnect_delay: 1000,

    // Will log diagnostics on console
    debug: true
  };
}

export class MyStompService extends StompService {
  constructor(private _conf: StompConfig) {
    super(_conf);
  }

  /**
   * This method closes the underlying WebSocket, simulating a close due to an error
   */
  public forceDisconnect(): void {
    this.client.ws.close();
  }
}

export function stompServiceFactory(_conf: StompConfig) {
  return new MyStompService(_conf);
}
