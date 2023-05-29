import { catchError, EMPTY, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceService } from '../../attendance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ShowPhotoComponent } from 'src/app/shared/components/dialogs/show-photo/show-photo.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertsComponent } from 'src/app/shared/components/dialogs/alerts/alerts.component';

@Component({
  selector: 'app-edit-docs',
  templateUrl: './edit-docs.component.html',
})
export class EditDocsComponent implements OnInit, OnDestroy {
  formEditDoc!: FormGroup;
  imagesCurrentDoc: any[] = [];
  subscribe!: Subscription;
  currentDoc: any;
  imageFile!: File;
  baseUrl: string = environment.baseUrl;
  listImageFile: any[]=[];
  listImageFile2: any[]=[];

  @ViewChild('myInputFiles')myInputVariable!: ElementRef;
  isLoading: boolean = false;
  selectedFiles?: FileList;

  selectedScanner:any;
  scanners: any[]=['SCANNER_1', 'SCANNER_2'];
  currentScanner: any;
  currentData: any;
  newData: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private attendanceService: AttendanceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private storageService: StorageService,
    private http: HttpClient,

  ) {}

  ngOnInit(): void {

    //pega dados do cliente atual selecionado
    this.currentDoc = JSON.parse(this.storageService.getItem('currentDoc')!);
    console.log(this.currentDoc);

    this.creatForm();

    //pega arquivos de imagens do cliente selecionado
    this.listImageFile = this.currentDoc.arquivos;

    //pega ultimo scanner selecionado
    this.currentScanner = localStorage.getItem('currentScanner')!
    this.selectCurrentScanner(this.currentScanner);

  }

  creatForm(){

    this.formEditDoc = this.formBuilder.group({
      codigo: [
        { value: this.currentDoc['codigo'], disabled: false },
        Validators.required,
      ],
      proposta: [
        { value: this.currentDoc['proposta'], disabled: false },
        Validators.required,
      ],
      falecimento: [
        { value: this.currentDoc['falecimento'], disabled: false },
        Validators.required,
      ],
      nome: [
        { value: this.currentDoc['cliente'], disabled: false },
        Validators.required,
      ],
      cpf: [
        { value: this.currentDoc['cpf'], disabled: false },
        Validators.required,
      ],
      email: [
        { value: this.currentDoc['email'], disabled: false },
        Validators.required,
      ],
      quadra: [
        { value: this.currentDoc['quadra'], disabled: false },
        Validators.required,
      ],
      setor: [
        { value: this.currentDoc['setor'], disabled: false },
        Validators.required,
      ],
      lote: [
        { value: this.currentDoc['lote'], disabled: false },
        Validators.required,
      ],
      scanner: ['']
    });

  }
  //Cria lista para pré-visualizar imagens carregadas
  onFileInput(event: any) {
    this.selectedFiles = event.target.files;
    //this.clearList(this.listImageFile)
    this.listImageFile2.push(this.selectedFiles)
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.listImageFile.push({url: e.target.result, arquivo_destino: this.selectedFiles!.item(i)?.name});
        };
        reader.readAsDataURL(this.selectedFiles[i]);

      }
    }
  }

  //Monta url para exibição da imagem
  replaceUrl(url: string) {
    url.replace('obito/', '');
    const newUrl = url.replace('obito/', '');
    return 'http://servidor-epica.cjc.local/docdigitalizados/' + newUrl;
  }

  back(rota: any) {
    this.router.navigate([rota]);
  }

  save() {
    this.isLoading = true
    const data = this.formEditDoc.getRawValue();

          if (data) {

            this.http
            .post(this.baseUrl + 'scanner/save', this.getFormData(),{
              reportProgress: true,
              responseType: 'text',
              observe: 'response'
            }).pipe(
              catchError((error) => {
              // se ocorrer erro na busca de registro
              console.error(JSON.parse(error));
              if(JSON.parse(error) === "401"){
                this.router.navigate(['login'])
                this._snackBar.open('Acesso expirado! faça login novamente.', '', {
                  duration: 3000,
                  panelClass: ['error-alert'],
                });
              }else{
                this._snackBar.open('ERRO: '+ JSON.parse(error), '', {
                  duration: 3000,
                  panelClass: ['error-alert'],
                });
              }
              return EMPTY;
            }))
            .subscribe({
              next:(res:any) => {
                console.log(res.status);
                if(res.status === 200){
                  this._snackBar.open('Documento salvo com sucesso!', '', {
                    duration: 3000,
                    panelClass: ['sucess-alert'],
                  });

                  setTimeout(() => {
                    this.myInputVariable.nativeElement.value = "";
                    let newDoc = this.formEditDoc.getRawValue();
                    this.storageService.deleteItem('currentListDoc');
                    this.formEditDoc.controls['falecimento'].setValue(this.getFormData().get('falecimento'));
                  });
                  }else{
                    this._snackBar.open('Erro ao salvar o documento', '', {
                      duration: 3000,
                      panelClass: ['error-alert'],
                    });

                }
                this.isLoading = false;
              },
              error:(err) =>{
                console.log('erro' + err.status);

                if(err.status === 504){
                  console.log('ERRO: '+ err.status + ' Gateway Timeout' );
                }
                if(err.status === 401){
                  console.log('ERRO: '+ err.status + ' Token expirado' );
                  this.router.navigate(['login'])
                }if(err.status === 400){
                  console.log('ERRO: '+ err.status + ' Midia incompativel' );
                  this.router.navigate(['login'])
                }
                else{
                  this._snackBar.open('Acesso experiado! Faça login novamente.', '', {
                  duration: 3000,
                  panelClass: ['error-alert'],
                  })
                }
                this.isLoading = false;
              }
            });
          }

  }

  //Deixa qualquer letra do campo QUADRA maiuscula
  upperTextQuadra(){
    const quadraUpper = this.formEditDoc.controls['quadra'].value.toUpperCase();
    this.formEditDoc.get('quadra')?.setValue(quadraUpper);
  }

  //Monta o formdata para post na api
  private getFormData(): FormData {
    const formData = new FormData();
    const{
      codigo,
      proposta,
      falecimento,
      nome,
      cpf,
      quadra,
      setor,
      email,
      lote
    } = this.formEditDoc.getRawValue();

    formData.append('codigo', codigo);
    formData.append('proposta', proposta);
    formData.append('falecimento', falecimento);
    formData.append('nome', nome);
    formData.append('cpf', cpf);
    formData.append('quadra', quadra);
    formData.append('setor', setor);
    formData.append('email', email);
    formData.append('lote', lote);

    console.log(this.selectedScanner);

    formData.append('scanner', this.selectedScanner);

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('file',this.selectedFiles[i]);
      }
    }

    return formData;
  }

  //Pega ultima opção selecionada do scanner
  selectCurrentScanner(currentScanner:any){
    if(currentScanner === 'SCANNER_1'){
      this.selectedScanner = this.scanners[0];
    }else if (currentScanner === 'SCANNER_2'){
      this.selectedScanner = this.scanners[1];
    }else{
      this.selectedScanner = this.scanners[0];
    }
  }

  //Formata data para dd/MM/yyyy
  formataStringData(data:any) {
    this.currentData = data;
    var ano  = data.split("-")[0];
    var mes  = data.split("-")[1];
    var dia  = data[8] + data [9];
    return ("0"+dia).slice(-2) + '/' + ("0"+mes).slice(-2) + '/' + ano;
  // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

  navegate(rota: any) {
    this.router.navigate([rota]);
  }

  //abre componente de exibir imagem enviando img selecionada e lista de imagens do cliente selecionado
  openDialog(file: any, listFile: any, index: any) {
    console.log(listFile);

    this.dialog.open(ShowPhotoComponent, {
      data: { file: file, list: listFile, fileIndex: index },
    });
  }

  openDeleteDialog(file: any){

    this.dialog.open(AlertsComponent,{data: {message: 'Você não tem acesso a este recurso.'}})

    /*this.dialog.open(DeleteComponent);*/
  }

  //Limpa qualquer lista
  clearList(list:any){
    while(list.length > 0){
      list.pop();
    }
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
