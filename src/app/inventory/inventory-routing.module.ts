import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryDetailsComponent } from './components/inventory-details/inventory-details.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { ViewInventoryComponent } from './components/view-inventory/view-inventory.component';
import { InventoryResolver } from './resolvers/inventory.resolver';

const routes: Routes = [
  { path: '', component: InventoryListComponent },
  { path: 'create', component: InventoryDetailsComponent },
  {
    path: 'edit/:id',
    component: InventoryDetailsComponent,
    resolve: { inventory: InventoryResolver },
  },
  {
    path: 'view/:id',
    component: ViewInventoryComponent,
    resolve: { inventory: InventoryResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
