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
import { OrderStatus } from '@laminar-app/enums';
import { Order, OrderItem } from '@laminar-app/interfaces';
import { OrdersService } from '@laminar-app/services';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from '../../services/breakpoint.service';

@Component({
  selector: 'app-view-order',
  standalone: false,
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.css',
})
export class ViewOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  order!: Order;
  displayedColumns: string[] = [
    'partName',
    'quantity',
    'unitPrice',
    'totalPrice',
  ];
  dataSource!: MatTableDataSource<any>;
  statusIconsMap: { [key: string]: string } = {
    [OrderStatus.placed]: 'check_circle',
    [OrderStatus.dispatched]: 'local_shipping',
    [OrderStatus.delivered]: 'task_alt',
  };
  OrderStatus = OrderStatus;

  isMobile$ = this._breakpointService.isMobile$;
  destroy$ = new Subject<boolean>();

  constructor(
    private _service: OrdersService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _breakpointService: BreakpointService
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['order']?.id) {
      this.order = JSON.parse(
        JSON.stringify(this._route.snapshot.data['order'])
      );
      this.dataSource = new MatTableDataSource(
        this.order.parts?.map((p: OrderItem) => ({
          partName: p.name,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          totalPrice: p.unitPrice * p.quantity,
          materialId: p.id,
        }))
      );
    }
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  deleteOrder() {
    this._service
      .deleteOrder(this._route.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this._router.navigate(['/orders']);
          }
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource?.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // exportOrder() {
  //   const exportData = [];

  //   exportData.push({
  //     ID: this.Order.id,
  //     'Product Name': this.Order.productName,
  //     'Contact Info': this.Order.contactInfo,
  //     'Approved By': this.Order.approvedBy,
  //     'Date of Approval': this.Order.dateOfApproval.toDateString(),
  //     'Part Count': this.Order.partCount,
  //     'Total Cost': this.Order.totalCost,
  //     Currency: this.Order.currency,
  //     'Part Number': '',
  //     'Part Name': '',
  //     'Material ID': '',
  //     Description: '',
  //     Quantity: '',
  //     Units: '',
  //     'Supplier/Manufacturer': '',
  //     'Unit Cost': '',
  //     'Total Part Cost': '',
  //     'Part Images': '',
  //   });

  //   for (const part of this.Order.parts || []) {
  //     exportData.push({
  //       ID: '',
  //       'Product Name': '',
  //       'Contact Info': '',
  //       'Approved By': '',
  //       'Date of Approval': '',
  //       'Part Count': '',
  //       'Total Cost': '',
  //       Currency: '',
  //       'Part Number': part.partNumber,
  //       'Part Name': part.partName,
  //       'Material ID': part.materialId,
  //       Description: part.description || '',
  //       Quantity: part.quantity,
  //       Units: part.units,
  //       'Supplier/Manufacturer': part.supplierOrManufacturer?.name || '',
  //       'Unit Cost': part.unitCost,
  //       'Total Part Cost': part.totalPartCost,
  //       'Part Images': (part.images || [])?.map((i) => i.url).join('; '),
  //     });
  //   }

  //   const colsInfo: ColInfo[] = [
  //     { wch: 15 },
  //     { wch: 30 },
  //     { wch: 25 },
  //     { wch: 20 },
  //     { wch: 15 },
  //     { wch: 10 },
  //     { wch: 15 },
  //     { wch: 10 },
  //     { wch: 15 },
  //     { wch: 25 },
  //     { wch: 15 },
  //     { wch: 30 },
  //     { wch: 10 },
  //     { wch: 10 },
  //     { wch: 25 },
  //     { wch: 15 },
  //     { wch: 15 },
  //     { wch: 30 },
  //   ];

  //   const fileName = `laminar-bills-of-materials-${this.Order.productName}`;
  //   this._excelExportService.exportToExcel(exportData, { colsInfo, fileName });
  // }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
