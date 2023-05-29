import { StorageService } from './../../../../shared/services/storage.service';
import { Subscription } from 'rxjs';
import { ShowPhotoComponent } from './../../../../shared/components/dialogs/show-photo/show-photo.component';
import { uClient } from '../../../../shared/interfaces/uClient';
import { AttendanceService } from '../../attendance.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-details-doc',
  templateUrl: './details-doc.component.html',
})
export class DetailsDocComponent implements OnInit, OnDestroy {
  formViewDoc!: FormGroup;
  imagesCurrentDoc: any[] = [];
  subscribe!: Subscription;
  currentDoc: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    //pega dados do cliente atual selecionado
    this.currentDoc = JSON.parse(this.storageService.getItem('currentDoc')!);
    console.log(this.currentDoc);

    this.formViewDoc = this.formBuilder.group({
      proposta: [
        { value: this.currentDoc['proposta'], disabled: true },
        Validators.required,
      ],
      falecimento: [
        { value: this.currentDoc['falecimento'], disabled: true },
        Validators.required,
      ],
      nome: [
        { value: this.currentDoc['cliente'], disabled: true },
        Validators.required,
      ],
      cpf: [
        { value: this.currentDoc['cpf'], disabled: true },
        Validators.required,
      ],
      email: [
        { value: this.currentDoc['email'], disabled: true },
        Validators.required,
      ],
      quadra: [
        { value: this.currentDoc['quadra'], disabled: true },
        Validators.required,
      ],
      setor: [
        { value: this.currentDoc['setor'], disabled: true },
        Validators.required,
      ],
      lote: [
        { value: this.currentDoc['lote'], disabled: true },
        Validators.required,
      ],
    });

    //pega arquivos de imagens do cliente selecionado
    this.imagesCurrentDoc = this.currentDoc.arquivos;
  }

  navegate(rota: any) {
    this.router.navigate([rota]);
  }

  //abre componente de exibir imagem enviando img selecionada e lista de imagens do cliente selecionado
  openDialog(file: any, listFile: any, index: any) {
    this.dialog.open(ShowPhotoComponent, {
      data: { file: file, list: listFile, fileIndex: index },
    });

  }
  formataData(data:any){
    if(data === null || data === ''){
      return data;
    }else {
      return formatDate(data,'dd/MM/yyyy','en')
    }
  }
  //monta url para exibição da imagem
  replaceUrl(url: string) {
    url.replace('obito/', '');
    const newUrl = url.replace('obito/', '');
    return 'http://servidor-epica.cjc.local/docdigitalizados/' + newUrl;
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
