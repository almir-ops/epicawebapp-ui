import { uClientNota } from './../../../interfaces/uClientNota';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit {

  formCurrentNota!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<InformationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log(this.data.data);
    this.creatForm();
  }
  creatForm(){
    this.formCurrentNota = this.formBuilder.group({
      proposta: [''],
      tomador: [{value: this.data.uClientNota.tomador, disabled: true}],
      dtPagamento:[{value: this.data.uClientNota.dtPagamento, disabled: true}],
      cpf:[{value :this.data.uClientNota.cpfCnpj, disabled: true}],
      email:[{value: this.data.uClientNota.email, disabled: true}],
      tipo:[{value: this.formatPessoa(this.data.uClientNota.tipo), disabled : true}],
      cep:[{value: this.data.uClientNota.cep, disabled: true}],
      estado:[{value: this.data.uClientNota.estado, disabled: true}],
      cidade:[{value: this.data.uClientNota.cidade, disabled: true}],
      logradouro:[{value: this.data.uClientNota.logradouro, disabled: true}],
      numero:[{value: this.data.uClientNota.numero, disabled: true}],
      bairro:[{value: this.data.uClientNota.bairro, disabled: true}],
      complemento:[{value: this.data.uClientNota.complemento, disabled: true}],
      telefone:[{value: this.data.uClientNota.telefone, disabled: true}],
      celular:[{value: this.data.uClientNota.celular, disabled: true}],
      dataServico:[{value: this.data.uClientNota.dataServico, disabled: true}],
      estadoServico:[{value: this.data.uClientNota.estadoServico, disabled: true}],
      cidadeServico:[{value: this.data.uClientNota.cidadeServico, disabled: true}],
      codigo:[{value: this.data.uClientNota.codigo, disabled: true}],
      aliquota:[{value: this.data.uClientNota.aliquota, disabled: true}],
      descricao:[{value: this.data.uClientNota.descricao, disabled: true}],
      valorServico:[{value: this.data.uClientNota.valorServico, disabled:true}],
      baseCalc:[{value: this.data.uClientNota.baseCalc, disabled: true}],
      valorLiquido:[{value: this.data.uClientNota.valorLiquido, disabled: true}],
      valorISS:[{value: this.data.uClientNota.valorISS, disabled: true}]
    })
  }

  formatPessoa(tipo:any){
    if(tipo === 'J'){
      return 'Pessoa Juridica'
    }else{
      return 'Pessoa Fisica'
    }
  }
}
