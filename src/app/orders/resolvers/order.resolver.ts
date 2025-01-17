import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { OrdersService } from '@laminar-app/services';

@Injectable()
export class OrderResolver implements Resolve<any> {
  constructor(private _service: OrdersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this._service.getOrder(route.params['id']);
  }
}
