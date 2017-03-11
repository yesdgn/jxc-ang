import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class MissionService {
  // Observable string sources
  private missionOnceAnnouncedSource = new Subject<any>();

  // Observable string streams
  missionOnceAnnounced$ = this.missionOnceAnnouncedSource.asObservable();

  // Service message commands
  announceOnceMission(mission: any) {
    this.missionOnceAnnouncedSource.next(mission);
  }

}
