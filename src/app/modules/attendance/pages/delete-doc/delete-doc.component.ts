import { DeleteComponent } from './../../../../shared/components/dialogs/delete/delete.component';
import { Subscription } from 'rxjs';
import { AttendanceService } from './../../attendance.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowPhotoComponent } from 'src/app/shared/components/dialogs/show-photo/show-photo.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationsComponent } from 'src/app/shared/components/dialogs/confirmations/confirmations.component';

@Component({
  selector: 'app-delete-doc',
  templateUrl: './delete-doc.component.html',
})
export class DeleteDocComponent implements OnInit, OnDestroy {
  formDeleteDoc!: FormGroup;
  imagesCurrentDoc: any[] = [];
  subscribe!: Subscription;
  id!: any;
  currentDoc: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private attendanceService: AttendanceService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    //pega dados do cliente atual selecionado
    this.currentDoc = JSON.parse(this.storageService.getItem('currentDoc')!);
    this.id = this.currentDoc.codigo;
    console.log(this.id);
    this.getDocumentById();

    this.createFormDelete();
    this.patchValueForm();
  }

  createFormDelete(){
    this.formDeleteDoc = this.formBuilder.group({
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
  }

  getDocumentById(){
    this.attendanceService.getClientById(this.id).subscribe({
      next:(value:any)=>{
        console.log(value);
        this.currentDoc = value;
        this.patchValueForm();
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }

  patchValueForm(){
    this.formDeleteDoc.patchValue({
      proposta:this.currentDoc['proposta'],
      falecimento:this.currentDoc['falecimento'],
      nome:this.currentDoc['cliente'],
      cpf:this.currentDoc['cpf'],
      email:this.currentDoc['email'],
      quadra:this.currentDoc['quadra'],
      setor:this.currentDoc['setor'],
      lote:this.currentDoc['lote']
    })
    this.imagesCurrentDoc = this.currentDoc.arquivos;
  }

  navegate(rota: any) {
    this.router.navigate([rota]);
  }

  //monta url para exibição da imagem
  replaceUrl(url: string) {
    url.replace('obito/', '');
    const newUrl = url.replace('obito/', '');
    return 'http://servidor-epica.cjc.local/docdigitalizados/' + newUrl;
  }

  openDialog(file: any, listFile: any) {
    this.dialog.open(ShowPhotoComponent, {
      data: { file: file, list: listFile },
    });
  }

  openDialogDelete(item: any) {
    console.log(item);

    const dialogRef = this.dialog.open(ConfirmationsComponent,{
      data: { title:'Atenção',message: 'Deseja realmente DELETAR o registro de '+ item.cliente+ ' ?' },
    });
    dialogRef.afterClosed().subscribe((res:any)=>{
      if(res){
        console.log(res);
        this.deleteDocScanner(item.codigo)
      }
    })
  }

  openDialogDeleteArquivo(item: any) {
    console.log(item.codigo);
    console.log(this.currentDoc['codigo']);

    const dialogRef = this.dialog.open(ConfirmationsComponent,{
      data: { title:'Atenção',message: 'Deseja realmente DELETAR a imagem do registro?' },
    });
    dialogRef.afterClosed().subscribe((res:any)=>{
      if(res){
        console.log(res);
        this.deleteArquivoDocScanner(this.currentDoc['codigo'],item.codigo)
      }
    })
  }

  deleteDocScanner(id:any){
    this.attendanceService.deleteClient(id).subscribe({
      next:(res:any)=>{
        this.router.navigate(['/atendimento/list'])
        localStorage.removeItem('currentListDoc');
        this._snackBar.open('Documento excluido com sucesso!', '', {
          duration: 3000,
          panelClass: ['sucess-alert'],
        });
      },
      error:(err:any)=>{
        this._snackBar.open('Erro ao excluir documento', '', {
          duration: 3000,
          panelClass: ['error-alert'],
        });
        console.log(err);

      }
    })
  }

  deleteArquivoDocScanner(idDoc:any,idArquivo:any){
    this.attendanceService.deleteArquivoClient(idDoc,idArquivo).subscribe({
      next:(res:any)=>{
        this.getDocumentById();

        localStorage.removeItem('currentListDoc');
        this._snackBar.open('Arquivo excluido com sucesso!', '', {
          duration: 3000,
          panelClass: ['sucess-alert'],
        });
      },
      error:(err:any)=>{
        this._snackBar.open('Erro ao excluir documento', '', {
          duration: 3000,
          panelClass: ['error-alert'],
        });
        console.log(err);

      }
    })
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
