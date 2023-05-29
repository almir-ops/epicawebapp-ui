import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService{

  menuItems: any[] = [
   /*  {
      title:'Dashboard',
      icon:'./assets/icons/home.svg',
      url:''
    }, */
    {
      title:'Atendimento',
      icon:'./assets/icons/clipboard-doc.svg',
      subMenu: [],
      roles:['atendimento']
    },
     {
      title:'Cobrança',
      icon:'./assets/icons/dollar.svg',
      subMenu: [],
      roles:['financeiro']
    },
     {
      title:'Fiscal',
      icon:'./assets/icons/fiscal.svg',
      subMenu: [],
      roles:['fiscal']
    },
    {
      title:'TI',
      icon:'./assets/icons/pc.svg',
      subMenu: [],
      roles:['ti']
    },
    {
      title:'Permissões',
      icon:'./assets/icons/lock.svg',
      subMenu: [],
      roles:['admin']
    }

  ]
  subMenuItems: any[] =[
    {
      subTitle: 'Scanner de documentos',
      url:'atendimento/list',
      icon:'',
      setor:['atendimento'],
      roles:['ROLE_DIGITALIZA_OBITO']
    },
    {
      subTitle: 'Buscar produtos',
      url:'atendimento/buscar-produtos',
      icon:'',
      setor:['atendimento'],
      roles:['ROLE_BUSCA_PRODUTO']
    },
    {
      subTitle: 'Envio de Email',
      url:'financeiro/envia-email',
      icon:'',
      setor:['financeiro'],
      roles:['ROLE_REGUA_EMAIL']
    },
    {
      subTitle: 'Envio de SMS',
      url:'financeiro/envia-sms',
      icon:'',
      setor:['financeiro'],
      roles:['ROLE_REGUA_SMS']
    },
    {
      subTitle: 'Grupo de acessos',
      url:'acessos/grupo-acessos',
      icon:'',
      setor:['admin'],
      roles:['ROLE_REGUA_SMS']
    },
    {
      subTitle: 'Gerar nota fiscal',
      url:'fiscal/gerar-nota',
      icon:'',
      setor:['fiscal'],
      roles:['ROLE_FISCAL_NOTA']
    },
    {
      subTitle: 'Listar notas',
      url:'fiscal/listar-notas',
      icon:'',
      setor:['fiscal'],
      roles:['ROLE_FISCAL_NOTA']
    },
    {
      subTitle: 'Verifica arquivos salvos',
      url:'ti/verifica-arquivos',
      icon:'',
      setor:['ti'],
      roles:['ROLE_VERIFICA_ARQUIVO']
    },
    {
      subTitle: 'Usuarios e permissões',
      url:'ti/lista-usuarios',
      icon:'',
      setor:['ti'],
      roles:['ROLE_PERMISSOES']
    }

  ]
  constructor() { }


}
