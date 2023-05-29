import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsComponent } from 'src/app/shared/components/dialogs/alerts/alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(
    private router:Router,
    public dialog: MatDialog,

  ) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // manipule o erro 401 aqui
          //window.location.reload();
          this.router.navigate(['/login']);
          this.dialog.open(AlertsComponent, {
            data: { message: 'Acesso expirado! faça login novamente para continuar.', found: false},
          });
        }
        return throwError(error);
      })
    );
  }
}
