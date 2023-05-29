import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GruposComponent } from 'src/app/shared/components/dialogs/grupos/grupos.component';
import { TiService } from '../../ti.service';
import { take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss']
})
export class SingleUserComponent implements OnInit {

  formUser!: FormGroup;
  listGrupos: any[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private tiService: TiService,
    private _snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm(){
    this.formUser = this.formBuilder.group({
      nome:[''],
      email:[''],
      login:[''],
      grupos: this.formBuilder.array([])
    })
  }

  get usuarioGrupos(): FormArray {
    return this.formUser.get('grupos') as FormArray;
  }

  save(){
    const usuario = this.formUser.getRawValue();
    console.log(usuario);


    this.tiService.setUser(usuario).subscribe({
      next: (res:any) => {
        console.log(res);
        this.navegate('/ti/lista-usuarios')
        this._snackBar.open(' Usuario criado com sucesso!',
          '',
          {
            duration: 3000,
            panelClass: ['sucess-alert'],
          }
        );
      },
      error: (err:any) =>{
        console.log(err);
        this._snackBar.open(' Erro ao criar usuario',
        '',
        {
          duration: 3000,
          panelClass: ['error-alert'],
        }
      );
      },
      complete: () => {

      }
    })

  }

  openDialog() {
    this.tiService.getGrupos().subscribe({
      next: (res:any) => {
        console.log(res);

        const dialogRef = this.dialog.open(GruposComponent, {
          data: { listGrupos: res },
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe((result:any) => {
          const grupoExistente = this.listGrupos.find(grupo => grupo.nome === result.nome || grupo.codigo === result.codigo);
          if (grupoExistente) {
            console.log('O grupo já existe na lista.');
          } else {
            const grupo = {
              nome:result.nome,
              codigo:result.codigo
            }
            this.listGrupos.push(grupo);
            this.adicionarGrupo(grupo);
          }
        });
      }
    })
  }

  adicionarGrupo(grupo:any) {
    const grupoForm = this.formBuilder.group({
      nome: [grupo.nome],
      codigo: [grupo.codigo]
    });
    const grupos = this.formUser.get('grupos') as FormArray;
    grupos.push(grupoForm);
  }


  navegate(rota:any){
    this.router.navigate([rota]);
  }
}
