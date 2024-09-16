import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Inventory } from '../../interfaces/inventory.interface';
import { Material } from '../../interfaces/material.interface';

const API_BASE_URL = `${environment.apiUrl}inventory/`;

@Injectable()
export class InventoryService {
  constructor(private _http: HttpClient) {}

  createInventory(newInventory: Inventory): Observable<Inventory> {
    return this._http.post<Inventory>(`${API_BASE_URL}`, newInventory);
  }

  getInventories(): Observable<Inventory[]> {
    return this._http.get<Inventory[]>(`${API_BASE_URL}`);
  }

  getInventoryMaterials(id: string): Observable<Material[]> {
    return this._http.get<Material[]>(
      `${environment.apiUrl}materials/inventory/${id}`
    );
  }

  getInventory(id: string): Observable<Inventory> {
    return this._http.get<Inventory>(`${API_BASE_URL}${id}`);
  }

  updateInventory(inventory: Inventory): Observable<Inventory> {
    return this._http.put<Inventory>(
      `${API_BASE_URL}${inventory.id}`,
      inventory
    );
  }

  deleteInventory(id: string): Observable<Inventory> {
    return this._http.delete<Inventory>(`${API_BASE_URL}${id}`);
  }

  getCountries(): Observable<any[]> {
    return this._http.get<any[]>('https://restcountries.com/v3.1/all');
  }
}
