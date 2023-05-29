import { uClient } from '../../shared/interfaces/uClient';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']

})
export class AttendanceComponent{

  listDocs: Array<uClient>=[];

  currentScreen: any = 'listar';

  titulo = 'Atendimento';

  constructor() { }

}
