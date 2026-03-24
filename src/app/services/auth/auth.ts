import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';
  private user: any = {};
  
  loginUser(body: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/auth/login`, body, {withCredentials: true}));
  }

  async logoutUser(): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/auth/logout`, {}, {withCredentials: true}))
      .then((res: any) => this.user = {});
  }

  async checkUser(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/auth/user`, {withCredentials: true}))
      .then((res: any) => this.user = res.user);
  }

  getUser() {
    return this.user;
  }
}
