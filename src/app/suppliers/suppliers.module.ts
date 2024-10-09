import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MaterialsLibraryComponent } from '../materials-library/materials-library.component';
import { ExcelExportService } from '../services/excel-export.service';
import { SuppliersService } from '../services/suppliers.service';
import { SupplierDetailsComponent } from './components/supplier-details/supplier-details.component';
import { SuppliersImportStatsComponent } from './components/suppliers-list/suppliers-import-stats/suppliers-import-stats.component';
import { SuppliersListComponent } from './components/suppliers-list/suppliers-list.component';
import { ViewSupplierComponent } from './components/view-supplier/view-supplier.component';
import { SupplierResolver } from './resolvers/supplier.resolver';
import { routes } from './suppliers.routes';

@NgModule({
  declarations: [
    SuppliersListComponent,
    SuppliersImportStatsComponent,
    SupplierDetailsComponent,
    ViewSupplierComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    HttpClientModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    RouterModule.forChild(routes),

    MaterialsLibraryComponent,
    HeaderComponent,
  ],
  providers: [SuppliersService, SupplierResolver, ExcelExportService],
})
export class SuppliersModule {}
