import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Material } from '../../../../interfaces/material.interface';
import { Supplier } from '../../../../interfaces/supplier.interface';
import { MaterialsService } from '../../../services/materials.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-material-details',
  templateUrl: './material-details.component.html',
  styleUrl: './material-details.component.css',
  standalone: false,
  providers: [UploadService],
})
export class MaterialDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  material: Material = {
    id: '',
    partName: '',
    images: [],
    material: '',
    manufacturingMethod: '',
    drawings: [],
    dimensions: {
      length: '',
      breadth: '',
      height: '',
    },
    weight: '',
    dataSheets: [],
    suppliers: [],
  };
  supplierOptions: Supplier[] = [];
  addedMedia: { url: string; name: string; type: string }[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: MaterialsService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['material']?.id) {
      this.material = JSON.parse(
        JSON.stringify(this._route.snapshot.data['material'])
      );
    }

    this._service
      .getSuppliers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.supplierOptions = data;
          }
        },
      });
  }

  supplierCompareFunction = (option: Supplier, value: Supplier): boolean => {
    return option.id === value.id;
  };

  filesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;

    if (files?.length) {
      for (const file of Array.from(files)) {
        this._uploadFile(file);
      }
    }
  }

  deleteMedia(index: number) {
    this.addedMedia.splice(index, 1);
  }

  private _uploadFile(file: File) {
    this._uploadService
      .uploadFile(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.addedMedia = [...(this.addedMedia || []), data];
            this.fileInput!.nativeElement.value = '';
          }
        },
      });
  }

  submit() {
    if (this.material?.id) {
      this._updateMaterial();
    } else {
      this._createMaterial();
    }
  }

  private _createMaterial() {
    this._service
      .createMaterial(this.material)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.material = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/materials']);
          }
        },
      });
  }

  private _updateMaterial() {
    this._service
      .updateMaterial(this.material)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.material = JSON.parse(JSON.stringify(data));
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
