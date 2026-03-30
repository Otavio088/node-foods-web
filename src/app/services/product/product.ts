import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getAll(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/products`, {withCredentials: true}));
  }

  getOne(userId: number): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/products/${userId}`, {withCredentials: true}));
  }

  create(body: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/products`, body, {withCredentials: true}));
  }

  update(userId: number, body: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.baseUrl}/products/${userId}`, body, {withCredentials: true}));
  }

  delete(userId: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/products/${userId}`, {withCredentials: true}));
  }
}
