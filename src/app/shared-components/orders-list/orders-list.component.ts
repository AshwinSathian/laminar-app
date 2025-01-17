import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { OrderStatus } from '@laminar-app/enums';
import { Order } from '@laminar-app/interfaces';

@Component({
  selector: 'app-orders-list',
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
})
export class OrdersListComponent implements OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() displayedColumns: string[] = [];
  @Input({ required: true }) orders: Order[] = [];

  dataSource!: MatTableDataSource<any>;
  statusIconsMap: { [key: string]: string } = {
    [OrderStatus.placed]: 'check_circle',
    [OrderStatus.dispatched]: 'local_shipping',
    [OrderStatus.delivered]: 'task_alt',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['orders']?.currentValue) {
      this.dataSource = new MatTableDataSource(
        this.orders?.map((o) => ({
          id: o.id,
          referenceId: o.referenceId,
          orderDate: o.orderDate,
          supplier: o.supplier,
          status: o.status,
          value: o.totalValue,
          currency: o.currency,
        }))
      );
    }
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
}
