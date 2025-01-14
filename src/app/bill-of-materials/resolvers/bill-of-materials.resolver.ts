import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { BillOfMaterialsService } from '@laminar-app/services';
import { Observable } from 'rxjs';

@Injectable()
export class BillOfMaterialsResolver implements Resolve<any> {
  constructor(private _service: BillOfMaterialsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this._service.getBillOfMaterials(route.params['id']);
  }
}
