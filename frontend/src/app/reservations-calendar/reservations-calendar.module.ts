import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsCalendarMainPageComponent } from './reservations-calendar-main-page/reservations-calendar-main-page.component';
import {
  CalendarCommonModule,
  CalendarModule,
  DateAdapter,
  CalendarNativeDateFormatter,
  DateFormatterParams, CalendarDateFormatter
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {

  public dayViewHour({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute: 'numeric'}).format(date);
  }

  public weekViewHour({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute: 'numeric'}).format(date);
  }

}

@NgModule({
  declarations: [
    ReservationsCalendarMainPageComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule,
    CalendarCommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatMomentDateModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
  ]
})
export class ReservationsCalendarModule { }
