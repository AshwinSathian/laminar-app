import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedService } from '@laminar-app/services';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [SharedService],
  standalone: true,
})
export class DashboardComponent {
  billsOfMaterialsCount$ = this._sharedService.getBillsOfMaterialsCount();
  materialsCount$ = this._sharedService.getMaterialsCount();
  ordersCount$ = this._sharedService.getOrdersCount();
  inventoryCount$ = this._sharedService.getInventoryCount();
  suppliersCount$ = this._sharedService.getSuppliersCount();

  constructor(private _sharedService: SharedService) {}
}
