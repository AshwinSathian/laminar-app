import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private _http: HttpClient, private apollo: Apollo) {}

  getCurrencies(): Observable<{ [code: string]: string }> {
    return this._http.get<{ [code: string]: string }>(
      'https://openexchangerates.org/api/currencies.json'
    );
  }

  getCountries(): Observable<any[]> {
    return this._http.get<any[]>('https://restcountries.com/v3.1/all');
  }

  getBillsOfMaterialsCount(): Observable<number> {
    return this._http.get<number>(
      `${environment.apiUrl}bill-of-materials/count`
    );
  }

  getMaterialsCount(): Observable<number> {
    return this._http.get<number>(`${environment.apiUrl}materials/count`);
  }

  getOrdersCount(): Observable<number> {
    return this.apollo
      .query<{ getOrderCount: number }>({
        query: gql`
          query {
            getOrderCount
          }
        `,
      })
      .pipe(map((result) => result.data.getOrderCount));
  }

  getInventoryCount(): Observable<number> {
    return this._http.get<number>(`${environment.apiUrl}inventory/count`);
  }

  getSuppliersCount(): Observable<number> {
    return this._http.get<number>(`${environment.apiUrl}suppliers/count`);
  }
}
