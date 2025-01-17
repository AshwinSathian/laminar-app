import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllOrdersListComponent } from './all-orders-list/all-orders-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderResolver } from './resolvers/order.resolver';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
  { path: '', component: AllOrdersListComponent },
  { path: 'create', component: OrderDetailsComponent },
  {
    path: 'edit/:id',
    component: OrderDetailsComponent,
    resolve: { order: OrderResolver },
  },
  {
    path: 'view/:id',
    component: ViewOrderComponent,
    resolve: { order: OrderResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
