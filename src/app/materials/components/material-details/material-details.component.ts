import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Material } from '../../../../interfaces/material.interface';
import { MaterialsService } from '../../../services/materials.service';
import { MatOption } from '@angular/material/core';
import { Supplier } from '../../../../interfaces/supplier.interface';

@Component({
    selector: 'app-material-details',
    templateUrl: './material-details.component.html',
    styleUrl: './material-details.component.css',
    standalone: false
})
export class MaterialDetailsComponent implements OnInit, OnDestroy {
  material: Material = {
    id: '',
    partName: '',
    images: [],
    material: '',
    manufacturingMethod: '',
    drawings: [],
    dimensions: {
      length: '',
      breadth: '',
      height: '',
    },
    weight: '',
    dataSheets: [],
    suppliers: [],
  };
  supplierOptions: Supplier[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: MaterialsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['material']?.id) {
      this.material = JSON.parse(
        JSON.stringify(this._route.snapshot.data['material'])
      );
    }

    this._service
      .getSuppliers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.supplierOptions = data;
          }
        },
      });
  }

  supplierCompareFunction = (option: Supplier, value: Supplier): boolean => {
    return option.id === value.id;
  };

  submit() {
    if (this.material?.id) {
      this._updateMaterial();
    } else {
      this._createMaterial();
    }
  }

  private _createMaterial() {
    this._service
      .createMaterial(this.material)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.material = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/materials']);
          }
        },
      });
  }

  private _updateMaterial() {
    this._service
      .updateMaterial(this.material)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.material = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/materials']);
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
