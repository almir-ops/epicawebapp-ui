import { ConfirmationComponent } from './../../components/dialogs/confirmation/confirmation.component';
import { uNfe } from './../../interfaces/uNfe';
import { uClientNota } from './../../interfaces/uClientNota';
import { StorageService } from './../../../../shared/services/storage.service';
import { Router } from '@angular/router';
import { FiscalService } from './../../fiscal.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InformationsComponent } from '../../components/dialogs/informations/informations.component';
import { take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatorsService } from 'src/app/shared/services/validators/validators.service';
import { AlertsComponent } from 'src/app/shared/components/dialogs/alerts/alerts.component';
import moment from 'moment';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {

  @ViewChild('tomador', { static: false }) inputTomador!: ElementRef;
  @ViewChild('numero', { static: false }) inputNumeroCasa!: ElementRef;

  isLoading: boolean = false;
  formNotaFiscal!: FormGroup;

  listEstados: any[]=[];
  listCidades: any[]=[];
  listCidadesService: any[]=[];
  listCodigoServico: any[]=[];
  listNotesIssued:any[]=[];

  submitted:boolean = false;
  currentPayment:any;
  uClientNota!: uClientNota;
  foundClient!: any;
  serviceToolTip!: string;

  titleContador:string = 'Contador de notas emitidas';
  messageContador:string = ' Notas emitidas';
  closeContador!:boolean;

  dataAtual!: string
  isValidEmail: boolean = true;

  constructor(
    private formBuilder:FormBuilder,
    private fiscalService:FiscalService,
    private router:Router,
    private storageService: StorageService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private validators: ValidatorsService
    ) { }

  ngOnInit(): void {

    this.currentPayment = JSON.parse(this.storageService.getItem('currentPayment')!);
    console.log(this.currentPayment);

    this.creatForm();
    this.fiscalService.getCidades().subscribe((res:any)=>{
      this.listEstados = res.estados;
    });

    this.fiscalService.getServices().subscribe((res:any)=>{
    res.forEach((element:any) => {
      const servico = {nome:element.codigo_servico, aliquota:element.aliquota, valor:element.codigo,descricao:element.descricao_servico}
      this.listCodigoServico.push(servico);
    });

    })
    this.dataAtual = moment().format('YYYY-MM-DD');
    this.formNotaFiscal.get('dataServico')?.setValue(this.dataAtual)
  }
  creatForm(){
    this.formNotaFiscal = this.formBuilder.group({
      proposta: [''],
      tomador: ['',Validators.required],
      dtPagamento:[],
      cpfCnpj:['',Validators.required],
      email:[''],
      tipo:['F',Validators.required],
      cep:['',Validators.required],
      estado:['',Validators.required],
      cidade:['',Validators.required],
      logradouro:['',Validators.required],
      numero:['',Validators.required],
      bairro:['',Validators.required],
      complemento:[''],
      telefone:[''],
      celular:[''],
      dataServico:['',Validators.required],
      estadoServico:[{value: 'SP', disabled:true}],
      cidadeServico:[{value: 'São Bernardo do Campo', disabled:true}],
      codigo:['',Validators.required],
      aliquota:[{value: '', disabled: true}],
      descricao:[''],
      valorServico:['',[Validators.required, Validators.minLength(2)]],
      baseCalc:[''],
      valorLiquido:[''],
      valorISS:[''],
      codigo_cidade:[''],
      codigo_cliente:['']
    })
  }
  get form(): { [key: string]: AbstractControl } {
    return this.formNotaFiscal.controls;
  }

  getLogradouro(cep:string){
    console.log(!this.form['codigo_cliente'].value);

    if(cep != '' && cep !== null ){
      console.log(typeof cep);

      if(cep.length === 8){
        this.fiscalService.getViaCep(cep).subscribe({
          next:(res:any)=>{
            console.log(res);
            if(res.erro){
              this.dialog.open(AlertsComponent, {
                data: { message: 'Não encontrado endereço para o CEP informado, verifique a veracidade do CEP.'},
              });
            }else{
              this.formNotaFiscal.controls['estado'].setValue(res.uf);
              this.formNotaFiscal.controls['cidade'].setValue(res.localidade);
              this.formNotaFiscal.controls['logradouro'].setValue(res.logradouro);
              this.formNotaFiscal.controls['bairro'].setValue(res.bairro);
              this.formNotaFiscal.controls['codigo_cidade'].setValue(res.ibge);
              this.getCidades();
              if(!this.form['codigo_cliente'].value ){
                this.inputNumeroCasa.nativeElement.focus();
              }
            }
          },
          error:(err:any)=>{
            console.log(err);
            this.dialog.open(AlertsComponent, {
              data: { message: 'Não encontrado endereço para o CEP informado, verifique a veracidade do CEP.'},
            });
          }
        });

      }
    }
  }

  getCidades(){
    const estado = this.formNotaFiscal.controls['estado'].value;
    const estadoService = this.formNotaFiscal.controls['estadoServico'].value;
    if(estado != null && estado != undefined){
      this.fiscalService.getCidades().subscribe((res:any)=>{
        if(res){
          res.estados.forEach((value:any) => {
            if(value.sigla === estado){
              this.listCidades = value.cidades
            }
          });
        }
      })
    }
    if(estadoService != null && estadoService != undefined){
      this.fiscalService.getCidades().subscribe((res:any)=>{
        if(res){
          res.estados.forEach((value:any) => {
            if(value.sigla === estadoService){
              this.listCidadesService = value.cidades
            }
          });
        }
      })
    }
  }

  searchClient(){
    const cpfCnpj = this.formNotaFiscal.controls['cpfCnpj'].value
    if(this.form['tipo'].value === 'F' && cpfCnpj.length === 11 || this.form['tipo'].value === 'J' && cpfCnpj.length === 14){
      this.fiscalService.getClient(cpfCnpj).subscribe({
        next: (res:any) => {
          if(res){
            console.log(res);

            this.form['tomador'].setValue(res.nome);
            this.form['email'].setValue(res.email);
            this.form['cep'].setValue(res.cep);
            this.form['logradouro'].setValue(res.logradouro);
            this.form['numero'].setValue(res.numero);
            this.form['telefone'].setValue(res.telefone);
            this.form['celular'].setValue(res.celular);
            this.form['codigo_cliente'].setValue(res.codigo);
            this.form['complemento'].setValue(res.complemento);
            this.getLogradouro(res.cep);
            this.foundClient = true;
            this.dialog.open(AlertsComponent, {
              data: { message: 'Cliente encontrado! Preencha o restante dos dados para continuar.', found: true},
            });
          }else{

          }
        },error: (err:any) => {

          if(JSON.stringify(err.status) === "404"){
            console.log(typeof err);
            this.inputTomador.nativeElement.focus();
            this.foundClient = false;
            this.form['tomador'].reset();
            this.form['email'].reset();
            this.form['cep'].reset();
            this.form['logradouro'].reset();
            this.form['numero'].reset();
            this.form['telefone'].reset();
            this.form['celular'].reset();
            this.form['cidade'].setValue("");
            this.form['estado'].setValue("");
            this.form['bairro'].reset();
            this.form['codigo_cliente'].setValue(null)

            this.dialog.open(AlertsComponent, {
              data: { message: 'Cliente não encontrado! Preencha os dados para continuar.'},
            });
          }

        }
      })
    }
  }

  saveNfeRequest(){

    this.formatter(this.form['valorServico'].value)
    if(this.form['celular'].value === ''){
      this.form['celular'].setValue(this.form['telefone'].value)
    }
    console.log(this.formNotaFiscal.getRawValue());
    if(this.form['email'].value === '' || this.form['email'].value === null){
      this.isValidEmail = true;
    }
    this.submitted = true;
    console.log(this.form['email'].value);

    console.log(this.isValidEmail);

    if(this.formNotaFiscal.valid && this.validaCPF(this.form['cpfCnpj'].value) && this.isValidEmail || this.formNotaFiscal.valid && this.validaCNPJ(this.form['cpfCnpj'].value) && this.isValidEmail ){
      this.uClientNota = this.formNotaFiscal.getRawValue();
      console.log(this.isValidEmail);
      const dialogRef = this.dialog.open(InformationsComponent,{
        data: { title:'Atenção', uClientNota: this.uClientNota },
      });

      if(Number(this.form['codigo_cliente']) === 0){
        this.form['codigo_cliente'].setValue(null)
      }

      if(this.form['celular'].value === ''){
        this.form['celular'].setValue(this.form['telefone'].value)
      }

      let nFe: uNfe = {
        aliquota: Number(this.form['aliquota'].value),
        bairro: this.form['bairro'].value,
        celular: this.form['celular'].value,
        cep: this.form['cep'].value,
        cod_serv_atividade: Number(this.form['codigo'].value),
        //codigo: Number(this.form['codigo_cliente'].value),
        codigo_cidade: this.form['codigo_cidade'].value,
        codigo_cliente: this.form['codigo_cliente'].value,
        complemento: this.form['complemento'].value,
        cpf_cnpj: this.form['cpfCnpj'].value,
        //descricao_servico: descricaoSemParagrafos,
        descricao_servico: this.removeAccents(this.form['descricao'].value.replace(/\n/g, '<BR>')),
        email: this.form['email'].value,
        logradouro: this.form['logradouro'].value,
        nomeCliente: this.form['tomador'].value,
        numero: this.form['numero'].value,
        razao_social: this.form['tomador'].value,
        telefone: this.form['telefone'].value,
        tipo_pessoa: this.form['tipo'].value,
        valor_nfe: this.formatter(this.form['valorServico'].value),
        uf: this.form['estado'].value
      }
      console.log(nFe);

      dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
          this.isLoading = true;
          this.fiscalService.sendNote(nFe).subscribe({
            next: (res:any) => {
              this.isLoading = false;
              this.listNotesIssued.push(this.uClientNota);

              this.serviceToolTip = ''
              this.submitted = false;
              this.foundClient = null;
              this.openDialogConfirmation();

              console.log(res);
              //window.open(res, '_blank');
            },
            error: (err:any)=> {
              console.log(err);
              this.isLoading = false;
            }
          })

        }
      });
    }else{
      this._snackBar.open('Verifique os dados antes de seguir em frente', '', {
        duration: 3000,
        panelClass: ['error-alert'],
      });
    }

  }

  removeAccents(texto: string): string {
    if (texto) {
      // Remove os acentos utilizando expressão regular e a função normalize do JavaScript
      return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return '';
  }

  openDialogConfirmation(){
    const dialogConfirmation = this.dialog.open(ConfirmationComponent);
    dialogConfirmation.afterClosed().pipe(take(1)).subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(result);

      if(result){
        this.navegate('/fiscal/listar-notas')
      }else{
        this.form['codigo_cliente'].reset();
        this.form['cpfCnpj'].reset();
        this.form['tomador'].reset();
        this.form['email'].reset();
        this.form['cep'].reset();
        this.form['logradouro'].reset();
        this.form['numero'].reset();
        this.form['bairro'].reset();
        this.form['complemento'].reset();
        this.form['telefone'].reset();
        this.form['celular'].reset();
        this.form['codigo'].reset();
        this.form['aliquota'].reset();
        this.form['descricao'].reset();
        this.form['valorServico'].reset();
        this.form['estado'].reset();
        this.form['cidade'].reset();
      }
    });
  }


  validaCPF(cpf:string){
    if(cpf.length === 11){
      return this.validators.validateCPF(cpf);
    }
    return true
  }

  validaCNPJ(cnpj:string){
    if(cnpj.length === 14){
      return this.validators.validateCNPJ(cnpj);
    }
    return true
  }

  validateEmail(email:any) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isValidEmail = emailRegex.test(email);
    console.log(this.isValidEmail);

  }

  getFormClientNota(){
    for (const key in this.formNotaFiscal.value) {
    }
    this.uClientNota = this.formNotaFiscal.getRawValue();
    console.log(this.uClientNota);
  }

  changeService(){
    console.log(this.form['codigo'].value);

    this.listCodigoServico.forEach((res:any)=>{

      if(res.valor.toString() === this.form['codigo'].value){
        console.log('ok');
        this.form['aliquota'].setValue(res.aliquota)
        this.serviceToolTip = res.descricao
      }
    })
  }

  public formatter(value: any): number {
    console.log(value);

    let floatNumber = parseFloat(value.replace(".", "").replace(",", "."));
    console.log(floatNumber);

   return floatNumber;
  }

  getCurrentDate(){
    const date = new Date();
    const year = date.getFullYear();
    const today = date.getDate();
    const month = date.getMonth() + 1;

    //console.log(year + '-' + month + '-' + today);
    const currentDate = year + '-' + month + '-' + today
    console.log(currentDate);

    return year + '-' + month + '-' + today;
  }

  upperText(campo:any){
    if(this.formNotaFiscal.controls[campo].value !== null && this.formNotaFiscal.controls[campo].value !== ''){
      const tomadorUpper = this.formNotaFiscal.controls[campo].value.toUpperCase();
      this.formNotaFiscal.get(campo)?.setValue(tomadorUpper);
    }
  }

  navegate(rota:any){
    this.router.navigate([rota]);
  }
}
