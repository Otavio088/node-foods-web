import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngredientsService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getAll(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/ingredients`, {withCredentials: true}));
  }

  getOne(roleUserId: number): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/ingredients/${roleUserId}`, {withCredentials: true}));
  }

  create(body: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/ingredients`, body, {withCredentials: true}));
  }

  update(roleUserId: number, body: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.baseUrl}/ingredients/${roleUserId}`, body, {withCredentials: true}));
  }

  delete(roleUserId: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/ingredients/${roleUserId}`, {withCredentials: true}));
  }
}
