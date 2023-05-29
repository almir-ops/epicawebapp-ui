import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnDestroy {
  subscribe!: Subscription;

  constructor(
    private attendanceService: AttendanceService,
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
    ) { }


  delete(){
    console.log(this.data.id);
    this.subscribe = this.attendanceService.deleteClient(this.data.id).subscribe(
      sucess => {
        this._snackBar.open('Excluido com sucesso','',{duration: 3000, panelClass: ['sucess-alert']});
        this.router.navigate(['atendimento/list'])
      },
      error => {
        this._snackBar.open('Erro ao excluir','',{duration: 3000, panelClass: ['error-alert']});
      }
    )
  }

  ngOnDestroy() {
    if(this.subscribe){
      this.subscribe.unsubscribe();
    }
  }
}
