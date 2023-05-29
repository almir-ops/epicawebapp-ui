import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ListDocsComponent } from './pages/list-docs/list-docs.component';
import { EditDocsComponent } from './pages/edit-docs/edit-docs.component';
import { NewDocComponent } from './pages/new-doc/new-doc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/material-module';
import { NgxMaskModule } from 'ngx-mask';
import { AttendanceComponent } from './attendance.component';
import { DetailsDocComponent } from './pages/details-doc/details-doc.component';
import { DeleteDocComponent } from './pages/delete-doc/delete-doc.component';
import { BuscarProdutosComponent } from './pages/buscar-produtos/buscar-produtos.component';


@NgModule({
  declarations: [
    AttendanceComponent,
    ListDocsComponent,
    EditDocsComponent,
    DetailsDocComponent,
    DeleteDocComponent,
    NewDocComponent,
    BuscarProdutosComponent,
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
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
export class AttendanceModule { }
