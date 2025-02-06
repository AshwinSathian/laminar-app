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
import { ActivatedRoute, Router } from '@angular/router';
import { BillOfMaterials, PartDetail } from '@laminar-app/interfaces';
import {
  BillOfMaterialsService,
  ExcelExportService,
} from '@laminar-app/services';
import { Subject, takeUntil } from 'rxjs';
import { ColInfo } from 'xlsx';
import { BreakpointService } from '../../../services/breakpoint.service';

@Component({
  selector: 'app-view-bill-of-materials',
  templateUrl: './view-bill-of-materials.component.html',
  styleUrl: './view-bill-of-materials.component.css',
  standalone: false,
})
export class ViewBillOfMaterialsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'partNumber',
    'partName',
    'description',
    'quantity',
    'supplierOrManufacturer',
    'unitCost',
    'totalPartCost',
  ];
  dataSource!: MatTableDataSource<{
    partNumber: string;
    partName: string;
    description: string;
    quantity: string;
    supplierOrManufacturer: string;
    unitCost: number;
    totalPartCost: number;
    currency: string;
    materialId: string;
  }>;
  billOfMaterials!: BillOfMaterials;

  isMobile$ = this._breakpointService.isMobile$;
  destroy$ = new Subject<boolean>();

  constructor(
    private _service: BillOfMaterialsService,
    private _excelExportService: ExcelExportService,
    private _breakpointService: BreakpointService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['billOfMaterials']?.id) {
      this.billOfMaterials = JSON.parse(
        JSON.stringify(this._route.snapshot.data['billOfMaterials'])
      );
      this.dataSource = new MatTableDataSource(
        this.billOfMaterials.parts?.map((p: PartDetail) => ({
          partNumber: p.partNumber,
          partName: p.partName,
          description: p.description || '',
          quantity: `${p.quantity} ${p.units}`,
          supplierOrManufacturer: p.supplierOrManufacturer?.name || '',
          unitCost: p.unitCost,
          totalPartCost: p.totalPartCost,
          currency: this.billOfMaterials.currency,
          materialId: p.materialId,
        }))
      );
    }
  }

  deleteBillOfMaterials() {
    this._service
      .deleteBillOfMaterials(this._route.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this._router.navigate(['/bill-of-materials']);
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

  exportBillOfMaterials() {
    const exportData = [];

    exportData.push({
      ID: this.billOfMaterials.id,
      'Product Name': this.billOfMaterials.productName,
      'Contact Info': this.billOfMaterials.contactInfo,
      'Approved By': this.billOfMaterials.approvedBy,
      'Date of Approval': this.billOfMaterials.dateOfApproval.toDateString(),
      'Part Count': this.billOfMaterials.partCount,
      'Total Cost': this.billOfMaterials.totalCost,
      Currency: this.billOfMaterials.currency,
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

    for (const part of this.billOfMaterials.parts || []) {
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

    const fileName = `laminar-bills-of-materials-${this.billOfMaterials.productName}`;
    this._excelExportService.exportToExcel(exportData, { colsInfo, fileName });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
