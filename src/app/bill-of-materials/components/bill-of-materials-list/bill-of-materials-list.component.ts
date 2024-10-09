import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ColInfo } from 'xlsx';
import { BillOfMaterials } from '../../../../interfaces/bom.interface';
import { BillOfMaterialsService } from '../../../services/bill-of-materials.service';
import { ExcelExportService } from '../../../services/excel-export.service';

@Component({
  selector: 'app-bill-of-materials-list',
  templateUrl: './bill-of-materials-list.component.html',
  styleUrl: './bill-of-materials-list.component.css',
})
export class BillOfMaterialsListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'productName',
    'partCount',
    'totalCost',
    'actions',
  ];
  dataSource!: MatTableDataSource<{
    productName: string;
    partCount: number;
    currency: string;
    totalCost: number;
    id: string;
  }>;
  billOfMaterials: BillOfMaterials[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: BillOfMaterialsService,
    private _excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this._service
      .getBillsOfMaterials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.billOfMaterials = JSON.parse(JSON.stringify(data));
            this.dataSource = new MatTableDataSource(
              this.billOfMaterials?.map((s) => ({
                productName: s.productName || '',
                partCount: s.partCount || 0,
                currency: s.currency || '',
                totalCost: s.totalCost || 0,
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

  exportAllBillsOfMaterials() {
    const exportData = [];

    for (const bom of this.billOfMaterials || []) {
      exportData.push({
        ID: bom.id,
        'Product Name': bom.productName,
        'Contact Info': bom.contactInfo,
        'Approved By': bom.approvedBy,
        'Date of Approval': bom.dateOfApproval.toDateString(),
        'Part Count': bom.partCount,
        'Total Cost': bom.totalCost,
        Currency: bom.currency,
        'Part Number': '',
        'Part Name': '',
        'Material ID': '',
        Description: '',
        Quantity: '',
        Units: '',
        'Supplier/Manufacturer': '',
        'Unit Cost': '',
        'Total Part Cost': '',
        'Part Images': '',
      });

      for (const part of bom.parts || []) {
        exportData.push({
          ID: '',
          'Product Name': '',
          'Contact Info': '',
          'Approved By': '',
          'Date of Approval': '',
          'Part Count': '',
          'Total Cost': '',
          Currency: '',
          'Part Number': part.partNumber,
          'Part Name': part.partName,
          'Material ID': part.materialId,
          Description: part.description || '',
          Quantity: part.quantity,
          Units: part.units,
          'Supplier/Manufacturer': part.supplierOrManufacturer?.name || '',
          'Unit Cost': part.unitCost,
          'Total Part Cost': part.totalPartCost,
          'Part Images': (part.partImages || []).join('; '),
        });
      }

      exportData.push({});
    }

    const colsInfo: ColInfo[] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 30 },
      { wch: 10 },
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
    ];

    this._excelExportService.exportToExcel(exportData, { colsInfo });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
