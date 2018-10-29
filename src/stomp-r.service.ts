import {Injectable} from '@angular/core';

import {RxStomp} from "@stomp/rx-stomp";

/**
 * Angular2 STOMP Raw Service using @stomp/stomp.js
 *
 * You will only need the public properties and
 * methods listed unless you are an advanced user. This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 *
 * If you will like to pass the configuration as a dependency,
 * please use StompService class.
 */
@Injectable()
export class StompRService extends RxStomp { }
