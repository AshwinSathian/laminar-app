import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaTypes } from '@laminar-app/enums';
import { Supplier } from '@laminar-app/interfaces';
import {
  SharedService,
  SuppliersService,
  UploadService,
} from '@laminar-app/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrl: './supplier-details.component.css',
  standalone: false,
})
export class SupplierDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('filesInput') filesInput?: ElementRef<HTMLInputElement>;

  supplier: Supplier = {
    id: '',
    name: '',
    primaryContact: {
      name: '',
      email: '',
      phone: { code: '', number: '' },
      designation: '',
    },
    address: {
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      stateProvinceCounty: '',
      country: '',
      postalZipCode: '',
    },
  };
  countryOptions: { flag: string; name: string }[] = [];
  MediaTypes = MediaTypes;
  isUploading = false;

  destroy$ = new Subject<boolean>();

  constructor(
    private _service: SuppliersService,
    private _uploadService: UploadService,
    private _sharedService: SharedService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.data?.['supplier']?.id) {
      this.supplier = JSON.parse(
        JSON.stringify(this._route.snapshot.data['supplier'])
      );
    }

    this._sharedService
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.length) {
            this.countryOptions = data
              .map((d) => ({
                flag: d.flags.png,
                name: d.name.common,
              }))
              ?.sort((a, b) => a.name.localeCompare(b.name));
          }
        },
      });
  }

  filesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;

    if (files?.length) {
      for (const file of Array.from(files)) {
        this.isUploading = true;
        this._uploadFile(file);
      }
    }
  }

  deleteMedia(index: number) {
    this.supplier.documents?.splice(index, 1);
  }

  private _uploadFile(file: File) {
    this._uploadService
      .uploadFile(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.url) {
            this.supplier.documents = [
              ...(this.supplier.documents || []),
              data,
            ];
            this.filesInput!.nativeElement.value = '';
            this.isUploading = false;
          }
        },
      });
  }

  submit() {
    if (this.supplier?.id) {
      this._updateSupplier();
    } else {
      this._createSupplier();
    }
  }

  private _createSupplier() {
    this._service
      .createSupplier(this.supplier)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.supplier = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/suppliers']);
          }
        },
      });
  }

  private _updateSupplier() {
    this._service
      .updateSupplier(this.supplier)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.supplier = JSON.parse(JSON.stringify(data));
            this._router.navigate(['/suppliers']);
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
