import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { uClient } from 'src/app/shared/interfaces/uClient';
import { AttendanceService } from '../../attendance.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationsComponent } from 'src/app/shared/components/dialogs/confirmations/confirmations.component';
import { AlertsComponent } from 'src/app/shared/components/dialogs/alerts/alerts.component';
import { ValidatorsService } from 'src/app/shared/services/validators/validators.service';

@Component({
  selector: 'app-buscar-produtos',
  templateUrl: './buscar-produtos.component.html',
  styleUrls: ['./buscar-produtos.component.scss']
})
export class BuscarProdutosComponent implements OnInit {
  selection = new SelectionModel<uClient>(true, []);

  displayedColumns: string[] = [ 'proposta', 'produto', 'nome', 'cpfcnpj'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLoading: boolean = false;

  cpfCnpj:any = '';
  submitted = false;

  msgLoading = 'Buscando registros'
  constructor(
    private attendanceService: AttendanceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private validatorsCpf: ValidatorsService
  ) { }

  ngOnInit(): void {
  }

  validaCpf(){
    if(this.cpfCnpj.length === 11 ){
      return this.validatorsCpf.validateCPF(this.cpfCnpj);
    }else {
      return false
    }
  }

  procuraProdutos(){
    this.submitted = true;
    if(this.validaCpf()){
      this.isLoading = true;
      this.msgLoading = 'Buscando registros'
      console.log(this.cpfCnpj);
      this.attendanceService.getProductsByCpf(this.cpfCnpj).subscribe({
        next:(response:any) =>{
          console.log(response);
          if(response.length > 0){
            this.dataSource.data = response;
          }else {
            this.openDialogConfirmation();
          }
        },
        complete:()=>{
          this.isLoading = false;
        }
      })
    }else{
      this._snackBar.open('Esse numero de cpf não existe!', '', {
        duration: 3000,
        panelClass: ['error-alert'],
      });
    }
  }

  openDialogConfirmation(){
    this.dialog.open(AlertsComponent,{data: {message: 'Nenhum produto encontrado para este CPF'}});
  }

}
