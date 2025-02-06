import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Material } from '@laminar-app/interfaces';
import { MaterialsService } from '@laminar-app/services';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from '../../../services/breakpoint.service';

@Component({
  selector: 'app-view-material',
  templateUrl: './view-material.component.html',
  styleUrl: './view-material.component.css',
  standalone: false,
})
export class ViewMaterialComponent implements OnInit, OnDestroy {
  material!: Material;

  isMobile$ = this._breakpointService.isMobile$;
  destroy$ = new Subject<boolean>();

  constructor(
    private _service: MaterialsService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _breakpointService: BreakpointService
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
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
