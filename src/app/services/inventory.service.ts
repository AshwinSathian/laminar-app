import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { Inventory, Material } from '@laminar-app/interfaces';
import { Observable } from 'rxjs';

const API_BASE_URL = `${environment.apiUrl}/inventory/`;

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
      `${environment.apiUrl}/materials/inventory/${id}`
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

  importInventories(formData: FormData): Observable<{
    inserted: {
      count: number;
      names: string;
    };
    updated: { count: number };
  }> {
    return this._http.post<{
      inserted: {
        count: number;
        names: string;
      };
      updated: { count: number };
    }>(`${API_BASE_URL}import`, formData);
  }
}
