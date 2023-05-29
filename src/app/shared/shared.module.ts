import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { PipesModule } from './pipes/pipes.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DemoMaterialModule } from '../material-module';
import { AlertsComponent } from './components/dialogs/alerts/alerts.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ShowPhotoComponent } from './components/dialogs/show-photo/show-photo.component';
import { ContadorComponent } from './components/contador/contador.component';
import { DeleteComponent } from './components/dialogs/delete/delete.component';
import { ConfirmationsComponent } from './components/dialogs/confirmations/confirmations.component';
import { MatTableComponent } from './components/mat-table/mat-table.component';
import { GruposComponent } from './components/dialogs/grupos/grupos.component';
import { AddGrupoComponent } from './components/dialogs/add-grupo/add-grupo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SideMenuComponent,
    NavbarComponent,
    LoadingComponent,
    AlertsComponent,
    DeleteComponent,
    CarouselComponent,
    ShowPhotoComponent,
    ContadorComponent,
    ConfirmationsComponent,
    MatTableComponent,
    GruposComponent,
    AddGrupoComponent,

  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    PipesModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SideMenuComponent,
    NavbarComponent,
    LoadingComponent,
    AlertsComponent,
    DeleteComponent,
    CarouselComponent,
    ShowPhotoComponent,
    ContadorComponent,
    MatTableComponent
  ]
})
export class SharedModule { }
