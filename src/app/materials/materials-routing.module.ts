import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialDetailsComponent } from './components/material-details/material-details.component';
import { MaterialsListComponent } from './components/materials-list/materials-list.component';
import { ViewMaterialComponent } from './components/view-material/view-material.component';
import { MaterialResolver } from './resolvers/material.resolver';

const routes: Routes = [
  { path: '', component: MaterialsListComponent },
  { path: 'create', component: MaterialDetailsComponent },
  {
    path: 'edit/:id',
    component: MaterialDetailsComponent,
    resolve: { material: MaterialResolver },
  },
  {
    path: 'view/:id',
    component: ViewMaterialComponent,
    resolve: { material: MaterialResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialsRoutingModule {}
