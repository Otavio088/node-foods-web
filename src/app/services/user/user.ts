import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class User {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getAll(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/users`, {withCredentials: true}));
  }

  getUser(userId: number): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/users/${userId}`, {withCredentials: true}));
  }
}
