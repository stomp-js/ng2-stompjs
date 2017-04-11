import { Injectable } from '@angular/core';

import { StompConfig } from './stomp.config';
import {Observable} from 'rxjs/Observable';

/**
 * An injected class which grabs the application
 * config variables (e.g. STOMP credentials)
 * for the user application.
 *
 * This makes an AJAX request to the server
 * api containing some user token and secret
 *
 * @type StompConfigService
 */
@Injectable()
export class StompConfigService {

  /** Constructor */
  constructor() { }


  /** Make an http request for a config file, and
    * return a Promise for its resolution.
    */
  public get(): Observable<StompConfig> {
    // const path = '/src/api/config.json';
    // return this._http.get(path)
    //   .map(res => res.json());
    return Observable.of({});
  }
}
