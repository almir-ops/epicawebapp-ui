import { ConfirmationsComponent } from './../../../../shared/components/dialogs/confirmations/confirmations.component';
import { FinancialService } from './../../financial.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription, tap, take } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent implements OnInit, OnDestroy {
  formSendEmail!: FormGroup;

  listContracts$!: Observable<any>;

  subscribe!: Subscription;

  isLoading: boolean = false;

  cssInputs = 'border-gray-300';
  cssQuantityInput = 'bg-gray-200';
  styleSendBtn = 'bg-gray-300';
  disabledBtn = true;

  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'select',
    'proposta',
    'cliente',
    'valor',
    'vencimento',
    'email',
    'status',
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedContracts: any[] = [];

  foundContracts: any[] = [];

  ambiente: string = 'hom';

  subscribeMail!: Subscription;
  listSentEmails: any[] = [];
  listErrorEmails: any[] = [];
  listRemaining: any[] = [];
  listCurrentSent : any[] = [];
  listSent:any[]=[];
  sending: boolean = false;
  txtBtnSend: string = 'Enviar';
  columns: any[]= [
    {name:'Código'},
    {name:'Nome'},
    {name:'CPF'},
    {name:'Cidade'},
    {name:'Telefone'},
    {name:'Situação'},
  ];
  clientes: Array<any>=[];
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private financialService: FinancialService,
    private matPaginatorIntl: MatPaginatorIntl,

  ) {}

  ngOnInit(): void {

    this.creatForm();
    this.matPaginatorIntl.itemsPerPageLabel = 'Itens por página';
    this.matPaginatorIntl.nextPageLabel = 'Próxima página';
    this.matPaginatorIntl.previousPageLabel = 'Página anterior';

  }

  creatForm() {
    this.formSendEmail = this.formBuilder.group({
      proposta: [''],
      allEmails: new FormControl(true),
      quantidade: new FormControl({ value: '', disabled: true }),
      dtVencimento: [''],
      sendProd: new FormControl(true),
    });
  }

  searchContracts() {
    this.selection.clear();
    this.storageService.deleteItem('listaEmailsErros');
    this.listSentEmails = [];
    this.listErrorEmails = []
    this.isLoading = true;
    const { proposta, dtVencimento, quantidade, allEmails } = this.formSendEmail.getRawValue();
    this.clearList(this.foundContracts);

    this.formatDate(dtVencimento);
    if (proposta !== '' || dtVencimento !== '') {
      const dados = {
        proposta: proposta,
        vencimento: this.formatDate(dtVencimento),
        total: true,
        top: '',
      };
      console.log(dados);

      this.listContracts$ = this.financialService.getContracts(dados);
      this.listContracts$.pipe(take(1)).subscribe((data) => {
        console.log(data);

        if (data) {
          this.dataSource.paginator = this.paginator;
          if (this.formatTotal(allEmails)) {
            this.notifySnack(data.length, ' Pendencias encontradas', 'sucess');
            this.isLoading = false;
            this.dataSource.data = data;
            this.foundContracts = data;
          } else {
            //console.log(this.formSendEmail.controls['quantidade'].value);
            for (let index = 0; index < data.length; index++) {
              if (index < this.formSendEmail.controls['quantidade'].value) {
                this.foundContracts.push(data[index]);
                //console.log(this.foundContracts);
              }
            }
            if (this.formSendEmail.controls['quantidade'].value < data.length) {
              this.notifySnack(
                this.formSendEmail.controls['quantidade'].value,
                ' Pendencias encontradas.',
                'sucess'
              );
            } else {
              this.notifySnack(
                data.length,
                ' Pendencias encontradas.',
                'sucess'
              );
            }
            this.isLoading = false;
            this.dataSource.data = this.foundContracts;
          }
        } else {
          console.log(data);
          this.isLoading = false;
          this.notifySnack(
            '',
            'Nenhum vencimento encontrado para esta data',
            'error'
          );
        }
      });
    } else {
      this.isLoading = false;
      this.cssInputs = 'border-red-500';
      this.notifySnack(
        '',
        'Digite uma data valida.',
        'error'
      );
    }
  }

  checkToggle() {
    if (this.cssQuantityInput === 'bg-white') {
      this.cssQuantityInput = 'bg-gray-200';
      this.formSendEmail.controls['quantidade'].setValue('');
    } else if (this.cssQuantityInput === 'bg-gray-200') {
      this.cssQuantityInput = 'bg-white';
    }
    this.subscribe = this.formSendEmail
      .get('allEmails')!
      .valueChanges.pipe(
        tap((addCtrlValue: any) => {
          const receiverCtrl = this.formSendEmail.get('quantidade');
          addCtrlValue ? receiverCtrl!.disable() : receiverCtrl!.enable();
        })
      )
      .subscribe();
  }

  checkToggleProd() {
    const prod = this.formSendEmail.controls['sendProd'].value;
    if (prod) {
      this.ambiente = 'prd';
      console.log(this.ambiente);
      console.log(this.formSendEmail.controls['sendProd'].value);
    } else {
      this.ambiente = 'hom';
      //console.log(this.ambiente);
    }
  }

  formatDate(data: any) {
    let arrayDate = data.split('-');
    let newData = arrayDate[0] + '-' + arrayDate[2] + '-' + arrayDate[1];
    return newData;
  }

  formatTotal(valor: any) {
    return valor ? valor : '' ;
  }

  openDialogConfirmation() {
    this.disabledBtn = true;
    if (this.ambiente === 'prd') {
      this.clearList(this.listCurrentSent);
      console.log(this.listCurrentSent);

      this.selectedContracts.forEach((res)=>{
        if(res.status === undefined || res.status === null || res.status === 'error'){
          this.listCurrentSent.push(res);
        }
      })
      const dialogRef = this.dialog.open(ConfirmationsComponent,{
        data: { title:'Atenção',message: 'Deseja realmente enviar '+ this.listCurrentSent.length+ ' E-MAILS ?' },
      });

      dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.sending = result;
        if(this.sending){
          this.sendEmail();
        }
        this.disabledBtn = false;
      });

    }
    else if (this.ambiente === 'hom') {
      const dialogRef = this.dialog.open(ConfirmationsComponent,{
        data: { title:'Atenção' ,message: 'Deseja realmente enviar 1 E-mail TESTE ?' },
      });

      dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.sending = result;
        if(this.sending){
          this.sendEmailTest();
        }
        this.disabledBtn = false;
      });

    }
  }

  checkBtnSend(valor:any){
    console.log(valor);
    this.disabledBtn = valor;
  }

  listSelected(valor:any){
    this.selectedContracts = valor;
    this.enableBtnSendEmail();
  }

  sendEmailTest(){
    this.txtBtnSend = 'Enviando';
    let dados = {
      proposta: this.selectedContracts[0].proposta,
      vencimento: this.selectedContracts[0].vencimento,
      ambiente: this.ambiente,
      total: '',
      top: 1,
    };

    this.financialService.sendEmails(dados).pipe(take(1)).subscribe({
      next: (response:any) => {
        console.log(response.status);
        if (response.status === 200) {
          this.notifySnack(1,' E-mail TESTE enviado com sucesso','sucess');
          this.sending = false;
          this.txtBtnSend = 'Enviar';
        }
        if(response.status === 409){
          this.notifySnack(1,' Erro ao enviar e-mail teste.','error');
          this.sending = false;
          this.txtBtnSend = 'Enviar';
        }
      },
      error: (err) => {
        console.log('error =>', err);
        this.notifySnack(1,' Erro ao enviar e-mail teste.','error');
        this.sending = false;
        this.txtBtnSend = 'Enviar';
      },
    });

  }

  sendEmail() {

    this.txtBtnSend = 'Enviando';

    console.log(this.selectedContracts);
    this.selectedContracts.forEach((res, index) => {
      let dados = {
        proposta: res.proposta,
        vencimento: res.vencimento,
        ambiente: this.ambiente,
        total: '',
        top: 1,
      };
      if(res.status === undefined || res.status === null || res.status === 'error'){
        res.status = 'sending';
        this.financialService.sendEmails(dados).pipe(take(1)).subscribe({
          next: (response:any) => {
            console.log(response.status);
            console.log(response.error);

            if (response.status === 200) {
              res.status = 'ok';
              this.listSentEmails.push(res);
              this.listSent.push(res)
              this.notifySendEmail();
              //this.setCurrentMailSucess(res.proposta);
            }
            else if(response.error.status === 409){
              res.status = 'error';
              this.listErrorEmails.push(res);
              console.log('error => 409');

            }
          },
          complete: () =>{
            console.log('complete');
            this.enableBtnSendEmail();
          }
        });
      }
    });
    console.log(this.listRemaining);

  }

  verifyError(){
    this.selectedContracts.forEach((res)=>{
      if(res.status === 'sending'){
        res.status = 'error'
      }
    })
  }

  //Seta documentos salvos para local storage
  setCurrentMailSucess(item:any){
    this.listSentEmails.push(item);
    this.storageService.setArray('listaEmailSucess',this.listSentEmails);
    console.log(JSON.parse(this.storageService.getItem('listaEmailSucess')!));
  }

  notifySendEmail() {
    console.log(this.selectedContracts);
    console.log(this.listSentEmails);
    console.log(this.listErrorEmails);

    if (
      this.selectedContracts.length ===
      this.listSentEmails.length + this.listErrorEmails.length
    ) {
      //this.listErrorEmails = JSON.parse(this.storageService.getItem('listaEmailsErros')!);
      this.sending = false;
      this.txtBtnSend = 'Enviar';
      if(this.listSentEmails.length > 0){
        this._snackBar.open(
          this.listSentEmails.length + ' Emails enviados com sucesso',
          '',
          {
            duration: 5000,
            panelClass: ['sucess-alert'],
          }
        );
      }else if(this.listSentEmails.length > 0 && this.listErrorEmails.length > 0){
        this._snackBar.open(
          this.listSentEmails.length + ' Emails enviados com sucesso',
          '',{duration: 5000, panelClass: ['sucess-alert']});
        setTimeout(() => {
          this._snackBar.open(
            this.listErrorEmails.length + ' Emails com erro ao enviar',
            '',{duration: 5000, panelClass: ['error-alert']});
        }, 5000);
      }else{
        this._snackBar.open(
          this.listErrorEmails.length + ' Emails com erro ao enviar',
          '',{duration: 5000, panelClass: ['error-alert']});
      }

      this.selection.clear();
      this.enableBtnSendEmail();
      //this.clearList(this.listSentEmails);
      //this.clearList(this.listErrorEmails);
    }
  }

  notifySnack(number: any, text: string, type: any) {
    this._snackBar.open(number + text, '', {
      duration: 3000,
      panelClass: [type + '-alert'],
    });
  }

  enableBtnSendEmail() {
    setTimeout(() => {
      //console.log(this.selectedContracts.length);
      //console.log(this.listCurrentSent.length);
      //console.log(this.dataSource.data.length);

      const currentSelecteds = this.selectedContracts.length - this.listSent.length;

      //console.log(currentSelecteds);

      if (currentSelecteds <= 0) {
        this.disabledBtn = true;
        this.styleSendBtn = 'bg-gray-300';

      }else if(this.selectedContracts.length >= 1 ) {
        this.disabledBtn = false;
        this.styleSendBtn = 'bg-sky-700 hover:bg-sky-800 hover:shadow-lg active:shadow-lg cursor-pointer';
      } else {
        this.disabledBtn = true;
        this.styleSendBtn = 'bg-gray-300';
      }
    }, 150);
  }

  clearList(list: any) {
    while (list.length > 0) {
      list.pop();
    }
  }

  clear() {
    this.dataSource.data = [];
    this.selection.clear();
    this.selectedContracts = [];
    this.enableBtnSendEmail();
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    if (this.subscribeMail) {
      this.subscribeMail.unsubscribe();
    }
  }
}
