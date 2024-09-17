import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BillOfMaterials } from '../../interfaces/bom.interface';
import { Material } from '../../interfaces/material.interface';

const API_BASE_URL = `${environment.apiUrl}bill-of-materials/`;

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
      `${environment.apiUrl}materials/billofmaterials/${id}`
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

  getCurrencies(): Observable<{ [code: string]: string }> {
    return this._http.get<{ [code: string]: string }>(
      'https://openexchangerates.org/api/currencies.json'
    );
  }

  getMaterials(): Observable<Material[]> {
    return this._http.get<Material[]>(`${environment.apiUrl}materials/`);
  }
}
