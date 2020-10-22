import { RxStompConfig } from '@stomp/rx-stomp';
/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * This class is Injectable version of {@link RxStompConfig} with exactly same functionality.
 * Please see {@link RxStompConfig} for details.
 *
 * See: {@link /guide/ng2-stompjs/ng2-stomp-with-angular7.html}
 * for a step-by-step guide.
 *
 * If all fields of configuration are fixed and known in advance you would typically define
 * a `const` and inject it using value.
 *
 * If some fields will be known by later, it can be injected using a factory function.
 *
 * Occasionally it may need to be combined with Angular's APP_INITIALIZER mechanism.
 */
export declare class InjectableRxStompConfig extends RxStompConfig {
}
