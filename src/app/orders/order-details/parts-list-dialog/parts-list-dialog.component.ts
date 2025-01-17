import { Component, inject, model } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartsDialogData } from '../order-details.component';

@Component({
  selector: 'app-parts-list-dialog',
  standalone: false,
  templateUrl: './parts-list-dialog.component.html',
  styleUrl: './parts-list-dialog.component.css',
})
export class PartsListDialogComponent {
  data: PartsDialogData = inject(MAT_DIALOG_DATA);
  selectedPartIds = model(this.data.selectedPartIds);
  _tempSelectedIds = this.selectedPartIds();

  addPart(id: string | undefined) {
    if (id) {
      this._tempSelectedIds.push(id);
      this.selectedPartIds.set(this._tempSelectedIds);
    }
  }

  removePart(id: string | undefined) {
    const index = this._tempSelectedIds.findIndex((partId) => partId === id);
    this._tempSelectedIds.splice(index, 1);
    this.selectedPartIds.set(this._tempSelectedIds);
  }
}
