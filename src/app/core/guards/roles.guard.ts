import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertsComponent } from 'src/app/shared/components/dialogs/alerts/alerts.component';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {


  rolesUser = JSON.parse(localStorage.getItem('rolesUser')!);
  permissions = JSON.parse(localStorage.getItem('permisions')!);

  constructor(
    private router: Router,
    public dialog: MatDialog

  ){}

  canActivate(
    route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //console.log(this.rolesUser);

      if(route.data['roles'] != undefined && route.data['roles'].length && this.rolesUser != undefined && this.rolesUser.length){
        for (let index = 0; index < route.data['roles'].length; index++) {
          const element = route.data['roles'][index];
          for (let index = 0; index < this.rolesUser.length; index++) {
            const roleUser = this.rolesUser[index];
            //console.log(roleUser);
            //console.log(element);

            if(element === roleUser){
              //console.log(true);
              return true
            }
          }

        }
      }

    this.dialog.open(AlertsComponent,{data: {message: 'Você não tem acesso a este recurso.'}})
    return false;
  }



  /* protected checkRoute(activated: ActivatedRouteSnapshot): Observable<boolean>{
    if(typeof activated.data['roles'] != undefined){
      const rolesRoute = activated.data['roles'];

      return new Observable<boolean>(subs => {
        for (let index = 0; index < this.roles.length; index++){

          if(this.roles[index] === this.rolesUser){
          console.log(this.rolesUser);
          console.log(this.roles[index]);
          return subs.next(true);
        }else {
          this.router.navigate([''])
          return subs.next(false);
        }
      }
    });
  }
  return new Observable<boolean>(subs => subs.next(true));
      /* return new Observable<boolean>(subs => {
        if(this.rolesUser === '' || this.rolesUser === undefined){
          subs.next(false);

          this.router.navigate([''])
        }else {
          subs.next(true);
        }
      });
    }
    return new Observable<boolean>(subs => subs.next(true));
  }  */


}
