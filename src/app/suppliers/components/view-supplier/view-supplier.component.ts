import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Material, Order, Supplier } from '@laminar-app/interfaces';
import { SuppliersService } from '@laminar-app/services';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from '../../../services/breakpoint.service';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrl: './view-supplier.component.css',
  standalone: false,
})
export class ViewSupplierComponent implements OnInit, OnDestroy {
  supplier!: Supplier;
  materials: Material[] = [];
  orders: Order[] = [];
  ordersDisplayColumns: string[] = [
    'referenceId',
    'orderDate',
    'status',
    'value',
  ];

  isMobile$ = this._breakpointService.isMobile$;
  destroy$ = new Subject<boolean>();

  constructor(
    private _service: SuppliersService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _breakpointService: BreakpointService
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
            for (const material of this.materials) {
              material.suppliers = material.suppliers?.map(
                (stringifiedElement) => {
                  try {
                    const jsonString = stringifiedElement
                      .replace(/'/g, '"')
                      .replace(/new ObjectId/g, '');
                    return JSON.parse(jsonString);
                  } catch (error) {
                    return null;
                  }
                }
              );
            }
          }
        },
      });

    this._service
      .getSupplierOrders(this._route.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.orders = JSON.parse(JSON.stringify(data));
          }
        },
      });
  }

  deleteSupplier() {
    this._service
      .deleteSupplier(this._route.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
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
