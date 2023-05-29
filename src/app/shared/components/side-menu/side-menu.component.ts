import { AccessService } from './../../../modules/login/access.service';
import { uPermission } from './../../interfaces/uPermission';
import { uMenuItens } from './../../interfaces/uMenuItens';

import { Router } from '@angular/router';
import { SideMenuService } from './side-menu.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @ViewChild('search') searchElement!: ElementRef;

  menuItems: uMenuItens[] = [];

  open: any = 'w-0 md:w-16 -ml-2 md:ml-0 lg:flex lg:flex-col';

  isOpen: any = false;

  title: string = '';

  filtro: string = '';

  setores: any[] = [];

  permissioes: uPermission[] = [];

  constructor(
    private sideMenuService: SideMenuService,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.getMainItens();
    AccessService.permissioes.subscribe((permissioes) => {
      //console.log(permissioes);
      this.permissioes = permissioes
      this.makeMain();

    });

    AccessService.rolesUser.subscribe((roles) => {
      //console.log(roles);
    });

    AccessService.setores.subscribe((setores) => {
      this.setores = setores;
      //console.log(setores);
    });


    setTimeout(() => {
    }, 200);

  }

  getMainItens() {
    const itens = JSON.parse(this.storage.getItem('menuItens')!);
    if (itens != null && itens != undefined) {
      this.menuItems = itens;
    }
  }

  makeMain() {
    //console.log(this.permissioes);
    //console.log(this.setores);

    if(this.permissioes.length <= 0){
      this.permissioes = JSON.parse(this.storage.getItem('permissioes')!);
    }

    if (this.menuItems.length === 0) {
      //Verifica se ja existe Itens no Menu

      if(this.setores.length <= 0){
        this.setores = JSON.parse(localStorage.getItem('setores')!);
      }
      //console.log('Montando menu');
      //console.log(this.setores);

      for (
        let index = 0;
        index < this.sideMenuService.menuItems.length;
        index++
      ) {
        //Percorre os itens disponiveis no service
        const role = this.sideMenuService.menuItems[index].roles[0];
        //console.log(this.sideMenuService.menuItems[index].subMenu);
        //console.log(this.permissioes.length);

        if (this.setores != null && this.setores != undefined) {
          //Verifica se existe setor atribuido pelas permissioes
          this.setores.forEach((res) => {
            //console.log(this.menuItems);

            if (role === res) {
              //Compara setor do item com o setor atribuido pelas permissioes
              this.menuItems.push(this.sideMenuService.menuItems[index]); //Adiciona os items no menu
              //console.log(role);
            }
          });
        }
      }
      for (let index = 0; index < this.menuItems.length; index++) {
        //Percorre os items no menu adicionados
        this.menuItems[index].subMenu = [];
        const menuItem = this.menuItems[index];
        //console.log(menuItem.roles[0]);
        //console.log(this.permissioes);
        for (
          let index = 0;
          index < this.sideMenuService.subMenuItems.length;
          index++
        ) {
          //Percorre os itens de submenu disponiveis em service
          const subMenuItem = this.sideMenuService.subMenuItems[index];
          //console.log(this.permissioes);

          this.permissioes.forEach((permission) => {
            //console.log(permission.descricao);
            if (
              permission.descricao === subMenuItem.roles[0] &&
              menuItem.roles[0] === subMenuItem.setor[0] &&
              this.verifySubMenuItem(menuItem.subMenu, subMenuItem)
            ) {
              //Compara setor e permissao

              menuItem.subMenu.push(subMenuItem); //Adiciona item de submenu nos itens de menu
              this.storage.setArray('menuItens', this.menuItems);
              //console.log(this.menuItems);
            }
          });
        }
      }
    }
  }

  verifySubMenuItem(list:any, item:any){
    let exist = true;
    list.forEach((element:any) => {
      if(element.subTitle === item.subTitle){
        return exist = false;
      }else{
        return exist;
      }
    });
    return exist
  }

  hiddenMenu() {
    if (this.isOpen) {
      this.open = 'w-0 md:w-16 -ml-2 sm:ml-0 lg:flex lg:flex-col';
    }
    if (!this.isOpen) {
      this.open = 'w-60 duration-100';
    }
    this.isOpen = !this.isOpen;
  }

  showMenu() {
    if (!this.isOpen) {
      this.open = 'w-60';
      this.isOpen = !this.isOpen;
    }
  }

  searchFocus() {
    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    }, 0);
  }

  changeScreen(rota: any) {
    //console.log(rota);
    this.router.navigate([rota]);
  }

  handleInput(event: Event) {
    this.title = (event.target as HTMLInputElement).value;
  }
}
