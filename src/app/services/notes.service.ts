import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../interfaces/note';

type ApiResponseUser = { status: boolean, message: string , data?: Note[], errors?:string, token?: string};
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  API = environment.API;
  token = localStorage.getItem('tokenUser');
  httpHeaders = new HttpHeaders().append('Authorization', 'Bearer ' + this.token);

  httpClient = inject(HttpClient);

  add(form: Partial<{title: string, description: string}>): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.post<ApiResponseUser>(this.API + '/note/add', form, {headers: this.httpHeaders}));
  }

  update(form: Partial<{title: string, description: string}>, id: number): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.put<ApiResponseUser>(this.API + '/note/update/' + id, form, {headers: this.httpHeaders}));
  }

  delete(id: number): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.delete<ApiResponseUser>(this.API + '/note/delete/' + id, {headers: this.httpHeaders}));
  }

  notes(): Promise<ApiResponseUser> {
    return firstValueFrom(
      this.httpClient.get<ApiResponseUser>(this.API + '/note/notes', {headers: this.httpHeaders}));
  }
}
