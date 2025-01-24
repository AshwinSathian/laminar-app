import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderStatus } from '@laminar-app/enums';
import { environment } from '@laminar-app/environment';
import { FiltersPayload } from '@laminar-app/interfaces';
import * as LZString from 'lz-string';
import * as qs from 'qs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private _http: HttpClient) {}

  getQueryString(payload: FiltersPayload): string {
    return LZString.compressToEncodedURIComponent(qs.stringify(payload));
  }

  decodeQueryString(encodedFilters: string): FiltersPayload {
    if (!encodedFilters) {
      return {};
    }

    try {
      const decompressedString =
        LZString.decompressFromEncodedURIComponent(encodedFilters);
      if (decompressedString) {
        let payload = qs.parse(decompressedString) as FiltersPayload;

        if (payload.status?.PLACED === 'true') {
          payload.status.PLACED = true;
        } else {
          payload = {
            ...payload,
            status: { ...(payload.status || {}), [OrderStatus.placed]: false },
          };
        }

        if (payload.status?.DISPATCHED === 'true') {
          payload.status.DISPATCHED = true;
        } else {
          payload = {
            ...payload,
            status: {
              ...(payload.status || {}),
              [OrderStatus.dispatched]: false,
            },
          };
        }

        if (payload.status?.DELIVERED === 'true') {
          payload.status.DELIVERED = true;
        } else {
          payload = {
            ...payload,
            status: {
              ...(payload.status || {}),
              [OrderStatus.delivered]: false,
            },
          };
        }

        return payload;
      }
    } catch (error) {
      console.error('Failed to decode query string', error);
    }

    return {};
  }

  getOrdersFilterConstraints(): Observable<{
    statuses: OrderStatus[];
    oldest: Date;
    newest: Date;
    minValue: number;
    maxValue: number;
  }> {
    return this._http.get<{
      statuses: OrderStatus[];
      oldest: Date;
      newest: Date;
      minValue: number;
      maxValue: number;
    }>(`${environment.apiUrl}orders/filter-constraints`);
  }
}
