import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ti',
  templateUrl: './ti.component.html',
  styleUrls: ['./ti.component.scss']
})
export class TiComponent implements OnInit {
  titulo = 'TI'
  constructor() { }

  ngOnInit(): void {
  }

}
