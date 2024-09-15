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
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Supplier } from '../../../../interfaces/supplier.interface';
import { SuppliersService } from '../../../services/suppliers.service';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrl: './suppliers-list.component.css',
})
export class SuppliersListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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

  constructor(private _service: SuppliersService) {}

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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
