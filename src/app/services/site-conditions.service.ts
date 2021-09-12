import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, switchMap, take, delay } from 'rxjs/operators';

@Injectable()
export class SiteConditionsService {
  // _center = new BehaviorSubject<number[]>(null); // works
  _center = new BehaviorSubject<number[]>([39.5504, -98.0622]); // doesn't work
  _heading = new BehaviorSubject<number>(0);

  center$ = this._center.asObservable();
  heading$ = this._heading.asObservable();

  constructor() {
    this.getInitialCenter(0).subscribe((initialCenter: number[]) => {
      this._center.next(initialCenter);
    })
  }

  getInitialCenter(reportId: number): Observable<number[]> {
    // would come from HTTP service
    const center = [39.5504, -98.0622];
    return from([center]).pipe(delay(2000));
  }
}
