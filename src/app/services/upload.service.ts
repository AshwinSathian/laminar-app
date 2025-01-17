import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { Attachment } from '@laminar-app/interfaces';
import { Observable } from 'rxjs';

const API_BASE_URL = `${environment.apiUrl}upload`;

@Injectable()
export class UploadService {
  constructor(private _http: HttpClient) {}

  uploadFile(file: File): Observable<Attachment> {
    const _formData = new FormData();
    _formData.append('file', file);

    return this._http.post<Attachment>(API_BASE_URL, _formData, {
      headers: { 'X-Skip-Loading': 'true' },
    });
  }
}
