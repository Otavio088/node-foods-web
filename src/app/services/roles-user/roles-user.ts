import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesUserService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getAll(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/user/roles`, {withCredentials: true}));
  }

  getOne(roleUserId: number): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/user/roles/${roleUserId}`, {withCredentials: true}));
  }

  create(body: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/user/roles`, body, {withCredentials: true}));
  }

  update(roleUserId: number, body: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.baseUrl}/user/roles/${roleUserId}`, body, {withCredentials: true}));
  }

  delete(roleUserId: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/user/roles/${roleUserId}`, {withCredentials: true}));
  }

  getModules(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/modules`, {withCredentials: true}));
  }
}
