import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly API_URL = 'https://zhhrbj49-8000.brs.devtunnels.ms/';

  constructor(private http: HttpClient) {}

  uploadZip(file: File): Observable<HttpEvent<any>> {
    const form = new FormData();
    form.append('file', file, file.name);

    const req = new HttpRequest('POST', this.API_URL, form, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
