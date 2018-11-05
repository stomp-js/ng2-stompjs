import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';

/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * This class is Injectable version of {@link RxStomp} with exactly same functionality.
 * Please see {@link RxStomp} for details.
 *
 * See: {@link /guide/ng2-stompjs/2018/11/04/ng2-stomp-with-angular7.html}
 * for a step-by-step guide.
 *
 * See also {@link rxStompServiceFactory}.
 */
@Injectable()
export class RxStompService extends RxStomp { }
