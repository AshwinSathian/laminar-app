import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Inventory } from '../../../../interfaces/inventory.interface';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrl: './inventory-details.component.css',
})
export class InventoryDetailsComponent implements OnInit, OnDestroy {
  inventory: Inventory = {
    id: '',
    itemId: '',
    description: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      stateProvinceCounty: '',
      country: '',
      postalZipCode: '',
      mapsLink: '',
    },
  };
  countryOptions: { flag: string; name: string }[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: InventoryService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['inventory']?.id) {
      this.inventory = JSON.parse(
        JSON.stringify(this._route.snapshot.data['inventory'])
      );
    }

    this._service
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.countryOptions = data
              .map((d) => ({
                flag: d.flags.png,
                name: d.name.common,
              }))
              ?.sort((a, b) => a.name.localeCompare(b.name));
          }
        },
      });
  }

  submit() {
    if (this.inventory?.id) {
      this._updateInventory();
    } else {
      this._createInventory();
    }
  }

  private _createInventory() {
    this._service
      .createInventory(this.inventory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.inventory = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/inventory']);
          }
        },
      });
  }

  private _updateInventory() {
    this._service
      .updateInventory(this.inventory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.inventory = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/inventory']);
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
