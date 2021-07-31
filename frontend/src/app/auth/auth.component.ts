import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../classes/base-component';
import { FormControl, FormGroup } from '@angular/forms';
import { ServerErrors } from '../classes/server-errors';
import { AuthService } from '../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends BaseComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  serverErrors: ServerErrors | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {}

  submit(): void {
    this.auth.login(
      this.form.controls.username.value, this.form.controls.password.value
    ).subscribe(
      () => this.router.navigate(['']),
      (error) => {
        this.serverErrors = error.error || null;
        if (error.error.auth_error) {
          this.snackBar.open(
            'Ошибка аутентификации', '',
            { duration: 1500, panelClass: ['bg-danger', 'text-white'] }
          );
        }
      }
    );
  }
}
