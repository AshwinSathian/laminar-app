import { Routes } from '@angular/router';
import { DashboardComponent } from './shared-components';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'materials',
    loadChildren: () =>
      import('./materials/materials.module').then((m) => m.MaterialsModule),
  },
  {
    path: 'bill-of-materials',
    loadChildren: () =>
      import('./bill-of-materials/bill-of-materials.module').then(
        (m) => m.BillOfMaterialsModule
      ),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
  },
  {
    path: 'suppliers',
    loadChildren: () =>
      import('./suppliers/suppliers.module').then((m) => m.SuppliersModule),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
