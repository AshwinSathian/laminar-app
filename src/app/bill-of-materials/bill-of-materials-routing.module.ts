import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillOfMaterialsDetailsComponent } from './components/bill-of-materials-details/bill-of-materials-details.component';
import { BillOfMaterialsListComponent } from './components/bill-of-materials-list/bill-of-materials-list.component';
import { ViewBillOfMaterialsComponent } from './components/view-bill-of-materials/view-bill-of-materials.component';
import { BillOfMaterialsResolver } from './resolvers/bill-of-materials.resolver';

const routes: Routes = [
  { path: '', component: BillOfMaterialsListComponent },
  { path: 'create', component: BillOfMaterialsDetailsComponent },
  {
    path: 'edit/:id',
    component: BillOfMaterialsDetailsComponent,
    resolve: { billOfMaterials: BillOfMaterialsResolver },
  },
  {
    path: 'view/:id',
    component: ViewBillOfMaterialsComponent,
    resolve: { billOfMaterials: BillOfMaterialsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillOfMaterialsRoutingModule {}
