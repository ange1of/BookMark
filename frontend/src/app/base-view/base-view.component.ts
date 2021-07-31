import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-base-view',
  templateUrl: './base-view.component.html',
  styleUrls: ['./base-view.component.scss']
})
export class BaseViewComponent implements OnInit {

  sidenavOpened = true;
  user: User | null = null;

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.current().subscribe((res: User) => this.user = res);
  }

  logout() {
    this.auth.logout();
  }
}
