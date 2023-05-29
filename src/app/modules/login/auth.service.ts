import { Token } from './token';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/uUser';
import { environment } from 'src/environments/environment';
import { LoginToken } from './login-token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endpoint = `${environment.baseUrl}auth`;

  private token?: LoginToken;

  private lastUrl!: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    ) {

    this.lastUrl = btoa('/');
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.lastUrl = btoa(e.url);
      }
    });
    this.loadCredentials();

   }

  login(user: IUser): Observable<Token>{

    const encoded = btoa(user.username + ':' + user.password);

    return this.httpClient.post<Token>( `${this.endpoint}`, encoded).pipe(
      tap(token => this.registerCredentials(token)),
      take(1)
    );

  }

  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }


  isLoggedIn(): boolean {
    return this.loadCredentials();
  }


  handleLoggin(path: string = this.lastUrl): void {
    this.router.navigate(['/login', atob(path)]);
  }

  private registerCredentials(token: Token): void {
    this.token = new LoginToken(token);
    localStorage.setItem('token', token['token']);
  }

  private loadCredentials(): boolean {

    if (this.token === undefined) {
      const token = localStorage.getItem('token');

      if (token) {

        this.token = new LoginToken({ token: token });
      }
    }
    const loaded: boolean = !!this.token && this.token.isValid;

    if (!loaded) {
      this.unRegisterCredentials();
    }

    return loaded;
  }

  get obterUsuarioLogado(): IUser {
    const usuario = localStorage.getItem('user')
    return localStorage.getItem('user')
      ? JSON.parse(atob(usuario!))
      : null;
  }

  private unRegisterCredentials(): void {
    this.token = undefined;
    localStorage.removeItem('token');
  }

  get obterTokenUsuario(): any {
    const token = localStorage.getItem('token')
    if(token != null || undefined){
      return token!
      }
    else{
      return null
    }
  }

  logged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  getName(): string | undefined {
    return this.token?.name;
  }

  getToken(): string | undefined {
    return this.token?.jwtToken;
  }


}
