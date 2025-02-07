import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  FilterService,
  OrdersService,
  OrdersSocketService,
  SharedService,
  UploadService,
} from '@laminar-app/services';
import {
  HeaderComponent,
  OrdersListComponent,
  OrderStatusComponent,
  PartsListDialogComponent,
} from '@laminar-app/shared-components';
import { AllOrdersListComponent } from './all-orders-list/all-orders-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrderResolver } from './resolvers/order.resolver';
import { ViewOrderComponent } from './view-order/view-order.component';

@NgModule({
  declarations: [
    AllOrdersListComponent,
    OrderDetailsComponent,
    ViewOrderComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSliderModule,
    OrdersRoutingModule,

    HeaderComponent,
    OrdersListComponent,
    OrderStatusComponent,
    PartsListDialogComponent,
  ],
  providers: [
    OrdersService,
    OrdersSocketService,
    OrderResolver,
    UploadService,
    SharedService,
    FilterService,
  ],
})
export class OrdersModule {}
