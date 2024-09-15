import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Material } from '../../../../interfaces/material.interface';

@Component({
  selector: 'app-view-material',
  templateUrl: './view-material.component.html',
  styleUrl: './view-material.component.css',
})
export class ViewMaterialComponent implements OnInit {
  material!: Material;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['material']?.id) {
      this.material = JSON.parse(
        JSON.stringify(this._route.snapshot.data['material'])
      );
    }
  }
}
