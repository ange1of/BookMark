import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ClientsMainPageComponent } from './clients/clients-main-page/clients-main-page.component';
import {
  BookingObjectsMainPageComponent
} from './booking-objects/booking-objects-main-page/booking-objects-main-page.component';
import {
  ReservationsMainPageComponent
} from './reservations/reservations-main-page/reservations-main-page.component';
import {
  ReservationsCalendarMainPageComponent
} from './reservations-calendar/reservations-calendar-main-page/reservations-calendar-main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BaseViewComponent } from './base-view/base-view.component';
import { AuthService } from './service/auth.service';


const routes: Routes = [
  {
    path: '',
    component: BaseViewComponent,
    canActivate: [AuthService],
    children: [
      { path: '',   redirectTo: '/calendar', pathMatch: 'full' },
      { path: 'calendar', component: ReservationsCalendarMainPageComponent, pathMatch: 'full' },
      { path: 'reservations', component: ReservationsMainPageComponent, pathMatch: 'full' },
      { path: 'booking-objects', component: BookingObjectsMainPageComponent, pathMatch: 'full' },
      { path: 'clients', component: ClientsMainPageComponent, pathMatch: 'full' },
    ]
  },
  { path: 'auth', component: AuthComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
