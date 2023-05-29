import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contador',
  templateUrl: './contador.component.html',
  styleUrls: ['./contador.component.scss']
})
export class ContadorComponent {

  @Input() title!: string;
  @Input() message!: string;
  @Input() expandContador: boolean = false;

  isOpen = 'h-[50px] w-[200px]';
  @Input()listDocSaves: any[]= [];

  constructor() {
   }

  close(){
    this.expandContador = !this.expandContador;
    if(this.expandContador === true){
      this.isOpen = 'h-[200px] w-[300px]';
    }else{
      this.isOpen = 'h-[50px] w-[200px]';
    }
  }
}
