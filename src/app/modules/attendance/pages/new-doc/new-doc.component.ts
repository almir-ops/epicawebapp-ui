import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { uClient } from './../../../../shared/interfaces/uClient';
import { Observable, Subscription, catchError, EMPTY, map } from 'rxjs';
import { AttendanceService } from './../../attendance.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ShowPhotoComponent } from 'src/app/shared/components/dialogs/show-photo/show-photo.component';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-new-doc',
  templateUrl: './new-doc.component.html',
})
export class NewDocComponent implements OnInit, OnDestroy {

  @ViewChild('myInputFiles')myInputVariable!: ElementRef;

  baseUrl: string = environment.baseUrl;

  newDoc: any;

  formNewDoc!: FormGroup;
  formNewDocData!: FormData;
  subscribe!: Subscription;

  imageFile!: File;
  listImageFile: any[]=[];
  listImageFile2: any[]=[];

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  imageInfos?: Observable<any>;
  currentClient!: uClient;

  listDocSaves: any[] = [];
  titleContador = 'Registro salvos';
  messageContador = ''
  closeContador!: boolean;

  loading: boolean = false;

  selectedScanner:any;
  scanners: any[]=['SCANNER_1', 'SCANNER_2'];
  currentScanner: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private attendanceService: AttendanceService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    public dialog: MatDialog,
    public storage: StorageService,
  ) {}

  ngOnInit(): void {

    this.createForm();

    this.currentScanner = localStorage.getItem('currentScanner')!;

    this.selectCurrentScanner(this.currentScanner);

    this.getCurrentDocSave();
  }

  createForm(){
    this.formNewDoc = this.formBuilder.group({

      proposta: [''],
      falecimento: [''],
      nome: [''],
      cpf: [''],
      email: [''],
      quadra: [''],
      setor: [''],
      lote: [''],
      scanner: ['']
      });
  }

  onFileInput(event: any) {
    this.selectedFiles = event.target.files;
    this.clearList(this.listImageFile)
    this.listImageFile2.push(this.selectedFiles)
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.listImageFile.push({url: e.target.result, nameFile: this.selectedFiles!.item(i)?.name});
        };
        reader.readAsDataURL(this.selectedFiles[i]);

      }
    }

  }

  back(rota: any) {
    this.router.navigate([rota]);
  }


  save() {
    this.loading = true;
    this.storage.setArray('currentDocSave',this.listDocSaves);
    localStorage.setItem('currentScanner', this.formNewDoc.value['scanner']);

    const data = this.getFormData();

    if (data) {
        //this.attendanceService.createClient(this.getFormData).subscribe()
        this.formNewDoc.controls['proposta'].setValue(this.generatorProposta(this.formNewDoc.value['proposta']));

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
                this.listImageFile = [];
                let newDoc = this.formNewDoc.getRawValue();
                this.setCurrentDocSave(newDoc);
                this.messageContador = this.listDocSaves.length + ' Documento(s) salvos'
                this.formNewDoc.controls['proposta'].reset();
                this.formNewDoc.controls['nome'].reset();
                this.formNewDoc.controls['falecimento'].reset();
                this.formNewDoc.controls['cpf'].reset();
                this.formNewDoc.controls['email'].reset();
                this.formNewDoc.controls['quadra'].reset();
                this.formNewDoc.controls['setor'].reset();
                this.formNewDoc.controls['email'].reset();
                this.formNewDoc.controls['lote'].reset();

                this.closeContador = false;
              }, 500);

              }else{
                this._snackBar.open('Erro ao salvar o documento', '', {
                  duration: 3000,
                  panelClass: ['error-alert'],
                });

            }
            this.loading = false;
          },
          error:(err) =>{
            console.log('erro' + err.status);

            if(err.status === 504){
              console.log('ERRO: '+ err.status + ' Gateway Timeout' );
            }
            if(err.status === 401){
              console.log('ERRO: '+ err.status + ' Token expirado' );
              this.router.navigate(['login'])
            }else{
              this.router.navigate(['login'])
              this.loading = false;
              this._snackBar.open('Acesso experiado! Faça login novamente.', '', {
              duration: 3000,
              panelClass: ['error-alert'],
              })
            }
            this.loading = false;
          }
        });
    } else {
        this._snackBar.open('Preencha um nome para salvar', '', {
          duration: 3000,
          panelClass: ['error-alert'],
        });
        this.loading = false;

    }

  }

  //Monta o formdata para post na api
  private getFormData(): FormData {
    const formData = new FormData();

    for (const key in this.formNewDoc.value) {
      if (this.formNewDoc.value.hasOwnProperty(key)) {
        if(this.formNewDoc.value['proposta'] === '' || this.formNewDoc.value['proposta'] === ' ' || this.formNewDoc.value['proposta'] === null ){
          var data = new Date();
          var dia = String(data.getDate()).padStart(2, '0');
          var mes = String(data.getMonth() + 1).padStart(2, '0');
          var ano = data.getFullYear();
          var hora = String(data.getHours() + 1).padStart(2, '0');
          var min = data.getMinutes();
          var sec = data.getSeconds();
          var mls = data.getMilliseconds();

          this.formNewDoc.value['proposta'] = ano+mes+dia+hora+min+sec+mls
        }

        if(this.formNewDoc.value[key] === null){

          this.formNewDoc.controls[key].setValue('');
        }

        formData.append(key, this.formNewDoc.value[key]);

      }
    }
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('file',this.selectedFiles[i]);
      }
    }

    return formData;
  }

  //Deixa qualquer letra do campo quadra MAIUSCULA
  upperTextQuadra(){
    const quadraUpper = this.formNewDoc.controls['quadra'].value.toUpperCase();
    this.formNewDoc.get('quadra')?.setValue(quadraUpper);
  }

   //abre componente de exibir imagem enviando img selecionada e lista de imagens do cliente selecionado
   openDialog(file: any, listFile: any, index: any) {
    this.dialog.open(ShowPhotoComponent, {
      data: { file: file, list: listFile, fileIndex: index },
    });
  }

  //Formata data para dd/MM/yyyy
  formataStringData(data:any) {
      var ano  = data.split("-")[0];
      var mes  = data.split("-")[1];
      var dia  = data[8] + data [9];
      return ("0"+dia).slice(-2) + '/' + ("0"+mes).slice(-2) + '/' + ano;
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

  //Gera numero de proposta
  generatorProposta(proposta:any){
    if(proposta === null || proposta === ''){
      var data = new Date();
      var dia = String(data.getDate()).padStart(2, '0');
      var mes = String(data.getMonth() + 1).padStart(2, '0');
      var ano = data.getFullYear();
      var hora = String(data.getHours() + 1).padStart(2, '0');
      var min = data.getMinutes();
      var sec = data.getSeconds();
      var mls = data.getMilliseconds();
      return ano+mes+dia+hora+min+sec+mls;
    }else{
      return proposta
    }
  }

  //Desenvolvimento remover item de um FileList (não funcional)
  deleteItemList(item:any,index:any){
    console.log(item);
    console.log(this.listImageFile2[0]);
    this.listImageFile2[0].pop()

    this.selectedFiles = this.listImageFile2[0];
    console.log(this.selectedFiles);

    this.listImageFile.splice(index, 1);
  }

  //Seta documentos salvos para local storage
  setCurrentDocSave(item:any){
    this.listDocSaves.push(item);
    this.storage.setArray('currentDocSave',this.listDocSaves);
    console.log(JSON.parse(this.storage.getItem('currentDocSave')!));
  }

  //Pega os documentos salvos no local storage
  getCurrentDocSave(){
    let list = JSON.parse(
      this.storage.getItem('currentDocSave')!
    );
    if (list != null) {
      if(list.length > 0){
        console.log(list.length + ' Salvos');
        this.listDocSaves = list.slice(0).reverse();
        this.messageContador = this.listDocSaves.length + ' Documento(s) salvos'
      }
    }
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
