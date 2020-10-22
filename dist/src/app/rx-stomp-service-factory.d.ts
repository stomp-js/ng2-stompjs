import { InjectableRxStompConfig } from './injectable-rx-stomp-config';
import { RxStompService } from './rx-stomp.service';
/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * This is factory function that can create {@link RxStompService}
 * when configuration is already known.
 * You can use this function for defining provider for {@link RxStompService}.
 * {@link RxStompService} created using this function is configured and activated.
 * This provides the simplest mechanism to define {@link RxStompService} for Dependency Injection.
 *
 * See: {@link /guide/ng2-stompjs/ng2-stomp-with-angular7.html}
 * for a step-by-step guide.
 */
export declare function rxStompServiceFactory(rxStompConfig: InjectableRxStompConfig): RxStompService;
