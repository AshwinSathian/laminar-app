import { Component, Inject, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-inventories-import-stats',
    templateUrl: './inventories-import-stats.component.html',
    styleUrl: './inventories-import-stats.component.css',
    standalone: false
})
export class InventoriesImportStatsComponent {
  _inventoryImportStats: {
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
    inject<MatBottomSheetRef<InventoriesImportStatsComponent>>(
      MatBottomSheetRef
    );

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      success: boolean;
      inserted: {
        count: number;
        names: string;
      };
      updated: { count: number };
    }
  ) {
    this._inventoryImportStats = data;
  }
}
