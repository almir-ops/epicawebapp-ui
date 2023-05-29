import { StorageService } from './../../shared/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    console.log('afsa');

    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 5000);
  }
}
