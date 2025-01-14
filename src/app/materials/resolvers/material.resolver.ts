import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { MaterialsService } from '@laminar-app/services';
import { Observable } from 'rxjs';

@Injectable()
export class MaterialResolver implements Resolve<any> {
  constructor(private _service: MaterialsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this._service.getMaterial(route.params['id']);
  }
}
