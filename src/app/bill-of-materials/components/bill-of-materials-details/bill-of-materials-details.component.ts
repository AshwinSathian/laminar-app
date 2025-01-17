import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BillOfMaterials,
  Material,
  PartDetail,
  Supplier,
} from '@laminar-app/interfaces';
import { BillOfMaterialsService, SharedService } from '@laminar-app/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bill-of-materials-details',
  templateUrl: './bill-of-materials-details.component.html',
  styleUrl: './bill-of-materials-details.component.css',
  standalone: false,
})
export class BillOfMaterialsDetailsComponent implements OnInit, OnDestroy {
  billOfMaterials: BillOfMaterials = {
    id: '',
    productName: '',
    contactInfo: '',
    approvedBy: '',
    dateOfApproval: new Date(),
    partCount: 0,
    totalCost: 0,
    parts: [],
    currency: '',
  };
  currencyOptions: { label: string; value: string }[] = [];
  materialsOptions: Material[] = [];
  selectedParts: Material[] = [];
  supplierOptionsMap: { [materialId: string]: Supplier[] } = {};
  unitOptions: string[] = [
    'pieces',
    'grams',
    'kilograms',
    'pounds',
    'centimeters',
    'meters',
    'inches',
    'feet',
  ];

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
            for (const part of this.billOfMaterials.parts) {
              const selectedPart = data?.find((d) => d.id === part.materialId);
              if (selectedPart?.id) {
                this.supplierOptionsMap[part.materialId] =
                  selectedPart?.suppliers || [];
                this.selectedParts.push(selectedPart);
              }
            }
          }
        },
      });
  }

  materialCompareFunction = (option: Material, value: Material): boolean => {
    return option.id === value.id;
  };

  supplierCompareFunction = (option: Supplier, value: Supplier): boolean => {
    return option.id === value.id;
  };

  addParts() {
    if (this.billOfMaterials.parts?.length) {
      this.billOfMaterials.parts = [];
    }

    for (const material of this.selectedParts) {
      const part: PartDetail = {
        materialId: material.id || '',
        partName: material.partName,
        description: '',
        partImages: material.images,
        partNumber: `${this.billOfMaterials?.parts?.length + 1}`,
        quantity: 1,
        units: '',
        unitCost: 0,
        totalPartCost: 0,
      };

      this.billOfMaterials.parts.push(part);
      if (material.id) {
        this.supplierOptionsMap[material.id] = material.suppliers || [];
      }
    }
  }

  submit() {
    this.billOfMaterials.parts = this.billOfMaterials.parts?.map((p) => ({
      ...p,
      totalPartCost: p.unitCost * p.quantity,
      supplierOrManufacturer: p.supplierOrManufacturer,
    }));
    this.billOfMaterials.totalCost = this.billOfMaterials.parts?.reduce(
      (prev, curr) => prev + curr.totalPartCost,
      0
    );
    this.billOfMaterials.partCount = this.billOfMaterials.parts?.length;

    if (this.billOfMaterials?.id) {
      this._updateBillOfMaterials();
    } else {
      this._createBillOfMaterials();
    }
  }

  private _createBillOfMaterials() {
    this._service
      .createBillOfMaterials(this.billOfMaterials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.billOfMaterials = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/bill-of-materials']);
          }
        },
      });
  }

  private _updateBillOfMaterials() {
    this._service
      .updateBillOfMaterials(this.billOfMaterials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.billOfMaterials = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/bill-of-materials']);
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
