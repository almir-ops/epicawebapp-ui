import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiService {

  baseUrl: string = environment.baseUrl

  constructor(private httpClient: HttpClient) { }

  getUsers(){
    return this.httpClient.get(this.baseUrl + 'usuarios')
  }

  getUserById(id:any){
    return this.httpClient.get(this.baseUrl + 'usuarios/' + id)
  }

  setUser(user:any){
    return this.httpClient.post(this.baseUrl + 'usuarios', user)
  }

  deleteUser(id:any){
    return this.httpClient.delete(this.baseUrl + 'usuarios/' + id)
  }

  getGrupos(){
    return this.httpClient.get(this.baseUrl + 'grupos')
  }

  getFuncionalidades(){
    return this.httpClient.get(this.baseUrl + 'funcionalidades/list')
  }
}
