import { Router } from '@angular/router';
import { catchError, EMPTY, of, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {


  baseUrl: string = environment.baseUrl;
  listError = JSON.parse(this.storage.getItem('listaEmailsErros')!) || [];

  constructor(
    private httpClient:HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private storage: StorageService
    ) { }

  getContracts(dados:any){
    return this.httpClient.post(this.baseUrl + 'envioEmail/search' ,dados).pipe(
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
          this.listError.push({ item: 'novo item' });

        }else{
          this._snackBar.open( 'Algum erro ocorreu comunique o TI.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        }
        return EMPTY;
      })
    );
  }

  sendEmails(dados:any){
    return this.httpClient.post(this.baseUrl + 'envioEmail/send' ,dados,{observe: 'response'}).pipe(
      take(1),catchError(error => {
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
          return of({error:error, res:dados})
        }else{
          this._snackBar.open( 'Algum erro ocorreu comunique o TI.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
          setTimeout(() => {
            window.location.reload();
          }, 4000);
          return of({error:error, res:dados})
        }
      })

    );

  }

  getContractsSms(dados:any){
    return this.httpClient.post(this.baseUrl + 'envioSms/search' ,dados).pipe(
      take(1),
      catchError((error) => {
        // se ocorrer erro na busca de registro
        console.log(error.status);
        if(error.status === 401){
          this.router.navigate(['login']);
          this._snackBar.open( 'Acesso expirado! faça login novamente.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
        }else{
          this._snackBar.open( 'Algum erro ocorreu comunique o TI.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        }
        return EMPTY;
      })
    );
  }

  sendSms(dados:any){
    return this.httpClient.post(this.baseUrl + 'envioSms/send' ,dados,{observe: 'response'}).pipe(
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



        }else{
          this._snackBar.open( 'Algum erro ocorreu comunique o TI.', '', {
            duration: 5000,
            panelClass: ['error-alert'],
          });
          /*
          setTimeout(() => {
            window.location.reload();
          }, 4000);*/
        }
        return EMPTY;
      })
    );

  }
}
