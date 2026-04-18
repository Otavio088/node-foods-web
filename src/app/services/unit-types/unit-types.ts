import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitTypesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getAll(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/unit_types`, {withCredentials: true}));
  }

  getOne(UnitTypeId: number): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/unit_types/${UnitTypeId}`, {withCredentials: true}));
  }

  create(body: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/unit_types`, body, {withCredentials: true}));
  }

  update(UnitTypeId: number, body: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.baseUrl}/unit_types/${UnitTypeId}`, body, {withCredentials: true}));
  }

  delete(UnitTypeId: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/unit_types/${UnitTypeId}`, {withCredentials: true}));
  }
}
