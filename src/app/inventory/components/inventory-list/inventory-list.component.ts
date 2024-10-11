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
import { Inventory } from '../../../../interfaces/inventory.interface';
import { ExcelExportService } from '../../../services/excel-export.service';
import { InventoryService } from '../../../services/inventory.service';
import { InventoriesImportStatsComponent } from './inventories-import-stats/inventories-import-stats.component';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css',
})
export class InventoryListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _bottomSheet = inject(MatBottomSheet);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['itemId', 'description', 'actions'];
  dataSource!: MatTableDataSource<{
    itemId: string;
    description: string;
    id: string;
  }>;
  inventoryEntries: Inventory[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: InventoryService,
    private _excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this._service
      .getInventories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.inventoryEntries = JSON.parse(JSON.stringify(data));
            this.dataSource = new MatTableDataSource(
              this.inventoryEntries?.map((i) => ({
                itemId: i.itemId || '',
                description: i.description || '',
                id: i.id || '',
              }))
            );
          }
        },
      });
  }

  ngAfterViewInit(): void {
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

  exportAllInventory() {
    const exportData = this.inventoryEntries?.map((inventory) => ({
      ID: inventory.id,
      'Item Name/ID': inventory.itemId,
      Description: inventory.description || '',
      'Address Line 1': inventory.address.addressLine1 || '',
      'Address Line 2': inventory.address.addressLine2 || '',
      'Town/City': inventory.address.townCity || '',
      'State/Province/County': inventory.address.stateProvinceCounty || '',
      Country: inventory.address.country || '',
      'Postal/Zip Code': inventory.address.postalZipCode || '',
      'Maps Link': inventory.address?.mapsLink || '',
      Notes: inventory.notes || '',
    }));

    const colsInfo: ColInfo[] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
    ];

    const fileName = 'laminar-inventory-list';
    this._excelExportService.exportToExcel(exportData, { colsInfo, fileName });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      let _inventoryImportStats: {
        inserted: {
          count: number;
          names: string;
        };
        updated: { count: number };
      };
      this._service
        .importInventories(formData)
        .pipe(
          takeUntil(this.destroy$),
          switchMap((res) => {
            if (res) {
              _inventoryImportStats = res;
              return this._service.getInventories();
            } else {
              throw new Error('Import failed');
            }
          }),
          takeUntil(this.destroy$) // Ensuring that the subscription to getInventories also respects destroy$
        )
        .subscribe({
          next: (data) => {
            if (data?.length) {
              this.inventoryEntries = JSON.parse(JSON.stringify(data));
              this.dataSource = new MatTableDataSource(
                this.inventoryEntries?.map((i) => ({
                  itemId: i.itemId || '',
                  description: i.description || '',
                  id: i.id || '',
                }))
              );

              this._bottomSheet.open(InventoriesImportStatsComponent, {
                data: { ...(_inventoryImportStats || {}), success: true },
              });
            }
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
