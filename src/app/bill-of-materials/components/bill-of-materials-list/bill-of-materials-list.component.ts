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
import { BillOfMaterials } from '../../../../interfaces/bom.interface';
import { BillOfMaterialsService } from '../../../services/bill-of-materials.service';

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

  constructor(private _service: BillOfMaterialsService) {}

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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
