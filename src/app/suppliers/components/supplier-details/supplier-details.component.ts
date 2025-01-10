import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Supplier } from '../../../../interfaces/supplier.interface';
import { SuppliersService } from '../../../services/suppliers.service';

@Component({
    selector: 'app-supplier-details',
    templateUrl: './supplier-details.component.html',
    styleUrl: './supplier-details.component.css',
    standalone: false
})
export class SupplierDetailsComponent implements OnInit, OnDestroy {
  supplier: Supplier = {
    id: '',
    name: '',
    primaryContact: {
      name: '',
      email: '',
      phone: { code: '', number: '' },
      designation: '',
    },
    address: {
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      stateProvinceCounty: '',
      country: '',
      postalZipCode: '',
    },
  };
  countryOptions: { flag: string; name: string }[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: SuppliersService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['supplier']?.id) {
      this.supplier = JSON.parse(
        JSON.stringify(this._route.snapshot.data['supplier'])
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
    if (this.supplier?.id) {
      this._updateSupplier();
    } else {
      this._createSupplier();
    }
  }

  private _createSupplier() {
    this._service
      .createSupplier(this.supplier)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.supplier = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/suppliers']);
          }
        },
      });
  }

  private _updateSupplier() {
    this._service
      .updateSupplier(this.supplier)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.supplier = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/suppliers']);
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
