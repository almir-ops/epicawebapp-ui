import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, OnDestroy, ViewChild , HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription, take, tap } from 'rxjs';
import { ConfirmationsComponent } from 'src/app/shared/components/dialogs/confirmations/confirmations.component';
import { uSmsResponse } from 'src/app/shared/interfaces/uSmsResponse';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FinancialService } from '../../financial.service';

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit, OnDestroy {
  listContracts$!: Observable<any>;

  emptyDoc: boolean = true;

  subscribe!: Subscription;

  formSendSms!: FormGroup;

  isLoading: boolean = false;

  styleInput = 'bg-gray-200';
  styleSendBtn = "bg-gray-300";
  cssInput = 'border-gray-300';
  disabledBtn = true;

  selectedContracts: any [] = [];
  displayedColumns: string[] = [
    'select',
    'proposta',
    'cliente',
    'valor',
    'vencimento',
    'fone',
    'status',
  ];
  selection = new SelectionModel<any>(true, []);

  dataSource = new MatTableDataSource<uSmsResponse>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  foundContracts: any[]=[];
  txtBtnSend:any = 'Enviar';
  sending:boolean = false;
  cssInputs = 'border-gray-300';
  ambiente: string = 'hom';
  listSentSms: any[]=[];
  listErrorSms: any[]=[];
  listRemaining: any[] = [];
  listCurrentSent : any[] = [];
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private financialService: FinancialService,
  ) { }

  ngOnInit(): void {
    this.styleSendBtn = 'bg-gray-300';
    this.creatForm();
  }

  creatForm(){
    this.formSendSms = this.formBuilder.group({
      proposta: [''],
      allSms: new FormControl(true),
      quantidade: new FormControl({value:'', disabled: true}),
      dtVencimento: [''],
      sendProd: new FormControl(true),

    })
  }

  searchContracts(){
    this.selection.clear();

    this.clearList(this.foundContracts);
    this.isLoading = true;
    this.removeItensSelected();
    const { proposta, dtVencimento, quantidade, allSms } = this.formSendSms.getRawValue();
    this.formatDate(dtVencimento);
    if (proposta !== '' || dtVencimento !== '') {
      const dados = {
        proposta: proposta,
        vencimento: this.formatDate(dtVencimento),
        ambiente: this.ambiente
      };
      //console.log(dados);
      this.listContracts$ = this.financialService.getContractsSms(dados)
      this.listContracts$.subscribe((data:any) => {
        console.log(data);

        if (data) {
          this.dataSource.paginator = this.paginator;
          if (this.formatTotal(allSms) || this.formSendSms.controls['quantidade'].value === null || this.formSendSms.controls['quantidade'].value === 0) {
            if(data.length === 0){
              this.notifySnack(data.length, ' Pendencias encontradas', 'error');
            }else{
              this.notifySnack(data.length, ' Pendencias encontradas', 'sucess');
            }
            this.isLoading = false;
            this.foundContracts = data;
            this.dataSource.data = data;
          } else {
            for (let index = 0; index < data.length; index++) {
              if (index < this.formSendSms.controls['quantidade'].value) {
                this.foundContracts.push(data[index]);
                //console.log(this.foundContracts);
              }
            }
            if (this.formSendSms.controls['quantidade'].value < data.length) {
              if(data.length === 0){
                this.notifySnack(data.length, ' Pendencias encontradas', 'error');
              }else{
                this.notifySnack(this.foundContracts.length, ' Pendencias encontradas', 'sucess');
              }
            } else {
              if(data.length === 0){
                this.notifySnack(data.length, ' Pendencias encontradas', 'error');
              }else{
                this.notifySnack(this.foundContracts.length, ' Pendencias encontradas', 'sucess');
              }
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

  openDialogConfirmation() {
    this.disabledBtn = true;
    if (this.ambiente === 'prd') {
      this.clearList(this.listCurrentSent)
      this.selectedContracts.forEach((res)=>{
        if(res.status === undefined || res.status === null){
          this.listCurrentSent.push(res);
        }
      })
      const dialogRef = this.dialog.open(ConfirmationsComponent,{
        data: { title:'Atenção',message: 'Deseja realmente enviar '+ this.listCurrentSent.length+ ' SMS ?' },
      });

      dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.sending = result;
        if(this.sending){
          this.sendSms();
        }
        this.disabledBtn = false;
      });

    }
    else if (this.ambiente === 'hom') {
      const dialogRef = this.dialog.open(ConfirmationsComponent,{
        data: { title:'Atenção' ,message: 'Deseja realmente enviar 1 SMS TESTE ?' },
      });

      dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.sending = result;
        if(this.sending){
          this.sendSmsTest();
        }
        this.disabledBtn = false;
      });

    }
  }

  sendSmsTest(){
    this.sending = true;
    this.txtBtnSend = 'Enviando';
    let dados = {
      proposta: this.selectedContracts[0].proposta,
      vencimento: this.selectedContracts[0].vencimento,
      ambiente: this.ambiente,
      telefone: this.selectedContracts[0].vencimento.fone
    };
    this.financialService.sendSms(dados).subscribe({
      next: (response) => {
        console.log(response.status);
        if (response.status === 200) {
          this.notifySnack(1,' SMS TESTE enviado com sucesso','sucess');
          this.sending = false;
          this.txtBtnSend = 'Enviar';
        }
        if(response.status === 409){
          this.notifySnack(1,' Erro ao enviar SMS teste.','error');
          this.listErrorSms.push(response);
          this.sending = false;
          this.txtBtnSend = 'Enviar';
        }
      },
      error: (err) => {
        console.log('error =>', err);
        this.notifySnack(1,' Erro ao enviar SMS teste.','error');
        this.sending = false;
        this.txtBtnSend = 'Enviar';
      },
      complete: ()=>{
        console.log('completo');
      }
    });
  }

  sendSms(){
        this.disabledBtn = true;
        this.sending = true;
        this.txtBtnSend = 'Enviando';
        console.log(this.selectedContracts);
        this.selectedContracts.forEach((res, index) => {
          let dados = {
            proposta: res.proposta,
            vencimento: res.vencimento,
            ambiente: this.ambiente,
            telefone: res.fone
          };
          console.log(res.status);
          if(res.status === undefined || res.status === null){
            res.status = 'sending';
            this.financialService.sendSms(dados).subscribe({
              next: (response) => {
                console.log(response.status);
                if (response.status === 200) {
                  res.status = 'ok';
                  this.listSentSms.push(res);
                  this.notifySendEmail();
                  console.log('Enviado para :' + res.fone);

                }
                if(response.status === 409){
                  res.status = 'error';
                  this.listErrorSms.push(res);
                  this.notifySendEmail();
                  console.log('Erro ao enviar para :' + res.fone);

                }else{
                  this.listRemaining.push(res);
                  this.notifySendEmail();

                }
              },
              error: (err) => {
                console.log('error =>', err);
                res.status = 'error';
                this.listErrorSms.push(res);
              },
            });
          }

        });
        console.log('AMBIENTE: ' + this.ambiente);

  }

  notifySendEmail() {
    if (
      this.selectedContracts.length ===
      this.listSentSms.length + this.listErrorSms.length
    ) {
      //console.log(this.selectedContracts.length);
      //console.log(this.listSentSms.length);
      //console.log(this.listErrorSms.length);
      //console.log(this.listRemaining.length);

      this.sending = false;
      this.txtBtnSend = 'Enviar';
      this._snackBar.open(
        this.listSentSms.length + ' SMS enviados com sucesso',
        '',
        {
          duration: 6000,
          panelClass: ['sucess-alert'],
        }
      );
      this.selection.clear();
      this.enableBtnSendSms();
      this.clearList(this.listSentSms);
      this.clearList(this.listErrorSms);
    }
  }

  checkToggle() {
    if (this.styleInput === 'bg-white') {
      this.styleInput = 'bg-gray-200';
      this.formSendSms.controls['quantidade'].setValue('')
    } else if (this.styleInput === 'bg-gray-200') {
      this.styleInput = 'bg-white';
    }
    this.subscribe = this.formSendSms
      .get('allSms')!
      .valueChanges.pipe(
        tap((addCtrlValue: any) => {
          const receiverCtrl = this.formSendSms.get('quantidade');
          addCtrlValue ? receiverCtrl!.disable() : receiverCtrl!.enable();
        })
      )
      .subscribe();
  }

/** Se o número de elementos selecionados corresponde ao número total de linhas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    console.log(...this.dataSource.data);

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    this.selectedContracts = this.selection.selected;
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;

  }

  //ativa ou desativa botão de enviar sms
  enableBtnSendSms() {
      setTimeout(() => {
        //console.log(this.selectedContracts);
        if (this.selectedContracts.length >= 1) {
          console.log(this.selectedContracts.length);

          this.disabledBtn = false;
          this.styleSendBtn =
            'bg-sky-700 hover:bg-sky-800 hover:shadow-lg active:shadow-lg cursor-pointer';
        } else {
          this.disabledBtn = true;
          this.styleSendBtn = 'bg-gray-300';
        }
      }, 100);
    }

  checkToggleProd() {
    const prod = this.formSendSms.controls['sendProd'].value;
    if (prod) {
      this.ambiente = 'prd';
      console.log(this.ambiente);
      console.log(this.formSendSms.controls['sendProd'].value);
    } else {
      this.ambiente = 'hom';
      console.log(this.ambiente);
    }
  }

  listSelected(valor:any){
    this.selectedContracts = valor;
    this.enableBtnSendSms();
  }
  removeItensSelected(){
    for (let index = 0; index < this.selectedContracts.length; index++) {
      this.selectedContracts.pop();
      this.selectedContracts.shift();
    }
  }

  rmSelected(){
    this.dataSource.data.forEach((res:any,index)=>{
      if(res.status === 'ok'){
        console.log(index);
        console.log(res);

      }
    });

  }

  notifySnack(number: any, text: string, type: any) {
    this._snackBar.open(number + text, '', {
      duration: 3000,
      panelClass: [type + '-alert'],
    });
  }

  formatTotal(valor: any) {
    if (valor) {
      return valor;
    } else {
      return '';
    }
  }

  formatDate(data: any) {
    let arrayDate = data.split('-');
    let newData = arrayDate[0] + '-' + arrayDate[2] + '-' + arrayDate[1];
    return newData;
  }

  clearList(list:any){
    while(list.length > 0){
      list.pop();
    }
  }

  clear(){
    this.dataSource.data = [];
  }

  ngOnDestroy(){
    if(this.subscribe){
      this.subscribe.unsubscribe()
    }
  }
}
