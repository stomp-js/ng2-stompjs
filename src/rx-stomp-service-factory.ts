import {InjectableRxStompConfig} from './injectable-rx-stomp-config';
import {RxStompService} from './rx-stomp.service';

export function rxStompServiceFactory(rxStompConfig: InjectableRxStompConfig): RxStompService {
  const rxStompService = new RxStompService();

  rxStompService.configure(rxStompConfig);
  rxStompService.activate();

  return rxStompService;
}
