import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-http-error',
    imports: [MatBottomSheetModule, MatIconModule, MatDividerModule],
    templateUrl: './http-error.component.html',
    styleUrl: './http-error.component.css'
})
export class HttpErrorComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      title: string;
      details: string;
    }
  ) {}
}
