import { StorageService } from './../../../../shared/services/storage.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FiscalService } from '../../fiscal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { AlertsComponent } from 'src/app/shared/components/dialogs/alerts/alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit,AfterViewInit {

  formSearchPayments!: FormGroup;
  displayedColumns: string[] = ['numero', 'nome', 'data', 'valor','acoes', 'status'];
  isLoading: boolean = false;
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  msgNfeLoading = ''
  currentNfe:any
  constructor(
    private formBuilder:FormBuilder,
    private fiscalService: FiscalService,
    private router: Router,
    private storage: StorageService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.dataSource.data = []
    this.creatForm();
    this.getCurrentNotes();
  }

 ngAfterViewInit(): void {
  setTimeout(() => {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }, 100);
}

  getCurrentNotes(){
    const formData = new FormData();
    const dataDe = moment().format('DD/MM/YYYY');
    const dataAte = moment().add(1, 'days').format('DD/MM/YYYY');

    const dataFinalInput = moment().add(1, 'days').format('YYYY-MM-DD');
    const dataAtualInput = moment().format('YYYY-MM-DD');

    this.formSearchPayments.controls['datainicio'].setValue(dataAtualInput);
    this.formSearchPayments.controls['datafinal'].setValue(dataFinalInput);
    formData.append('dataDe',dataDe);
    formData.append('dataAte',dataAte);
    formData.append('nfeCodigo',this.formSearchPayments.controls['nfeCodigo'].value);
    this.dataSource.paginator = this.paginator;

    this.fiscalService.getNotes(formData).subscribe((res:any)=>{
      console.log(res);
          if(res.length > 0){
            res.sort((a:any, b:any) => {
              const dataA = new Date(a.data_emissao);
              const dataB = new Date(b.data_emissao);
              return dataB.getTime() - dataA.getTime();
            });
            console.log(res);

            this.dataSource.data = res;
            this._snackBar.open( res.length + ' nota(s) encontrada para data selecionada', '', {
              duration: 5000,
              panelClass: ['sucess-alert'],
            });
            this.dataSource.paginator = this.paginator;
          }else{
            this._snackBar.open( 'Nenhuma nota encontrada para data de hoje', '', {
              duration: 5000,
              panelClass: ['error-alert'],
            });
          }
    })
}

  searchByParams(){
    console.log(this.formSearchPayments.getRawValue());
    this.getNotas();
  }

  creatForm(){
    this.formSearchPayments = this.formBuilder.group({
      nfeCodigo: ['',Validators.required],
      datainicio: ['',Validators.required],
      datafinal: ['',Validators.required]
    })
  }

  currentNote(currentPayment:any){
    console.log(currentPayment.codigo);
    this.sendRps(currentPayment);
  }

  getNotas(){
    //const data = this.formSearchPayments.getRawValue();
    const formData = new FormData();
    const { nfeCodigo, datainicio, datafinal} = this.formSearchPayments.getRawValue();
    if(nfeCodigo !== '' || datainicio !== '' && datafinal !== ''){
      let dataDeFormatada = moment(this.formSearchPayments.controls['datainicio'].value).format('DD/MM/YYYY');
      let dataAteFormatada = moment(this.formSearchPayments.controls['datafinal'].value).format('DD/MM/YYYY');

      formData.append('dataDe',dataDeFormatada);
      formData.append('dataAte',dataAteFormatada);
      console.log(dataAteFormatada);

      formData.append('nfeCodigo',this.formSearchPayments.controls['nfeCodigo'].value)
      this.dataSource.paginator = this.paginator;

      this.fiscalService.getNotes(formData).subscribe({
        next:(res:any) =>{
          console.log(res);
          if(res.length > 0){
            this.dataSource.data = res;
            this._snackBar.open( res.length + ' nota(s) encontrada para data selecionada', '', {
              duration: 5000,
              panelClass: ['sucess-alert'],
            });
          }else{
            this._snackBar.open( 'Nenhuma nota encontrada para data selecionada', '', {
              duration: 5000,
              panelClass: ['error-alert'],
            });
          }
        }
      })
    }else {
      this._snackBar.open( 'Digite N° da nota ou duas datas para pesquisar', '', {
        duration: 5000,
        panelClass: ['error-alert'],
      });
    }
  }

  sendRps(nfe:any){
    this.currentNfe = nfe;
    if(this.verifyEmit()){
      if(nfe.rps === null){
        nfe.status = 'emitindo'
        this.msgNfeLoading = 'Emitindo RPS'
        console.log(nfe.codigo);

        this.fiscalService.sendRps(nfe.codigo).subscribe({
          next:(res:any)=>{
            console.log(res);
            this.searchRPS(nfe)
          },
          error:(err)=>{
            console.log(err);
            this.dialog.open(AlertsComponent, {
              data: { message: 'Algum erro ocorreu na emissão da nota, favor comunicar o TI', found: false},
            });
          }
        })
      }else{
        nfe.status = 'emitindo'
        this.msgNfeLoading = 'Emitindo nota'
        this.searchRPS(nfe)
      }
    }else{
      console.log('dsa');
      this.dialog.open(AlertsComponent, {
        data: { message: 'Exite uma emissão em andamento, aguarde para emitir outra nota.'},
      });
    }
  }

  searchRPS(nfe:any){
    this.msgNfeLoading = 'Emitindo nota'
    this.fiscalService.searchRPS(nfe.codigo).subscribe({
      next:(res:any)=>{
        console.log(res);
        nfe.status = 'emitida'
        nfe.url_nfe = res.url;
        nfe.num_nfe = res.numNfe;
        //this.getCurrentNotes();
      },
      error:(err)=>{
        console.log(err);
        if(err.status === 409){
          setTimeout(() => {
            this.searchRPS(this.currentNfe)
          }, 2000);
        }
        if(err.status === 403){
          // Extrair as informações do erro usando uma expressão regular
          const regex = /{codigo=(.*?), mensagem=(.*?), correcao=(.*?)}/;
          const matches = regex.exec(err.error);

          if (matches && matches.length === 4) {
            const codigo = matches[1];
            const mensagem = matches[2];
            const correcao = matches[3];

            console.log('Código do erro:', codigo);
            console.log('Mensagem de erro:', mensagem);
            console.log('Solução do erro:', correcao);
            this.dialog.open(AlertsComponent, {
              data: {
                message: 'Algum erro ocorreu na emissão da nota, favor comunicar o TI',
                codigoErro: codigo,
                messageErro: mensagem,
                correcaoErro: correcao
              },
            });
          }
        }
      }
    })
  }

  formatDateHour(dataHour:any){
    const formattedDate = moment(dataHour).format('DD/MM/YYYY');
    const formattedTime = moment(dataHour).format('HH:mm:ss');

    return formattedDate + ' ' + formattedTime
  }

  verifyEmit() {
    return !this.dataSource.data.some((nota: any) => nota.status === 'emitindo');
  }

  navegate(rota:any){
    this.router.navigate([rota]);
  }

  clearList(){
    this.dataSource.data = [];
  }
}
