import { User } from './../interfaces/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

type ApiResponseUser = { status: boolean, message: string , data?: User, errors?:string, token?: string};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  API = environment.API;
  token = localStorage.getItem('tokenUser');
  httpHeaders = new HttpHeaders().append('Authorization', 'Bearer ' + this.token);

  httpClient = inject(HttpClient);

  register(form: Partial<{name: string, email: string, password: string}>): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.post<ApiResponseUser>(this.API + '/register', form));
  }

  login(form: Partial<{email: string, password: string}>): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.post<ApiResponseUser>(this.API + '/login', form));
  }

  profile(): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.get<ApiResponseUser>(this.API + '/user/profile', {headers: this.httpHeaders})
    )
  }

  update(form: Partial<{name: string, email: string}>): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.put<ApiResponseUser>(this.API + "/user/update", form ,{headers: this.httpHeaders})
    )
  }

  logout(): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.get<ApiResponseUser>(this.API + "/user/logout", {headers: this.httpHeaders})
    )
  }

  delete(): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.delete<ApiResponseUser>(this.API + "/user/delete", {headers: this.httpHeaders})
    )
  }
}
