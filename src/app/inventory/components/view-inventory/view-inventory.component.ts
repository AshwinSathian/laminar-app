import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Inventory } from '../../../../interfaces/inventory.interface';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrl: './view-inventory.component.css',
})
export class ViewInventoryComponent implements OnInit, OnDestroy {
  inventory!: Inventory;

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: InventoryService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['inventory']?.id) {
      this.inventory = JSON.parse(
        JSON.stringify(this._route.snapshot.data['inventory'])
      );
    }
  }

  deleteInventory() {
    this._service
      .deleteInventory(this._route.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this._router.navigate(['/inventory']);
          }
        },
        error: (error) => {
          console.error('Error fetching inventorys:', error); // Handle errors if needed
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
