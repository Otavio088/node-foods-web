import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getAll(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/users`, {withCredentials: true}));
  }

  getOne(userId: number): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/users/${userId}`, {withCredentials: true}));
  }

  create(body: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/users`, body, {withCredentials: true}));
  }

  update(userId: number, body: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.baseUrl}/users/${userId}`, body, {withCredentials: true}));
  }

  delete(userId: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/users/${userId}`, {withCredentials: true}));
  }
}
