import { StompConfig } from './stomp.config';
import { StompRService } from './stomp-r.service';
/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * **This class has been deprecated in favor of {@link RxStompService} with {@link rxStompServiceFactory}.
 * It will be dropped `@stomp/ng2-stompjs@8.x.x`.**
 *
 * Angular2 STOMP Service using @stomp/stomp.js
 *
 * @description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 *
 * If you want to manually configure and initialize the service
 * please use StompRService
 */
export declare class StompService extends StompRService {
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     */
    constructor(config: StompConfig);
}
