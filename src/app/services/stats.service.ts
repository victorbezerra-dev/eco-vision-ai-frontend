import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClusterStats } from '../models/stats';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly baseUrl = 'https://zhhrbj49-8000.brs.devtunnels.ms';
  private readonly endpoint = `${this.baseUrl}/stats`;

  constructor(private http: HttpClient) {}


  fetchStats(): Observable<ClusterStats[]> {
    let httpParams = new HttpParams();

    return this.http.get<ClusterStats[]>(this.endpoint, { params: httpParams }).pipe(
      map(arr => Array.isArray(arr) ? arr : [])
    );
  }

}
