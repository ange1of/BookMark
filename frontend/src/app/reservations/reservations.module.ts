import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { ReservationDialogComponent } from './reservation-dialog/reservation-dialog.component';
import { ReservationsMainPageComponent } from './reservations-main-page/reservations-main-page.component';
import { RemoveReservationDialogComponent } from './remove-reservation-dialog/remove-reservation-dialog.component';
import { PipesModule } from '../pipes/pipes.module';
import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDatetimePickerModule
} from '@angular-material-components/datetime-picker';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ReservationsMainPageComponent,
    ReservationDialogComponent,
    RemoveReservationDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTooltipModule,
    NgxMaskModule.forRoot(),
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    PipesModule,
    NgxMatDatetimePickerModule,
    MatChipsModule
  ],
})
export class ReservationsModule {}
