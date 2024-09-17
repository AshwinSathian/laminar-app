import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderComponent } from '../header/header.component';
import { BillOfMaterialsService } from '../services/bill-of-materials.service';
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
    HttpClientModule,
    MatToolbarModule,
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
  providers: [BillOfMaterialsService, BillOfMaterialsResolver],
})
export class BillOfMaterialsModule {}
