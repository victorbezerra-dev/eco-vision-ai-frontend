import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DetectionItem, DetectionResponse } from '../models/detection';

@Injectable({ providedIn: 'root' })
export class DetectionsService {
  private readonly API_URL = 'https://zhhrbj49-8000.brs.devtunnels.ms/';

  constructor(private http: HttpClient) {}

  getDetections(): Observable<DetectionItem[]> {
    return this.http.get<DetectionResponse>(this.API_URL + 'pontos').pipe(
      map(resp => resp?.data ?? [])
    );
  }
}
