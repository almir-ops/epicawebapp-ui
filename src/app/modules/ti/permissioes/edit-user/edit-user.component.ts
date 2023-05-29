import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { GruposComponent } from 'src/app/shared/components/dialogs/grupos/grupos.component';
import { TiService } from '../../ti.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  formUser!: FormGroup;
  listGrupos: any[]=[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private tiService: TiService,
    private _snackBar: MatSnackBar,
    private activatedRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createForm();
    const id = this.activatedRouter.snapshot.params['id']
    console.log(id);

    this.tiService.getUserById(id).subscribe((user:any) => {
      console.log(user);
      const usuarioGrupos = this.formUser.get('grupos') as FormArray;
      this.formUser.patchValue({
        codigo:user.codigo,
        nome:user.nome,
        email:user.email,
        login:user.login
      })

      user.grupos.forEach((grupo:any) => {
        this.listGrupos.push(grupo);
        usuarioGrupos.push(this.formBuilder.group({
          nome:grupo.nome,
          codigo:grupo.codigo
        }))


      });
    })
  }

  createForm(){
    this.formUser = this.formBuilder.group({
      codigo:[''],
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
        this._snackBar.open(' Usuario atualizado com sucesso!',
          '',
          {
            duration: 3000,
            panelClass: ['sucess-alert'],
          }
        );
      },
      error: (err:any) =>{
        console.log(err);
        this._snackBar.open('Erro ao atualizar usuario.',
          '',
          {
            duration: 3000,
            panelClass: ['sucess-alert'],
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

  removerGrupo(index:any){
    const grupos = this.formUser.get('grupos') as FormArray;
    grupos.removeAt(index);
    this.listGrupos.splice(index, 1);
    console.log(this.listGrupos);
    console.log(index);
    console.log(this.formUser.getRawValue());
  }

  navegate(rota:any){
    this.router.navigate([rota]);
  }
}
