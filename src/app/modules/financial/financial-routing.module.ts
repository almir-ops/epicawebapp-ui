import { SendSmsComponent } from './pages/send-sms/send-sms.component';
import { SendEmailComponent } from './pages/send-email/send-email.component';
import { FinancialComponent } from './financial.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesGuard } from 'src/app/core/guards/roles.guard';

const routes: Routes = [
  {
    path:'', component:FinancialComponent,
    children:[
      {path:'envia-email', component: SendEmailComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['FN_ENVIA_COB']
        }

      },
      {path:'envia-sms', component: SendSmsComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['FN_ENVIA_COB']
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialRoutingModule { }
