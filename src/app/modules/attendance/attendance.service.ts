import { environment } from './../../../environments/environment';
import { AuthService } from './../login/auth.service';
import { uClient } from '../../shared/interfaces/uClient';
import { Injectable } from '@angular/core';
import { map, Observable, take, tap } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  baseUrl: string = environment.baseUrl;

  constructor(
    private httpClient: HttpClient, httpBackend: HttpBackend
    ) {}

  getClient(){
    return this.httpClient.get<uClient[]>(this.baseUrl + '/clientes');
  }

  getClientById(id:any){
    return this.httpClient.get<uClient[]>(this.baseUrl + 'scanner/documento/' + id).pipe(take(1));
  }

  getClientByParams(params: uClient[]): Observable<any>{
    return this.httpClient.post<uClient>(`${this.baseUrl}scanner/search` , params);
  }

  getProductsByCpf(cpfcnpj:any): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}ret-cliente/`+ cpfcnpj).pipe(take(1));
  }

  createClient(data: uClient, arquivos: File){
    console.log(this.baseUrl + 'scanner/save');
    return this.httpClient.post<uClient>(this.baseUrl + '/scanner/save', data).pipe(take(1));
  }

  updateClient(id: any ,data: uClient){
    return this.httpClient.put<uClient>(this.baseUrl + '/clientes/' + id, data).pipe(take(1));;
  }

  deleteClient(id:any){
    return this.httpClient.delete<uClient>(this.baseUrl + 'scanner/'+ id)
  }

  deleteArquivoClient(idDoc:any, idArquivo:any){
    return this.httpClient.delete<uClient>(this.baseUrl + 'scanner/arquivo/'+ idDoc + '/' + idArquivo)
  }
}
