import {InjectableRxStompConfig} from './injectable-rx-stomp-config';
import {RxStompService} from './rx-stomp.service';
import {TestBed} from '@angular/core/testing';

export function rxStompServiceFactory(rxStompConfig: InjectableRxStompConfig): RxStompService {
  const rxStompService = new RxStompService();

  rxStompService.configure(TestBed.get(InjectableRxStompConfig));
  rxStompService.activate();

  return rxStompService;
}
