import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inventory } from '../../../../interfaces/inventory.interface';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrl: './view-inventory.component.css',
})
export class ViewInventoryComponent implements OnInit {
  inventory!: Inventory;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['inventory']?.id) {
      this.inventory = JSON.parse(
        JSON.stringify(this._route.snapshot.data['inventory'])
      );
    }
  }
}
