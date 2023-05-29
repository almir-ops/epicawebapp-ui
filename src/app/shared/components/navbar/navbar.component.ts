import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: any = 'Admin';
  @Input() titleNavBar: any = 'Home';

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('username');

    const currentRoute = this.router.url.replace('/', '');
    if (currentRoute.length > 1) {
    }
  }

  capitalize(string: any) {
    return string[0].toUpperCase() + string.slice(1);
  }
}
