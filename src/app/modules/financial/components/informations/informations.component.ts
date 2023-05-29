import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit {
  width = 'w-[32px]'
  expanded:boolean = false;
  @Input() listFoundContrats!: string[];
  @Input() listSendContrats!: string[];
  @Input() listErrorContrats!: string[];

  constructor() { }

  ngOnInit(): void {
  }

  expand(){
    if(!this.expanded){
      this.expanded = true;
      this.width = 'w-[250px]'
    }else{
      this.expanded = false;
      this.width = 'w-[32px]'
    }
  }


}
