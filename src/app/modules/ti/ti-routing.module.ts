import { EditUserComponent } from './permissioes/edit-user/edit-user.component';
import { ListUsersComponent } from './permissioes/list-users/list-users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesGuard } from 'src/app/core/guards/roles.guard';
import { TiComponent } from './ti.component';
import { VerifcaArquivosComponent } from './verifca-arquivos/verifca-arquivos.component';
import { SingleUserComponent } from './permissioes/single-user/single-user.component';
import { AddGroupComponent } from './permissioes/add-group/add-group.component';

const routes: Routes = [
  {
    path:'' , component:TiComponent,
    children: [
      {
        path:'verifica-arquivos' , component:VerifcaArquivosComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['TI_VERIFICA']
        }
      },
      {
        path:'lista-usuarios' , component:ListUsersComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['TI_PERMISSOES']
        }
      },
      {
        path:'novo-usuario' , component:SingleUserComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['TI_PERMISSOES']
        }
      },
      {
        path:'adicionar-grupo' , component:AddGroupComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['TI_PERMISSOES']
        }
      },
      {
        path:'editar-usuario/:id' , component:EditUserComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['TI_PERMISSOES']
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiRoutingModule { }
