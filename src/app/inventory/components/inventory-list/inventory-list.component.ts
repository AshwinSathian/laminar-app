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
import { Inventory } from '../../../../interfaces/inventory.interface';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css',
})
export class InventoryListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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

  constructor(private _service: InventoryService) {}

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

  deleteInventory(id: string) {
    this._service
      .deleteInventory(id)
      .pipe(
        switchMap(() => this._service.getInventories()),
        takeUntil(this.destroy$)
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
          }
        },
        error: (error) => {
          console.error('Error fetching inventorys:', error); // Handle errors if needed
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
