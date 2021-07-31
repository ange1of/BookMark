import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../classes/user';
import { Token } from '../classes/token';

@Injectable({ providedIn: 'root' })
export class AuthService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }

  current(): Observable<User> {
    return this.http.get('auth/current/').pipe(map(res => <User>res));
  }

  login(username: string, password: string): Observable<void> {
    return this.http.post(
      'auth/login/', { username, password }).pipe(map(
        res => {
          const tokenResponse = <Token>res;
          localStorage.setItem('token', tokenResponse.key);
        }
    ));
  }

  logout(): void {
    this.http.delete('auth/logout/').subscribe(
      () => {}, () => {},
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/auth']);
      }
    );
  }

}
