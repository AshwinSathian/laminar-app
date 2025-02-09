import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BillOfMaterials,
  Material,
  PartDetail,
  Supplier,
} from '@laminar-app/interfaces';
import { BillOfMaterialsService, SharedService } from '@laminar-app/services';
import { PartsListDialogComponent } from '@laminar-app/shared-components';
import { iif, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bill-of-materials-details',
  templateUrl: './bill-of-materials-details.component.html',
  styleUrl: './bill-of-materials-details.component.css',
  standalone: false,
})
export class BillOfMaterialsDetailsComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);

  billOfMaterials: BillOfMaterials = {
    id: '',
    productName: '',
    contactInfo: '',
    approvedBy: '',
    dateOfApproval: new Date(),
    partCount: 0,
    totalCost: 0,
    parts: [],
    currency: 'GBP',
  };
  currencyOptions: { label: string; value: string }[] = [];
  materialsOptions: Material[] = [];
  selectedParts: Material[] = [];
  supplierOptionsMap: { [materialId: string]: Supplier[] } = {};
  selectedPartIds: string[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: BillOfMaterialsService,
    private _sharedService: SharedService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['billOfMaterials']?.id) {
      this.billOfMaterials = JSON.parse(
        JSON.stringify(this._route.snapshot.data['billOfMaterials'])
      );

      this.selectedPartIds =
        this.billOfMaterials?.parts?.map((p) => p.id || '') || [];
    }

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

    this._service
      .getMaterials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.materialsOptions = data;
            for (const part of data || []) {
              if (part.id) {
                this.supplierOptionsMap[part.id] =
                  part?.suppliers?.map((s) => s) || [];

                if (this.billOfMaterials.parts?.find((p) => p.id === part.id)) {
                  this.selectedParts.push(part);
                }
              }
            }
          }
        },
      });
  }

  openPartsDialog() {
    const dialogRef = this.dialog.open(PartsListDialogComponent, {
      width: '50vw',
      maxWidth: '50vw',
      data: {
        materials: this.materialsOptions,
        selectedPartIds: this.selectedPartIds,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result !== undefined) {
            this.selectedPartIds = [...(result || [])]?.filter((i) => !!i);
            for (const id of this.selectedPartIds || []) {
              const part = this.materialsOptions?.find((m) => m.id === id);
              if (part) {
                const index = this.billOfMaterials.parts?.findIndex(
                  (p) => p.id === id
                );
                if (index === -1) {
                  const partToAdd: PartDetail = {
                    id,
                    name: part.partName || '',
                    material: part.material,
                    manufacturingMethod: part.manufacturingMethod,
                    description: '',
                    images: part.images || [],
                    partNumber: `${this.billOfMaterials?.parts?.length + 1}`,
                    quantity: 1,
                    unitCost: 0,
                    totalPartCost: 0,
                  };
                  this.billOfMaterials.parts.push(partToAdd);
                }
              }
            }

            this.billOfMaterials.parts = this.billOfMaterials.parts?.filter(
              (p) => this.selectedPartIds.includes(p.id || '')
            );
            for (const part of this.materialsOptions || []) {
              if (part.id) {
                this.supplierOptionsMap[part.id] =
                  part?.suppliers?.map((s) => s) || [];

                if (this.billOfMaterials.parts?.find((p) => p.id === part.id)) {
                  this.selectedParts.push(part);
                }
              }
            }
            this.calculateTotalCost();
          }
        },
      });
  }

  supplierCompareFunction = (option: Supplier, value: Supplier): boolean =>
    option.id === value.id;

  removePart(index: number) {
    const id = this.billOfMaterials.parts[index].id;
    this.selectedPartIds = this.selectedPartIds.filter((i) => i !== id);
    this.selectedParts = this.selectedParts.filter((p) => p.id !== id);

    this.billOfMaterials.parts.splice(index, 1);
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    this.billOfMaterials.parts = this.billOfMaterials.parts?.map((p) => ({
      ...p,
      totalPartCost: p.unitCost * p.quantity,
      supplierOrManufacturer: p.supplierOrManufacturer,
    }));
    this.billOfMaterials.totalCost = this.billOfMaterials.parts?.reduce(
      (prev, curr) => prev + curr.totalPartCost,
      0
    );
  }

  submit() {
    this.billOfMaterials.partCount = this.billOfMaterials.parts?.length;
    this.billOfMaterials.parts = this.billOfMaterials.parts?.map((p) => ({
      ...p,
      supplierOrManufacturer: {
        id: p.supplierOrManufacturer?.id || '',
        name: p.supplierOrManufacturer?.name || '',
      },
    }));

    iif(
      () => !!this.billOfMaterials?.id,
      this._service.updateBillOfMaterials(this.billOfMaterials),
      this._service.createBillOfMaterials(this.billOfMaterials)
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.billOfMaterials = JSON.parse(JSON.stringify(data));
            this._router.navigate([
              `/bill-of-materials/view/${this.billOfMaterials.id}`,
            ]);
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
