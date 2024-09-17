import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'materials', pathMatch: 'full' },
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
];
