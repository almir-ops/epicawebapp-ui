import { AddGrupoComponent } from './../../../../shared/components/dialogs/add-grupo/add-grupo.component';
import { TiService } from './../../ti.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationsComponent } from 'src/app/shared/components/dialogs/confirmations/confirmations.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  nameUser!: string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'codigo', 'nome', 'email', 'login', 'grupos','acoes'];
  msgLoading = 'Carregando...'
  isLoading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private tiService: TiService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.getUsers()
  }

  showDetails(user:any){
    //console.log(user);
    this.router.navigate(['/ti/editar-usuario/'+ user.codigo]);

  }

  getUsers(){
    this.tiService.getUsers().subscribe({
      next: (res:any) => {
        console.log(res);
        this.dataSource.data = res.sort((a: any, b: any) => a.codigo - b.codigo);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  searchUsers(){
    console.log(this.nameUser);

  }


  openDialogAddGroup(){
    this.dialog.open(AddGrupoComponent);
  }

  openDialogDelete(item:any){
    console.log(item);

    const dialogRef = this.dialog.open(ConfirmationsComponent,{
      data: { title:'Atenção',message: 'Deseja realmente DELETAR o usuario '+ item.nome+ ' ?' },
    });

    dialogRef.afterClosed().subscribe((res:any)=>{
      if(res){
        console.log(res);
        this.deleteUser(item.codigo)
      }
    })
  }

  deleteUser(id:any){
    this.isLoading = true
    this.msgLoading = 'Deletando usuario...'
    this.tiService.deleteUser(id).subscribe({
      next:(res)=>{
        console.log(res);
        this.getUsers();
        this._snackBar.open(' Usuario deletado com sucesso!',
          '',
          {
            duration: 3000,
            panelClass: ['sucess-alert'],
          }
        );
      },
      error:(err)=>{
        console.log(err);
      },
      complete:()=>{
        this.isLoading = false;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navegate(rota:any){
    this.router.navigate([rota]);
  }

}
