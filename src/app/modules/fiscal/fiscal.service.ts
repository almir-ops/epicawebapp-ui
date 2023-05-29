import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FiscalService {

  baseUrlteste: string = 'http://localhost:3000';
  baseUrl: string = environment.baseUrl
  baseUrlCep : string = "https://viacep.com.br/ws/";
  urlToJson = '/assets/estados-cidades/estados-cidades.json';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    ) { }

  getPayments(dataInicio: any, dataFinal: any, codigo:any){
    return this.httpClient.get(this.baseUrl + 'nfe/'+ dataInicio + '/'+ dataFinal + '/' + codigo).pipe(
      take(1),
      catchError((error) => {
        // se ocorrer erro na busca de registro
        console.log(error);
        console.log(error.status);
        if(error.status === 401){
          this.router.navigate(['login']);
          this._snackBar.open( 'Acesso expirado! faça login novamente.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
        }if(error.status === 409){
          this._snackBar.open( 'Algum erro ocorreu comunique o TI.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
        }else{
          this._snackBar.open( 'Algum erro ocorreu comunique o TI.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
        }
        return EMPTY;
      })
    );
  }

  getViaCep(cep:any){
    return this.httpClient.get(this.baseUrlCep + cep + '/json/').pipe(
      take(1),
      catchError((error) => {
        // se ocorrer erro na busca de registro
        console.log(error);
        console.log(error.status);
        if(error.status === 401){
          this.router.navigate(['login']);
          this._snackBar.open( 'Acesso expirado! faça login novamente.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
        }if(error.status === 409){
          this._snackBar.open( 'Algum erro ocorreu comunique o TI.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
        }else{
          this._snackBar.open( 'Algum erro ocorreu comunique o TI.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
        }
        return EMPTY;
      })
    );;
  }

  getCidades(){
    return this.httpClient.get(this.urlToJson);
  }

  getClient(cpfCnpj:any){
    return this.httpClient.get(this.baseUrl + 'cliente/' + cpfCnpj).pipe(
      take(1)
    );;
  }

  getServices(){
    return this.httpClient.get(this.baseUrl + 'nfe/servico');
  }

  getNotes(data:any){
    return this.httpClient.post(this.baseUrl + 'nfe/emitida', data);
  }

  sendNote(nfe:any){
    return this.httpClient.post(this.baseUrl + 'nfe/send',nfe,{ responseType: 'text' });
  }

  sendRps(codNfe:any){
    return this.httpClient.post(this.baseUrl + 'nfe/enviaRps/' + codNfe,{ responseType: 'text' });
  }

  searchRPS(codNfe:any){
    return this.httpClient.get(this.baseUrl + 'nfe/searchRPS/' + codNfe);
  }
}
