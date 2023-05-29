import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

  @Input() menssagem = 'Carregando...'

  loading$ = this.loadingService.loading$;
  constructor(private loadingService: LoadingService) { }

}
