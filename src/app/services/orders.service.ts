import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order, Supplier, Material } from '@laminar-app/interfaces';

@Injectable()
export class OrdersService {
  private apollo = inject(Apollo);

  getSuppliers(): Observable<Supplier[]> {
    return this.apollo
      .watchQuery<{ getSuppliers: Supplier[] }>({
        query: gql`
          query {
            getSuppliers {
              id
              name
              primaryContact {
                name
                email
                phone {
                  code
                  number
                }
              }
            }
          }
        `,
      })
      .valueChanges.pipe(map((result) => result.data.getSuppliers));
  }

  getSupplierMaterials(id: string): Observable<Material[]> {
    return this.apollo
      .watchQuery<{ getSupplierMaterials: Material[] }>({
        query: gql`
          query GetSupplierMaterials($id: String!) {
            getSupplierMaterials(id: $id) {
              id
              partName
              material
              manufacturingMethod
              suppliers {
                id
                name
              }
            }
          }
        `,
        variables: { id },
      })
      .valueChanges.pipe(map((result) => result.data.getSupplierMaterials));
  }

  getOrders(filters?: any): Observable<Order[]> {
    return this.apollo
      .watchQuery<{ getOrders: Order[] }>({
        query: gql`
          query GetOrders($filters: FiltersPayload) {
            getOrders(filters: $filters) {
              id
              referenceId
              supplier {
                id
                name
              }
              parts {
                id
                part {
                  partName
                  material
                }
                quantity
                unitPrice
              }
              orderDate
              status
              totalValue
              currency
            }
          }
        `,
        variables: { filters },
      })
      .valueChanges.pipe(map((result) => result.data.getOrders));
  }

  getOrder(id: string): Observable<Order> {
    return this.apollo
      .watchQuery<{ getOrder: Order }>({
        query: gql`
          query GetOrder($id: String!) {
            getOrder(id: $id) {
              id
              referenceId
              supplier {
                id
                name
              }
              parts {
                id
                part {
                  partName
                  material
                }
                quantity
                unitPrice
              }
              orderDate
              status
              totalValue
              currency
            }
          }
        `,
        variables: { id },
      })
      .valueChanges.pipe(map((result) => result.data.getOrder));
  }

  createOrder(newOrder: Order): Observable<Order | undefined> {
    return this.apollo
      .mutate<{ createOrder: Order }>({
        mutation: gql`
          mutation CreateOrder($orderData: CreateOrderInput!) {
            createOrder(orderData: $orderData) {
              id
              referenceId
              status
            }
          }
        `,
        variables: { orderData: newOrder },
      })
      .pipe(map((result) => result?.data?.createOrder));
  }

  updateOrder(order: Partial<Order>): Observable<Order | undefined> {
    return this.apollo
      .mutate<{ updateOrder: Order }>({
        mutation: gql`
          mutation UpdateOrder($id: String!, $updateData: UpdateOrderInput!) {
            updateOrder(id: $id, updateData: $updateData) {
              id
              status
            }
          }
        `,
        variables: { id: order.id, updateData: order },
      })
      .pipe(map((result) => result?.data?.updateOrder));
  }

  deleteOrder(id: string): Observable<unknown> {
    return this.apollo
      .mutate<{ deleteOrder: Order }>({
        mutation: gql`
          mutation DeleteOrder($id: String!) {
            deleteOrder(id: $id) {
              id
            }
          }
        `,
        variables: { id },
      })
      .pipe(map((result) => result?.data?.deleteOrder));
  }

  getOrderCount(): Observable<number> {
    return this.apollo
      .query<{ getOrderCount: number }>({
        query: gql`
          query {
            getOrderCount
          }
        `,
      })
      .pipe(map((result) => result.data.getOrderCount));
  }
}
