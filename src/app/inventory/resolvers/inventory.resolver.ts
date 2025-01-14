import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { InventoryService } from '@laminar-app/services';
import { Observable } from 'rxjs';

@Injectable()
export class InventoryResolver implements Resolve<any> {
  constructor(private _service: InventoryService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this._service.getInventory(route.params['id']);
  }
}
