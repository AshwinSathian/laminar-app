import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderStatus } from '@laminar-app/enums';
import { Material, Order, Supplier } from '@laminar-app/interfaces';
import {
  OrdersService,
  SharedService,
  UploadService,
} from '@laminar-app/services';
import { PartsListDialogComponent } from '@laminar-app/shared-components';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Subject, takeUntil } from 'rxjs';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
  providers: [provideNativeDateAdapter(), provideMomentDateAdapter(MY_FORMATS)],
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('filesInput') filesInput?: ElementRef<HTMLInputElement>;
  readonly dialog = inject(MatDialog);

  order: Order = {
    id: '',
    referenceId: '',
    parts: [],
    orderDate: new Date(),
    status: OrderStatus.placed,
    totalValue: 0,
    currency: 'GBP',
    invoice: '',
  };
  supplierOptions: Supplier[] = [];
  materialOptions: Material[] = [];
  isUploading = false;
  statusOptions: { label: string; value: OrderStatus; icon: string }[] = [
    { label: 'Order Placed', value: OrderStatus.placed, icon: 'check_circle' },
    {
      label: 'Order Dispatched',
      value: OrderStatus.dispatched,
      icon: 'local_shipping',
    },
    {
      label: 'Order Delivered',
      value: OrderStatus.delivered,
      icon: 'task_alt',
    },
  ];
  selectedPartIds: string[] = [];
  currencyOptions: { label: string; value: string }[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: OrdersService,
    private _uploadService: UploadService,
    private _sharedService: SharedService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['order']?.id) {
      this.order = JSON.parse(
        JSON.stringify(this._route.snapshot.data['order'])
      );
      this.updateTotal();
    }

    this._service
      .getSuppliers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.supplierOptions = data;
          }
        },
      });

    this._sharedService
      .getCurrencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (Object.keys(data || {})?.length) {
            this.currencyOptions = Object.keys(data || {})
              ?.map((c) => ({
                label: `${data[c]} (${c})`,
                value: c,
              }))
              ?.sort((a, b) => a.label.localeCompare(b.label));
          }
        },
      });
  }

  private _loadSupplierMaterials() {
    if (this.order.supplier?.id) {
      this.materialOptions = [];
      this._service
        .getSupplierMaterials(this.order.supplier.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            if (data?.length) {
              this.materialOptions = data;
            }

            const dialogRef = this.dialog.open(PartsListDialogComponent, {
              data: {
                materials: this.materialOptions,
                supplier: this.order.supplier,
                selectedPartIds: this.selectedPartIds,
              },
            });

            dialogRef
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (result) => {
                  if (result !== undefined) {
                    this.selectedPartIds = [...(result || [])];
                    for (const id of this.selectedPartIds || []) {
                      const part = this.materialOptions?.find(
                        (m) => m.id === id
                      );
                      if (part) {
                        const index = this.order.parts?.findIndex(
                          (p) => p.part.id === id
                        );
                        if (index === -1) {
                          this.order.parts.push({
                            part,
                            quantity: 1,
                            unitPrice: 0,
                          });
                          this.selectedPartIds.push(id);
                        }
                      }
                    }

                    this.order.parts = this.order.parts?.filter((p) =>
                      this.selectedPartIds.includes(p.part.id || '')
                    );
                    this.updateTotal();
                  }
                },
              });
          },
        });
    }
  }

  updateTotal() {
    this.order.totalValue = this.order.parts.reduce(
      (prev, curr) => prev + curr.unitPrice * curr.quantity,
      0
    );
  }

  openPartsDialog() {
    this._loadSupplierMaterials();
  }

  supplierCompareFunction = (option: Supplier, value: Supplier): boolean => {
    return option.id === value.id;
  };

  materialCompareFunction = (option: Material, value: Material): boolean => {
    return option.id === value.id;
  };

  statusCompareFunction = (
    option: { label: string; value: OrderStatus; icon: string },
    value: { label: string; value: OrderStatus; icon: string }
  ): boolean => {
    return option.value === value.value;
  };

  filesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;

    if (files?.length) {
      for (const file of Array.from(files)) {
        this.isUploading = true;
        this._uploadFile(file);
      }
    }
  }

  private _uploadFile(file: File) {
    this._uploadService
      .uploadFile(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.url) {
            this.order.invoice = data.url;
            this.filesInput!.nativeElement.value = '';
            this.isUploading = false;
          }
        },
      });
  }

  submit() {
    if (this.order?.id) {
      this._updateOrder();
    } else {
      this._createOrder();
    }
  }

  private _createOrder() {
    this._service
      .createOrder(this.order)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.order = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/orders']);
          }
        },
      });
  }

  private _updateOrder() {
    this._service
      .updateOrder(this.order)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.order = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/orders']);
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
