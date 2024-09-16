import {
  AfterViewInit,
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
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Material } from '../../interfaces/material.interface';

@Component({
  selector: 'app-materials-library',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './materials-library.component.html',
  styleUrl: './materials-library.component.css',
})
export class MaterialsLibraryComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) materials: Material[] = [];
  @Input() showActions = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['partName', 'material', 'manufacturingMethod'];
  dataSource!: MatTableDataSource<{
    partName: string;
    material: string;
    manufacturingMethod: string;
    id: string;
  }>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['materials']?.currentValue) {
      this.dataSource = new MatTableDataSource(
        this.materials?.map((s) => ({
          partName: s.partName || '',
          material: s.material || '',
          manufacturingMethod: s.manufacturingMethod || '',
          id: s.id || '',
        }))
      );
    }

    if (changes['showActions']?.currentValue === true) {
      this.displayedColumns.push('actions');
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
