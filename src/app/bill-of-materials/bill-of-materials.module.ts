import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BillOfMaterialsService, SharedService } from '@laminar-app/services';
import { HeaderComponent } from '@laminar-app/shared-components';
import { BillOfMaterialsRoutingModule } from './bill-of-materials-routing.module';
import { BillOfMaterialsDetailsComponent } from './components/bill-of-materials-details/bill-of-materials-details.component';
import { BillOfMaterialsListComponent } from './components/bill-of-materials-list/bill-of-materials-list.component';
import { ViewBillOfMaterialsComponent } from './components/view-bill-of-materials/view-bill-of-materials.component';
import { BillOfMaterialsResolver } from './resolvers/bill-of-materials.resolver';

@NgModule({
  declarations: [
    BillOfMaterialsDetailsComponent,
    BillOfMaterialsListComponent,
    ViewBillOfMaterialsComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    BillOfMaterialsRoutingModule,

    HeaderComponent,
  ],
  providers: [BillOfMaterialsService, BillOfMaterialsResolver, SharedService],
})
export class BillOfMaterialsModule {}
