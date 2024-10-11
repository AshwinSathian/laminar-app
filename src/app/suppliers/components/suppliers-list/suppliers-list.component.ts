import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ColInfo } from 'xlsx';
import { Supplier } from '../../../../interfaces/supplier.interface';
import { ExcelExportService } from '../../../services/excel-export.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { SuppliersImportStatsComponent } from './suppliers-import-stats/suppliers-import-stats.component';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrl: './suppliers-list.component.css',
})
export class SuppliersListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _bottomSheet = inject(MatBottomSheet);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'email', 'country', 'actions'];
  dataSource!: MatTableDataSource<{
    name: string;
    email: string;
    country: string;
    id: string;
  }>;
  suppliers: Supplier[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: SuppliersService,
    private _excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this._service
      .getSuppliers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.suppliers = JSON.parse(JSON.stringify(data));
            this.dataSource = new MatTableDataSource(
              this.suppliers?.map((s) => ({
                name: s.name || '',
                email: s.primaryContact?.email || '',
                country: s.address?.country || '',
                id: s.id || '',
              }))
            );
          }
        },
      });
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource?.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportAllSuppliers() {
    const exportData = this.suppliers?.map((supplier) => ({
      ID: supplier.id,
      Name: supplier.name,
      'Primary Contact Name': supplier.primaryContact.name,
      'Primary Contact Email': supplier.primaryContact.email,
      Designation: supplier.primaryContact.designation || '',
      'Phone Code': supplier.primaryContact.phone?.code || '',
      'Phone Number': supplier.primaryContact.phone?.number || '',
      Website: supplier.website || '',
      'Address Line 1': supplier.address?.addressLine1 || '',
      'Address Line 2': supplier.address?.addressLine2 || '',
      'Town/City': supplier.address?.townCity || '',
      'State/Province/County': supplier.address?.stateProvinceCounty || '',
      Country: supplier.address?.country || '',
      'Postal/Zip Code': supplier.address?.postalZipCode || '',
      'Maps Link': supplier.address?.mapsLink || '',
      Documents: this._formatDocuments(supplier.documents || []),
    }));

    const colsInfo: ColInfo[] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 25 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
      { wch: 30 },
      { wch: 40 },
    ];

    const fileName = 'laminar-suppliers';
    this._excelExportService.exportToExcel(exportData, { colsInfo, fileName });
  }

  private _formatDocuments(documents: { name: string; url: string }[]): string {
    return documents?.map((doc) => `${doc.name}: ${doc.url}`).join('; ');
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      let _supplierImportStats: {
        inserted: {
          count: number;
          names: string;
        };
        updated: { count: number };
      };
      this._service
        .importSuppliers(formData)
        .pipe(
          takeUntil(this.destroy$),
          switchMap((res) => {
            if (res) {
              _supplierImportStats = res;
              return this._service.getSuppliers();
            } else {
              throw new Error('Import failed');
            }
          }),
          takeUntil(this.destroy$) // Ensuring that the subscription to getSuppliers also respects destroy$
        )
        .subscribe({
          next: (data) => {
            if (data?.length) {
              this.suppliers = JSON.parse(JSON.stringify(data)); // Clone the data to avoid mutating
              this.dataSource = new MatTableDataSource(
                this.suppliers?.map((s) => ({
                  name: s.name || '',
                  email: s.primaryContact?.email || '',
                  country: s.address?.country || '',
                  id: s.id || '',
                }))
              );

              this._bottomSheet.open(SuppliersImportStatsComponent, {
                data: { ...(_supplierImportStats || {}), success: true },
              });
            }
          },
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
