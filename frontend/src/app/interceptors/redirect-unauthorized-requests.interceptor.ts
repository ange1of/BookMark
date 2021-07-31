import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class RedirectUnauthorizedRequestsInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>(subscriber => {
      let originalRequestSubscription = next.handle(request).subscribe(
        (response) => subscriber.next(response),
        (err) => {
          if (err.status === 401 || err.status === 403) {
            this.snackBar.open(
              'Ошибка аутентификации', '',
              { duration: 1500, panelClass: ['bg-danger', 'text-white'] }
            );
            localStorage.removeItem('token');
            setTimeout(() => this.router.navigate(['/auth']), 1500);
          } else {
            subscriber.error(err);
          }
        },
        () => subscriber.complete()
      );
      return () => originalRequestSubscription.unsubscribe();
    });
  }
}
