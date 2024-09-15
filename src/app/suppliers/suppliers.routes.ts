import { Routes } from '@angular/router';
import { SupplierDetailsComponent } from './components/supplier-details/supplier-details.component';
import { SuppliersListComponent } from './components/suppliers-list/suppliers-list.component';
import { ViewSupplierComponent } from './components/view-supplier/view-supplier.component';
import { SupplierResolver } from './resolvers/supplier.resolver';

export const routes: Routes = [
  { path: '', component: SuppliersListComponent },
  { path: 'create', component: SupplierDetailsComponent },
  {
    path: 'edit/:id',
    component: SupplierDetailsComponent,
    resolve: { supplier: SupplierResolver },
  },
  {
    path: 'view/:id',
    component: ViewSupplierComponent,
    resolve: { supplier: SupplierResolver },
  },
];
