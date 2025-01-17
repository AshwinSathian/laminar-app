import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Order } from '@laminar-app/interfaces';
import { OrdersService } from '@laminar-app/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-all-orders-list',
  standalone: false,
  templateUrl: './all-orders-list.component.html',
  styleUrl: './all-orders-list.component.css',
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

  destroy$ = new Subject<boolean>();

  constructor(private _service: OrdersService) {}

  ngOnInit(): void {
    this._service
      .getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.orders = JSON.parse(JSON.stringify(data));
          }
        },
      });
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
