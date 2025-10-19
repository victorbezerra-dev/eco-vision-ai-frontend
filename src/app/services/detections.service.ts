import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DetectionItem, DetectionResponse } from '../models/detection';

@Injectable({ providedIn: 'root' })
export class DetectionsService {
  private readonly API_URL = 'http://localhost:8000/pontos';

  constructor(private http: HttpClient) {}

  getDetections(): Observable<DetectionItem[]> {
    return this.http.get<DetectionResponse>(this.API_URL + '').pipe(
      map(resp => resp?.data ?? [])
    );
  }
}
