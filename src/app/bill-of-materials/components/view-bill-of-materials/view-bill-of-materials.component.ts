import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BillOfMaterials } from '../../../../interfaces/bom.interface';
import { BillOfMaterialsService } from '../../../services/bill-of-materials.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-bill-of-materials',
  templateUrl: './view-bill-of-materials.component.html',
  styleUrl: './view-bill-of-materials.component.css',
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

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: BillOfMaterialsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['billOfMaterials']?.id) {
      this.billOfMaterials = JSON.parse(
        JSON.stringify(this._route.snapshot.data['billOfMaterials'])
      );
      this.dataSource = new MatTableDataSource(
        this.billOfMaterials.parts?.map((p) => ({
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
        error: (error) => {
          console.error('Error fetching suppliers:', error); // Handle errors if needed
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
