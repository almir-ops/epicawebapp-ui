import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiscalRoutingModule } from './fiscal-routing.module';
import { NoteListComponent } from './pages/note-list/note-list.component';
import { EditNoteComponent } from './pages/edit-note/edit-note.component';
import { DemoMaterialModule } from 'src/app/material-module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FiscalComponent } from './fiscal.component';
import { InformationsComponent } from './components/dialogs/informations/informations.component';
import { ConfirmationComponent } from './components/dialogs/confirmation/confirmation.component';


@NgModule({
  declarations: [
    FiscalComponent,
    NoteListComponent,
    EditNoteComponent,
    InformationsComponent,
    ConfirmationComponent
  ],
  imports: [
    CommonModule,
    FiscalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    SharedModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: true
    }),

  ]
})
export class FiscalModule { }
