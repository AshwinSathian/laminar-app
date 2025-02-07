import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { Material, Order, Supplier } from '@laminar-app/interfaces';
import { Observable } from 'rxjs';

const API_BASE_URL = `${environment.apiUrl}/orders/`;

@Injectable()
export class OrdersService {
  constructor(private _http: HttpClient) {}

  getSuppliers(): Observable<Supplier[]> {
    return this._http.get<Supplier[]>(`${environment.apiUrl}/suppliers/`);
  }

  getSupplierMaterials(id: string): Observable<Material[]> {
    return this._http.get<Material[]>(
      `${environment.apiUrl}/materials/supplier/${id}`
    );
  }

  createOrder(newOrder: Order): Observable<Order> {
    return this._http.post<Order>(`${API_BASE_URL}`, newOrder);
  }

  getOrders(filters?: string): Observable<Supplier[]> {
    return this._http.get<Supplier[]>(
      `${API_BASE_URL}${filters?.length ? '?filters=' + filters : ''}`
    );
  }

  getOrder(id: string): Observable<Order> {
    return this._http.get<Order>(`${API_BASE_URL}${id}`);
  }

  updateOrder(order: Order): Observable<Order> {
    return this._http.put<Order>(`${API_BASE_URL}${order.id}`, order);
  }

  deleteOrder(id: string): Observable<Order> {
    return this._http.delete<Order>(`${API_BASE_URL}${id}`);
  }

  getCurrencies(): Observable<{ [code: string]: string }> {
    return this._http.get<{ [code: string]: string }>(
      'https://openexchangerates.org/api/currencies.json'
    );
  }
}
