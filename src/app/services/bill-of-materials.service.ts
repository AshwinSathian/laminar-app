import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { BillOfMaterials, Material } from '@laminar-app/interfaces';
import { Observable } from 'rxjs';

const API_BASE_URL = `${environment.apiUrl}/bill-of-materials/`;

@Injectable()
export class BillOfMaterialsService {
  constructor(private _http: HttpClient) {}

  createBillOfMaterials(
    newBillOfMaterials: BillOfMaterials
  ): Observable<BillOfMaterials> {
    return this._http.post<BillOfMaterials>(
      `${API_BASE_URL}`,
      newBillOfMaterials
    );
  }

  getBillsOfMaterials(): Observable<BillOfMaterials[]> {
    return this._http.get<BillOfMaterials[]>(`${API_BASE_URL}`);
  }

  getBillOfMaterialsMaterials(id: string): Observable<Material[]> {
    return this._http.get<Material[]>(
      `${environment.apiUrl}/materials/billofmaterials/${id}`
    );
  }

  getBillOfMaterials(id: string): Observable<BillOfMaterials> {
    return this._http.get<BillOfMaterials>(`${API_BASE_URL}${id}`);
  }

  updateBillOfMaterials(
    billofmaterials: BillOfMaterials
  ): Observable<BillOfMaterials> {
    return this._http.put<BillOfMaterials>(
      `${API_BASE_URL}${billofmaterials.id}`,
      billofmaterials
    );
  }

  deleteBillOfMaterials(id: string): Observable<BillOfMaterials> {
    return this._http.delete<BillOfMaterials>(`${API_BASE_URL}${id}`);
  }

  getMaterials(): Observable<Material[]> {
    return this._http.get<Material[]>(`${environment.apiUrl}/materials/`);
  }
}
