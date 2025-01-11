import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_BASE_URL = `${environment.apiUrl}upload`;

@Injectable()
export class UploadService {
  constructor(private _http: HttpClient) {}

  uploadFile(
    file: File
  ): Observable<{ fileUrl: string; fileName: string; fileType: string }> {
    const _formData = new FormData();
    _formData.append('file', file);

    return this._http.post<{
      fileUrl: string;
      fileName: string;
      fileType: string;
    }>(API_BASE_URL, _formData, {
      headers: { 'X-Skip-Loading': 'true' },
    });
  }
}
