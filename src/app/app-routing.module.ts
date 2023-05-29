import { RolesGuard } from './core/guards/roles.guard';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
    canActivate:[]
  },
   {
    path: '',
    component: HomeComponent,
    canActivate:[AuthenticatedGuard],
  },
  {
    path: 'atendimento',
    loadChildren: () =>
    import('./modules/attendance/attendance.module').then((m) => m.AttendanceModule
    ),
    canActivate:[AuthenticatedGuard]
  },
  {
    path: 'financeiro',
    loadChildren: () =>
    import('./modules/financial/financial.module').then((m) => m.FinancialModule
    ),
    canActivate:[AuthenticatedGuard]
  },
  {
    path: 'fiscal',
    loadChildren: () =>
    import('./modules/fiscal/fiscal.module').then((m) => m.FiscalModule
    ),
    canActivate:[AuthenticatedGuard]
  },
  {
    path: 'ti',
    loadChildren: () =>
    import('./modules/ti/ti.module').then((m) => m.TiModule
    ),
    canActivate:[AuthenticatedGuard]
  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
