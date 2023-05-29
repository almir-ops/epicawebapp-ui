import { DeleteDocComponent } from './pages/delete-doc/delete-doc.component';
import { AuthenticatedGuard } from './../../core/guards/authenticated.guard';
import { RolesGuard } from './../../core/guards/roles.guard';
import { EditDocsComponent } from './pages/edit-docs/edit-docs.component';
import { AttendanceComponent } from './attendance.component';
import { ListDocsComponent } from './pages/list-docs/list-docs.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewDocComponent } from './pages/new-doc/new-doc.component';
import { DetailsDocComponent } from './pages/details-doc/details-doc.component';
import { BuscarProdutosComponent } from './pages/buscar-produtos/buscar-produtos.component';

const routes: Routes = [
  {
    path:'', component:AttendanceComponent,
    children:[
      {
        path:'list', component: ListDocsComponent
      },
      {
        path:'new', component: NewDocComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['AT_CRIAR_DOC']
        }
      },
      {
        path:'details', component: DetailsDocComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['AT_LER_DOC']
        }
      },
      {
        path:'edit', component: EditDocsComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['AT_EDITAR_DOC']
        }
      },
      {
        path:'delete', component: DeleteDocComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['AT_EXCLUIR_DOC']
        }
      },
      {
        path:'buscar-produtos', component: BuscarProdutosComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['AT_EDITAR_DOC']
        }
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
