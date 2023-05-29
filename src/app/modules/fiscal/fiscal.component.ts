import { FiscalService } from './fiscal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fiscal',
  templateUrl: './fiscal.component.html',
  styleUrls: ['./fiscal.component.scss']
})
export class FiscalComponent implements OnInit {
  titulo: any = 'Fiscal';

  constructor(private fiscalService: FiscalService) { }

  ngOnInit(): void {

  }

}
