import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { defaultRxStompConfig, disconnectRxStompAndEnsure } from './rx-helpers';
import { RxStompService } from '../../../app/rx-stomp.service';
import { InjectableRxStompConfig, rxStompServiceFactory } from '../../../../';

describe('RxStompService', () => {
  let rxStompService: RxStompService;

  describe('Raw', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [RxStompService],
      });

      rxStompService = TestBed.get(RxStompService);
    });

    afterEach(done => {
      disconnectRxStompAndEnsure(rxStompService, done);
    });

    it('should be created', () => {
      expect(rxStompService).toBeTruthy();
    });

    it('should connect', done => {
      rxStompService.configure(defaultRxStompConfig);
      rxStompService.activate();

      rxStompService.connected$.pipe(take(1)).subscribe(() => {
        done();
      });
    });
  });

  describe('Pre configured', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: RxStompService,
            useFactory: rxStompServiceFactory,
            deps: [InjectableRxStompConfig],
          },
          {
            provide: InjectableRxStompConfig,
            useValue: defaultRxStompConfig,
          },
        ],
      });

      rxStompService = TestBed.get(RxStompService);
    });

    afterEach(done => {
      disconnectRxStompAndEnsure(rxStompService, done);
    });

    it('should be created', () => {
      expect(rxStompService).toBeTruthy();
    });

    it('should connect', done => {
      rxStompService.connected$.pipe(take(1)).subscribe(() => {
        done();
      });
    });
  });
});
