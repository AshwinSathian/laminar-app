import { Component, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PartsDialogData } from '@laminar-app/interfaces';

@Component({
  selector: 'app-parts-list-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
  ],
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
