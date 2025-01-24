import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderStatus } from '@laminar-app/enums';
import { FiltersPayload, Order } from '@laminar-app/interfaces';
import { FilterService, OrdersService } from '@laminar-app/services';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-all-orders-list',
  standalone: false,
  templateUrl: './all-orders-list.component.html',
  styleUrl: './all-orders-list.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AllOrdersListComponent implements OnInit, OnDestroy {
  private _bottomSheet = inject(MatBottomSheet);

  displayedColumns: string[] = [
    'referenceId',
    'orderDate',
    'supplier',
    'status',
    'value',
    'actions',
  ];
  orders: Order[] = [];
  analytics: { totalCount: number; totalValue: number } = {
    totalCount: 0,
    totalValue: 0,
  };
  showSidebar = false;
  filterPayload: FiltersPayload = {
    status: {
      [OrderStatus.placed]: false,
      [OrderStatus.dispatched]: false,
      [OrderStatus.delivered]: false,
    },
    value: { min: 0, max: 0 },
    date: {
      min: new Date(),
      max: new Date(),
    },
  };
  filterConstraints: FiltersPayload = {
    status: {
      [OrderStatus.placed]: false,
      [OrderStatus.dispatched]: false,
      [OrderStatus.delivered]: false,
    },
    value: { min: 0, max: 0 },
    date: {
      min: new Date(),
      max: new Date(),
    },
  };

  OrderStatus = OrderStatus;

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: OrdersService,
    private _filterService: FilterService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          if (params?.['filters']?.length) {
            this.filterPayload = this._filterService.decodeQueryString(
              params?.['filters']
            );
            return this._service.getOrders(params['filters']);
          } else {
            return this._service.getOrders();
          }
        })
      )
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.orders = JSON.parse(JSON.stringify(data));
            this.analytics.totalCount = this.orders?.length;
            this.analytics.totalValue = this.orders?.reduce(
              (prev, curr) => prev + curr.totalValue,
              0
            );
          }
        },
      });

    this._filterService
      .getOrdersFilterConstraints()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.filterConstraints = {
              status: {
                [OrderStatus.placed]: data.statuses?.includes(
                  OrderStatus.placed
                ),
                [OrderStatus.dispatched]: data.statuses?.includes(
                  OrderStatus.dispatched
                ),
                [OrderStatus.delivered]: data.statuses?.includes(
                  OrderStatus.delivered
                ),
              },
              date: {
                min: data.oldest,
                max: data.newest,
              },
              value: {
                min: data.minValue,
                max: data.maxValue,
              },
            };

            this.filterPayload = {
              ...(this.filterPayload || {}),
              date: {
                min:
                  this.filterPayload?.date?.min === new Date()
                    ? data.oldest
                    : this.filterPayload?.date?.min,
                max:
                  this.filterPayload?.date?.max === new Date()
                    ? data.newest
                    : this.filterPayload?.date?.max,
              },
              value: {
                min: this.filterPayload?.value?.min || data.minValue,
                max: this.filterPayload?.value?.max || data.maxValue,
              },
            };
          }
        },
      });
  }

  openSidebar() {
    this.showSidebar = true;
  }

  applyFilters() {
    const filters = this._filterService.getQueryString(this.filterPayload);
    this._router
      .navigate([], {
        relativeTo: this._route,
        queryParams: { filters },
      })
      .then(() => this.closeSidebar());
  }

  clearFilters() {
    this._router
      .navigate(['/orders'], {
        relativeTo: this._route,
        replaceUrl: true,
        queryParams: { filters: null },
        queryParamsHandling: 'replace',
      })
      .then(() => this.closeSidebar());
  }

  closeSidebar() {
    this.showSidebar = false;
  }

  // exportAllOrders() {
  //   const exportData = this.orders?.map((order) => ({
  //     ID: order.id,
  //     Name: supplier.name,
  //     'Primary Contact Name': supplier.primaryContact.name,
  //     'Primary Contact Email': supplier.primaryContact.email,
  //     Designation: supplier.primaryContact.designation || '',
  //     'Phone Code': supplier.primaryContact.phone?.code || '',
  //     'Phone Number': supplier.primaryContact.phone?.number || '',
  //     Website: supplier.website || '',
  //     'Address Line 1': supplier.address?.addressLine1 || '',
  //     'Address Line 2': supplier.address?.addressLine2 || '',
  //     'Town/City': supplier.address?.townCity || '',
  //     'State/Province/County': supplier.address?.stateProvinceCounty || '',
  //     Country: supplier.address?.country || '',
  //     'Postal/Zip Code': supplier.address?.postalZipCode || '',
  //     'Maps Link': supplier.address?.mapsLink || '',
  //     Documents: this._formatDocuments(supplier.documents || []),
  //   }));

  //   const colsInfo: ColInfo[] = [
  //     { wch: 15 },
  //     { wch: 20 },
  //     { wch: 25 },
  //     { wch: 30 },
  //     { wch: 20 },
  //     { wch: 15 },
  //     { wch: 20 },
  //     { wch: 30 },
  //     { wch: 25 },
  //     { wch: 25 },
  //     { wch: 20 },
  //     { wch: 25 },
  //     { wch: 15 },
  //     { wch: 10 },
  //     { wch: 30 },
  //     { wch: 40 },
  //   ];

  //   const fileName = 'laminar-suppliers';
  //   this._excelExportService.exportToExcel(exportData, { colsInfo, fileName });
  // }

  // private _formatDocuments(documents: { name: string; url: string }[]): string {
  //   return documents?.map((doc) => `${doc.name}: ${doc.url}`).join('; ');
  // }

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];

  //   if (file) {
  //     const formData: FormData = new FormData();
  //     formData.append('file', file, file.name);

  //     let _supplierImportStats: {
  //       inserted: {
  //         count: number;
  //         names: string;
  //       };
  //       updated: { count: number };
  //     };
  //     this._service
  //       .importSuppliers(formData)
  //       .pipe(
  //         takeUntil(this.destroy$),
  //         switchMap((res) => {
  //           if (res) {
  //             _supplierImportStats = res;
  //             return this._service.getSuppliers();
  //           } else {
  //             throw new Error('Import failed');
  //           }
  //         }),
  //         takeUntil(this.destroy$) // Ensuring that the subscription to getSuppliers also respects destroy$
  //       )
  //       .subscribe({
  //         next: (data) => {
  //           if (data?.length) {
  //             this.suppliers = JSON.parse(JSON.stringify(data)); // Clone the data to avoid mutating
  //             this.dataSource = new MatTableDataSource(
  //               this.suppliers?.map((s) => ({
  //                 name: s.name || '',
  //                 email: s.primaryContact?.email || '',
  //                 country: s.address?.country || '',
  //                 id: s.id || '',
  //               }))
  //             );

  //             this._bottomSheet.open(SuppliersImportStatsComponent, {
  //               data: { ...(_supplierImportStats || {}), success: true },
  //             });
  //           }
  //         },
  //       });
  //   }
  // }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
