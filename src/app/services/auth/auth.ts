import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';
  
  loginUser(body: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/auth/login`, body, {withCredentials: true}));
  }

  checkUser(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/auth/user`, {withCredentials: true}));
  }
}
