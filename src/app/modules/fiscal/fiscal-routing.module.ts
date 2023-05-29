import { EditNoteComponent } from './pages/edit-note/edit-note.component';
import { FiscalComponent } from './fiscal.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesGuard } from 'src/app/core/guards/roles.guard';
import { NoteListComponent } from './pages/note-list/note-list.component';

const routes: Routes = [
  {
    path:'', component:FiscalComponent,
    children:[
      {path:'listar-notas', component: NoteListComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['FS_LER_NOTA']
        }

      },
      {path:'gerar-nota', component: EditNoteComponent,
        canActivate:[RolesGuard],
        data:{
          roles:['FS_EDITAR_NOTA']
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiscalRoutingModule { }
