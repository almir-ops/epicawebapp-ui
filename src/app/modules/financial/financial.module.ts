import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialComponent } from './financial.component';
import { SendEmailComponent } from './pages/send-email/send-email.component';
import { SendSmsComponent } from './pages/send-sms/send-sms.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/material-module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { MatTableCheckboxComponent } from './components/mat-table-checkbox/mat-table-checkbox.component';
import { InformationsComponent } from './components/informations/informations.component';


@NgModule({
  declarations: [
    SendEmailComponent,
    SendSmsComponent,
    FinancialComponent,
    MatTableCheckboxComponent,
    InformationsComponent
  ],
  imports: [
    CommonModule,
    FinancialRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    SharedModule,
    FormsModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: true
    }),
  ]
})
export class FinancialModule { }
