import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Material } from '../../../../interfaces/material.interface';
import { MaterialsService } from '../../../services/materials.service';
import { ExcelExportService } from '../../../services/excel-export.service';
import { ColInfo } from 'xlsx';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrl: './materials-list.component.css',
})
export class MaterialsListComponent implements OnInit, OnDestroy {
  materials: Material[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: MaterialsService,
    private _excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this._service
      .getMaterials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.materials = JSON.parse(JSON.stringify(data));
          }
        },
      });
  }

  exportAllMaterials() {
    const exportData = this.materials?.map((material) => ({
      ID: material.id,
      'Part Name': material.partName,
      Material: material.material,
      'Manufacturing Method': material.manufacturingMethod,
      'Dimensions (L x B x H)': this._formatDimensions(material.dimensions),
      Weight: material.weight,
      Suppliers: this._formatSuppliers(material.suppliers || []),
      'Data Sheets': (material.dataSheets || []).join('; '),
      Drawings: (material.drawings || []).join('; '),
      Images: (material.images || []).join('; '),
    }));

    const colsInfo: ColInfo[] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];

    this._excelExportService.exportToExcel(exportData, { colsInfo });
  }

  private _formatDimensions(dimensions?: {
    length: string;
    breadth: string;
    height: string;
  }): string {
    if (!dimensions) {
      return '';
    }
    return `${dimensions.length} x ${dimensions.breadth} x ${dimensions.height}`;
  }

  private _formatSuppliers(suppliers: any[]): string {
    return suppliers
      ?.map((supplier) => `${supplier.id}: ${supplier.name}`)
      .join('; ');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
