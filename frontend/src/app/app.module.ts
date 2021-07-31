import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BaseViewComponent } from './base-view/base-view.component';
import { BookingObjectsModule } from './booking-objects/booking-objects.module';
import { ClientsModule } from './clients/clients.module';
import { ChangeApiUrlInterceptor } from './interceptors/change-api-url.interceptor';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReservationsModule } from './reservations/reservations.module';
import { ReservationsCalendarModule} from './reservations-calendar/reservations-calendar.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { MatButtonModule } from '@angular/material/button';
import { NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AuthComponent } from './auth/auth.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { RedirectUnauthorizedRequestsInterceptor } from './interceptors/redirect-unauthorized-requests.interceptor';

registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    BaseViewComponent,
    PageNotFoundComponent,
    AuthComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    HttpClientModule,
    NgxMatMomentModule,
    BookingObjectsModule,
    ClientsModule,
    ReservationsModule,
    ReservationsCalendarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'ru-RU'
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: ChangeApiUrlInterceptor,
      multi: true,
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: RedirectUnauthorizedRequestsInterceptor,
      multi: true
    }, {
      provide: MAT_DATE_LOCALE,
      useValue: 'ru-RU'
    }, {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    }, {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD.MM.YYYY',
        },
        display: {
          dateInput: 'DD.MM.YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    }, {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD.MM.YYYY HH:mm',
        },
        display: {
          dateInput: 'DD.MM.YYYY HH:mm',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
