import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiRoutingModule } from './ti-routing.module';
import { VerifcaArquivosComponent } from './verifca-arquivos/verifca-arquivos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/material-module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { ListUsersComponent } from './permissioes/list-users/list-users.component';
import { SingleUserComponent } from './permissioes/single-user/single-user.component';
import { EditUserComponent } from './permissioes/edit-user/edit-user.component';
import { AddGroupComponent } from './permissioes/add-group/add-group.component';


@NgModule({
  declarations: [
    VerifcaArquivosComponent,
    ListUsersComponent,
    SingleUserComponent,
    EditUserComponent,
    AddGroupComponent
  ],
  imports: [
    CommonModule,
    TiRoutingModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: true
    }),
  ]
})
export class TiModule { }
