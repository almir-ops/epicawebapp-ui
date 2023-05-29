import { AccessService } from './access.service';
import { StorageService } from './../../shared/services/storage.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsComponent } from 'src/app/shared/components/dialogs/alerts/alerts.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin!: FormGroup;

  invalidUser: boolean = false;

  styleBtn: any = '';
  styleBorderUser: any = '';
  styleBorderPassword: any = '';

  user: string = '';
  password: string = '';

  userNull: boolean = false;
  passwordNull: boolean = false;

  token: any;

  hiddenPassword: boolean = false;
  checked: boolean = false;

  isLoading: boolean = false;

  subscribe!: Subscription;

  msgAlert!: string;
  enableLogin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private storage: StorageService,
    public dialog: MatDialog,
    private accessSevice: AccessService
  ) {}

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      username: [this.storage.getItem('user'), Validators.required],
      password: ['', Validators.required],
    });

    this.enableBtnLogin();
    this.storage.deleteAllStorage();
  }

  login() {
    //console.log(this.formLogin.valid);
    const { username, password } = this.formLogin.getRawValue();
    if (username != '' && this.password?.length > 4) {
      const data = this.formLogin.value;
      this.storage.setItem('username', username);
      this.isLoading = true;

      this.subscribe = this.authService.login(data).subscribe({
          next: (response:any) =>{
            this.token = localStorage.getItem('token');
            this._snackBar.open('Login efetuado com sucesso!', '', {
              duration: 3000,
              panelClass: ['sucess-alert'],
            });
            this.router.navigate(['/']); //provisório
            this.accessSevice.getPermissions();
            this.isLoading = false;
          },
          error: (err)=> {
            console.log('Erro => '+ JSON.parse(err));

            this.isLoading = false;
            if(JSON.parse(err) === "400"){
              this.msgAlert = 'Usuário ou senha inválido(s).';
              this.invalidUser = true;
            }else if(JSON.parse(err) === "423"){
              console.log('Usuario Bloq');
              this.msgAlert = 'Usuário bloqueado.';
              this.invalidUser = true;
            }else{
              this.msgAlert = 'Algum erro ocorreu, favor comunicar o setor de TI';
              this.invalidUser = true;
            }
          },
          complete: ()=>{
            console.log('complete');

          }
        }
      );

      if (this.checked) {
        localStorage.setItem('user', username);
      }
    }
  }

  enableBtnLogin() {
    const { username, password } = this.formLogin.getRawValue();
    this.password = password;
    if (username != '' && this.password?.length > 4) {
      this.styleBtn = 'hover:bg-green-800 bg-green-700 cursor-pointer';
      this.enableLogin = true;
    } else {
      this.styleBtn = 'bg-gray-300';
      this.enableLogin = false;
    }
  }

  showAlertUser() {
    const { username } = this.formLogin.getRawValue();
    this.user = username;
    if (this.user?.length < 1 || this.user?.length === undefined) {
      this.userNull = true;
      this.styleBorderUser = 'border-red-400';
    }
    if (this.user?.length > 0) {
      this.userNull = false;
      this.styleBorderUser = '';
    }
  }

  showAlertPassword() {
    const { password } = this.formLogin.getRawValue();
    this.password = password;
    if (this.password?.length < 1 || this.password?.length === undefined) {
      this.passwordNull = true;
      this.styleBorderPassword = 'border-red-400';
    }
    if (this.password?.length > 0) {
      this.passwordNull = false;
      this.styleBorderPassword = '';
    }
  }

  viewPassword() {
    this.hiddenPassword = !this.hiddenPassword;
  }

  closeAlert() {
    this.invalidUser = !this.invalidUser;
  }

  forgotPassword() {
    this.dialog.open(AlertsComponent, {
      data: { message: 'Por favor contate o suporte para recuperar a senha.' },
    });
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
