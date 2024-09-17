import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BillOfMaterialsService } from '../../services/bill-of-materials.service';

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
