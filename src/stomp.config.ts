import { Injectable } from '@angular/core';
import { RxStompConfig } from "@stomp/rx-stomp";
/**
 * Represents a configuration object for the
 * STOMPService to connect to.
 */

@Injectable()
export class StompConfig extends RxStompConfig { }
