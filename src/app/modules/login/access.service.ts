import { EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { tap } from 'rxjs/internal/operators/tap';
import { StorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessService implements OnDestroy {

  setores:any[]=[];
  acess:any[]=[];
  listPermission:any[]=[];
  subscribe!: Subscription;

  static rolesUser = new EventEmitter<any>();
  static setores = new EventEmitter<any>();
  static permissioes = new EventEmitter<any>();

  constructor(
    private storage: StorageService,
    private httpClient: HttpClient
    ) { }

  getPermissions(){
    let cont = 1
    const username = this.storage.getItem('username');
    this.listPermission = [];
    this.setores = [];
    this.acess = [];
    //console.log(this.listPermission);
    this.subscribe = this.permissions(username).subscribe((res:any)=>{
      //console.log(res);

      if(res.length != null && res.length != undefined && res.length >= 1 && cont === 1 ){
        res.forEach((value:any) => {
          //console.log(value);
          this.listPermission.push({
            descricao:value.descricao,
            ler:value.ler,
            incluir:value.incluir,
            editar: value.editar,
            deletar: value.deletar,
            listar: value.listar
          });

        });
        cont += 1;
        //console.log(this.listPermission);
        this.controlPermissions(this.listPermission);
        AccessService.permissioes.emit(this.listPermission)
        this.storage.setArray('permissioes',this.listPermission);

      }
    })
  }

  controlPermissions(listPermissions:any){

    this.storage.deleteItem('setores')
    this.storage.deleteItem('rolesUser')
    let permissions = JSON.parse(localStorage.getItem('permissioes')!);
    //console.log(listPermissions);
    //console.log(this.setores);

    listPermissions.forEach((res:any) => {

      if(res.descricao === 'ROLE_DIGITALIZA_OBITO'){

          if(this.verificaItem(this.setores,'atendimento') === true){
            //console.log(this.setores);

            this.setores.push('atendimento')
          }

        if(res.ler){
          this.acess.push('AT_LER_DOC')
        }if(res.incluir){
          this.acess.push('AT_CRIAR_DOC')
        }if(res.editar){
          this.acess.push('AT_EDITAR_DOC')
        }if(res.deletar){
          this.acess.push('AT_EXCLUIR_DOC')
        }
      }
      if(res.descricao === 'ROLE_REGUA_EMAIL'){
        if(this.verificaItem(this.setores,'financeiro') === true){
          this.setores.push('financeiro')
        }
        if(res.ler){
          this.acess.push('FN_ENVIA_COB')
        }if(res.incluir){
          this.acess.push('FN_ENVIA_COB')
        }if(res.editar){
          this.acess.push('FN_EDITAR_DOC')
        }if(res.excluir){
          this.acess.push('FN_EXCLUIR_DOC')
        }
      }
      if(res.descricao === 'ROLE_FISCAL_NOTA'){
        if(this.verificaItem(this.setores,'fiscal') === true){
          this.setores.push('fiscal')
        }
        if(res.ler){
          this.acess.push('FS_LER_NOTA')
        }if(res.incluir){
          this.acess.push('FS_PEGA_NOTA')
        }if(res.editar){
          this.acess.push('FS_EDITAR_NOTA')
        }if(res.excluir){
          this.acess.push('FS_EXCLUIR_NOTA')
        }
      }
      if(res.descricao === 'ROLE_VERIFICA_ARQUIVO'){
        if(this.verificaItem(this.setores,'ti') === true){
          this.setores.push('ti')
        }
        if(res.ler){
          this.acess.push('TI_VERIFICA')
        }
      }
      if(res.descricao === 'ROLE_PERMISSOES'){
        if(this.verificaItem(this.setores,'ti') === true){
          this.setores.push('ti')
        }
        if(res.ler){
          this.acess.push('TI_PERMISSOES')
        }
      }
    });
    this.storage.setArray('rolesUser', this.acess);
    AccessService.rolesUser.emit(this.acess)
    //console.log('PERMISSIOES : ' + this.acess);

    this.storage.setArray('setores', this.setores);
    AccessService.setores.emit(this.setores)
    //console.log('ACESSO A SETORES : ' + this.setores);

  }

  verificaItem(lista:any, item:any){
    let exist = false;

    if(lista.length <= 0){
      exist = true;
    }else{
      for (let index = 0; index < lista.length; index++) {
        const element = lista[index];

        if(element === item){
          return exist = false;
          console.log(element);
          console.log(item);
        }else{
          exist = true;
        }
      }
    }
    return exist
  }

  permissions(username:any){

    return this.httpClient.get( `${environment.baseUrl}user/permissao/` + username).pipe(
      tap(),
      take(1)
    );
  }

  ngOnDestroy(){
    this.subscribe.unsubscribe();
  }
}
