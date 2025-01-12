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

enum MediaTypes {
  images = 'images',
  drawings = 'drawings',
  dataSheets = 'dataSheets',
}

@Component({
  selector: 'app-material-details',
  templateUrl: './material-details.component.html',
  styleUrl: './material-details.component.css',
  standalone: false,
  providers: [UploadService],
})
export class MaterialDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('imagesInput') imagesInput?: ElementRef<HTMLInputElement>;
  @ViewChild('drawingsInput') drawingsInput?: ElementRef<HTMLInputElement>;
  @ViewChild('dataSheetsInput') dataSheetsInput?: ElementRef<HTMLInputElement>;

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
  MediaTypes = MediaTypes;
  isUploading: { [key: string]: boolean } = {
    [MediaTypes.images]: false,
    [MediaTypes.drawings]: false,
    [MediaTypes.dataSheets]: false,
  };

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

  filesSelected(event: Event, type: MediaTypes): void {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;

    if (files?.length) {
      for (const file of Array.from(files)) {
        this.isUploading[type] = true;
        this._uploadFile(file, type);
      }
    }
  }

  deleteMedia(index: number, type: MediaTypes) {
    switch (type) {
      case MediaTypes.images:
        this.material.images?.splice(index, 1);
        break;
      case MediaTypes.drawings:
        this.material.drawings?.splice(index, 1);
        break;
      case MediaTypes.dataSheets:
        this.material.dataSheets?.splice(index, 1);
        break;
    }
  }

  private _uploadFile(file: File, type: MediaTypes) {
    this._uploadService
      .uploadFile(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.fileUrl) {
            switch (type) {
              case MediaTypes.images:
                {
                  this.material.images = [
                    ...(this.material.images || []),
                    data.fileUrl,
                  ];
                  this.imagesInput!.nativeElement.value = '';
                }
                break;
              case MediaTypes.drawings:
                {
                  this.material.drawings = [
                    ...(this.material.drawings || []),
                    data.fileUrl,
                  ];
                  this.drawingsInput!.nativeElement.value = '';
                }
                break;
              case MediaTypes.dataSheets:
                {
                  this.material.dataSheets = [
                    ...(this.material.dataSheets || []),
                    data.fileUrl,
                  ];
                  this.dataSheetsInput!.nativeElement.value = '';
                }
                break;
            }

            this.isUploading[type] = false;
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
