import { Routes } from '@angular/router';
import { DashboardComponent } from './shared-components';
import { LoginComponent } from './shared-components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'materials',
    loadChildren: () =>
      import('./materials/materials.module').then((m) => m.MaterialsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'bill-of-materials',
    loadChildren: () =>
      import('./bill-of-materials/bill-of-materials.module').then(
        (m) => m.BillOfMaterialsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.module').then((m) => m.OrdersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'suppliers',
    loadChildren: () =>
      import('./suppliers/suppliers.module').then((m) => m.SuppliersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: '/' },
];
