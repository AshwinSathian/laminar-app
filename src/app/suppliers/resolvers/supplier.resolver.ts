import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SuppliersService } from '../../services/suppliers.service';

@Injectable()
export class SupplierResolver implements Resolve<any> {
  constructor(private _service: SuppliersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this._service.getSupplier(route.params['id']);
  }
}
