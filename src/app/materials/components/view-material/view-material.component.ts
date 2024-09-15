import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Material } from '../../../../interfaces/material.interface';
import { MaterialsService } from '../../../services/materials.service';

@Component({
  selector: 'app-view-material',
  templateUrl: './view-material.component.html',
  styleUrl: './view-material.component.css',
})
export class ViewMaterialComponent implements OnInit, OnDestroy {
  material!: Material;

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: MaterialsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['material']?.id) {
      this.material = JSON.parse(
        JSON.stringify(this._route.snapshot.data['material'])
      );
    }
  }

  deleteMaterial() {
    this._service
      .deleteMaterial(this._route.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this._router.navigate(['/materials']);
          }
        },
        error: (error) => {
          console.error('Error fetching materials:', error); // Handle errors if needed
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
