import {Injectable} from '@angular/core';
import {RxStompConfig} from '@stomp/rx-stomp';

@Injectable()
export class InjectableRxStompConfig extends RxStompConfig { }
