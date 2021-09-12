import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { School } from '../models/school';

@Injectable()
export class SchoolService {

  constructor(private httpClient: HttpClient) { }

  getSchools(): Observable<School[]> {
    return this.httpClient.get<School[]>(`${environment.api.baseUrl}/school`, { params: { limit: 5 } });
  }

  getSchoolsNearMe(latitude: number, longitude: number): Observable<School[]> {
    return this.httpClient.get<School[]>(`${environment.api.baseUrl}/school/near-me`, { params: { latitude, longitude } });
  }
}
