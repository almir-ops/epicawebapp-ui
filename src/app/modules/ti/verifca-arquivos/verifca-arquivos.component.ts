import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifca-arquivos',
  templateUrl: './verifca-arquivos.component.html',
  styleUrls: ['./verifca-arquivos.component.scss']
})
export class VerifcaArquivosComponent implements OnInit {

  formVerificaArquivo!: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'proposta', 'caminho', 'acoes'];

  isLoading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.createForm()
  }


  createForm(){
    this.formVerificaArquivo = this.formBuilder.group({
      dtInicio:['',Validators.required],
      dtFinal:['',Validators.required]
    });
  }


  searchContracts(){
    console.log(this.formVerificaArquivo.getRawValue());

    if(this.formVerificaArquivo.valid){
      this.isLoading = true;
      const dataDe = this.formVerificaArquivo.controls['dtInicio'].value;
      const data = new Date(Date.UTC(
        parseInt(dataDe.substring(0, 4)),  // ano
        parseInt(dataDe.substring(5, 7)) - 1,  // mês (ajustado para 0-11)
        parseInt(dataDe.substring(8, 10)) + 1,  // dia
        0, 0, 0));  // horas, minutos, segundos (todos zero)
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const dataDeFormatada = new Intl.DateTimeFormat('pt-BR', options).format(data);

      const dataAte = this.formVerificaArquivo.controls['dtFinal'].value;
      const data2 = new Date(Date.UTC(
        parseInt(dataAte.substring(0, 4)),  // ano
        parseInt(dataAte.substring(5, 7)) - 1,  // mês (ajustado para 0-11)
        parseInt(dataAte.substring(8, 10)) + 1,  // dia
        0, 0, 0));  // horas, minutos, segundos (todos zero)
      const options2: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const dataAteFormatada = new Intl.DateTimeFormat('pt-BR', options2).format(data2);
      console.log(dataDeFormatada);

      console.log(dataAteFormatada);

      const formData = new FormData();
      formData.append('dataDe',dataDeFormatada)
      formData.append('dataAte',dataAteFormatada)

      this.httpClient.post('http://localhost:8772/api/testFile', formData).subscribe({
        next: (res:any) =>{
          console.log(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.data = res;
          this._snackBar.open(res.length + ' registros encontrados.', '', {
            duration: 3000,
            panelClass: ['sucess-alert'],
          });

        },
        error(err) {
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      })

    }else{
      this._snackBar.open('Coloque uma data valida para pesquisar', '', {
        duration: 3000,
        panelClass: ['error-alert'],
      });
    }
  }

  clear(){
    this.dataSource.data = [];
  }
}
