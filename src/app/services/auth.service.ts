import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const API_BASE_URL = `${environment.apiUrl}/auth/`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  login(
    email: string,
    password: string
  ): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        `${API_BASE_URL}login`,
        { email, password }
      )
      .pipe(
        tap((response) => {
          this.storeToken(response.accessToken, response.refreshToken);
        })
      );
  }

  private storeToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.tokenSubject.next(accessToken);
  }

  private loadToken(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.tokenSubject.next(null);
  }

  refreshToken(): Observable<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post<{ accessToken: string }>(`${API_BASE_URL}refresh`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          this.tokenSubject.next(response.accessToken);
        })
      );
  }
}
