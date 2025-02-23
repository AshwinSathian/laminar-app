import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InventoryService, SharedService } from '@laminar-app/services';
import { HeaderComponent } from '@laminar-app/shared-components';
import { InventoryDetailsComponent } from './components/inventory-details/inventory-details.component';
import { InventoriesImportStatsComponent } from './components/inventory-list/inventories-import-stats/inventories-import-stats.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { ViewInventoryComponent } from './components/view-inventory/view-inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryResolver } from './resolvers/inventory.resolver';

@NgModule({
  declarations: [
    InventoryDetailsComponent,
    InventoryListComponent,
    ViewInventoryComponent,
    InventoriesImportStatsComponent,
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
    MatExpansionModule,
    InventoryRoutingModule,

    HeaderComponent,
  ],
  providers: [InventoryService, InventoryResolver, SharedService],
})
export class InventoryModule {}
