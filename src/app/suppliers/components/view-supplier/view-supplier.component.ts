import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Material } from '../../../../interfaces/material.interface';
import { Supplier } from '../../../../interfaces/supplier.interface';
import { SuppliersService } from '../../../services/suppliers.service';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrl: './view-supplier.component.css',
})
export class ViewSupplierComponent implements OnInit, OnDestroy {
  supplier!: Supplier;
  materials: Material[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: SuppliersService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['supplier']?.id) {
      this.supplier = JSON.parse(
        JSON.stringify(this._route.snapshot.data['supplier'])
      );
    }

    this._service
      .getSupplierMaterials(this._route.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.materials = JSON.parse(JSON.stringify(data));
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
