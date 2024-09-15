import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Supplier } from '../../interfaces/supplier.interface';
import { Material } from '../../interfaces/material.interface';

const API_BASE_URL = `${environment.apiUrl}suppliers/`;

@Injectable()
export class SuppliersService {
  constructor(private _http: HttpClient) {}

  createSupplier(newSupplier: Supplier): Observable<Supplier> {
    return this._http.post<Supplier>(`${API_BASE_URL}`, newSupplier);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this._http.get<Supplier[]>(`${API_BASE_URL}`);
  }

  getSupplierMaterials(id: string): Observable<Material[]> {
    return this._http.get<Material[]>(
      `${environment.apiUrl}materials/supplier/${id}`
    );
  }

  getSupplier(id: string): Observable<Supplier> {
    return this._http.get<Supplier>(`${API_BASE_URL}${id}`);
  }

  updateSupplier(supplier: Supplier): Observable<Supplier> {
    return this._http.put<Supplier>(`${API_BASE_URL}${supplier.id}`, supplier);
  }

  deleteSupplier(id: string): Observable<Supplier> {
    return this._http.delete<Supplier>(`${API_BASE_URL}${id}`);
  }
}
