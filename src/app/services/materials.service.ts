import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { Material, Supplier } from '@laminar-app/interfaces';
import { Observable } from 'rxjs';

const API_BASE_URL = `${environment.apiUrl}/materials/`;

@Injectable()
export class MaterialsService {
  constructor(private _http: HttpClient) {}

  createMaterial(newMaterial: Material): Observable<Material> {
    return this._http.post<Material>(`${API_BASE_URL}`, newMaterial);
  }

  getMaterials(): Observable<Material[]> {
    return this._http.get<Material[]>(`${API_BASE_URL}`);
  }

  getMaterial(id: string): Observable<Material> {
    return this._http.get<Material>(`${API_BASE_URL}${id}`);
  }

  updateMaterial(material: Material): Observable<Material> {
    return this._http.put<Material>(`${API_BASE_URL}${material.id}`, material);
  }

  deleteMaterial(id: string): Observable<Material> {
    return this._http.delete<Material>(`${API_BASE_URL}${id}`);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this._http.get<Supplier[]>(`${environment.apiUrl}/suppliers`);
  }
}
