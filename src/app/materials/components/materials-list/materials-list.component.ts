import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Material } from '../../../../interfaces/material.interface';
import { MaterialsService } from '../../../services/materials.service';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrl: './materials-list.component.css',
})
export class MaterialsListComponent implements OnInit, OnDestroy {
  materials: Material[] = [];

  destroy$ = new Subject<boolean>();

  constructor(private _service: MaterialsService) {}

  ngOnInit(): void {
    this._service
      .getMaterials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.materials = JSON.parse(JSON.stringify(data));
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
