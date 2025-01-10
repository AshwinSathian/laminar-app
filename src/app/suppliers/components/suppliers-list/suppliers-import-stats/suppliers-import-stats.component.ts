import { Component, Inject, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-suppliers-import-stats',
    templateUrl: './suppliers-import-stats.component.html',
    styleUrl: './suppliers-import-stats.component.css',
    standalone: false
})
export class SuppliersImportStatsComponent {
  _supplierImportStats: {
    success: boolean;
    error?: string;
    inserted: {
      count: number;
      names: string;
    };
    updated: { count: number };
  } = {
    success: false,
    error: '',
    inserted: {
      count: 0,
      names: '',
    },
    updated: { count: 0 },
  };
  private _bottomSheetRef =
    inject<MatBottomSheetRef<SuppliersImportStatsComponent>>(MatBottomSheetRef);

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      success: boolean;
      error?: string;
      inserted: {
        count: number;
        names: string;
      };
      updated: { count: number };
    }
  ) {
    this._supplierImportStats = data;
  }
}
