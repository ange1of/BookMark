import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import {
  BookingObjectDialogComponent
} from './booking-object-dialog/booking-object-dialog.component';
import {
  BookingObjectTypeDialogComponent
} from './booking-object-type-dialog/booking-object-type-dialog.component';
import {
  RemoveBookingObjectTypeDialogComponent
} from './remove-booking-object-type-dialog/remove-booking-object-type-dialog.component';
import {
  RemoveBookingObjectDialogComponent
} from './remove-booking-object-dialog/remove-booking-object-dialog.component';
import {
  BookingObjectsMainPageComponent
} from './booking-objects-main-page/booking-objects-main-page.component';

@NgModule({
  declarations: [
    BookingObjectDialogComponent,
    BookingObjectTypeDialogComponent,
    RemoveBookingObjectTypeDialogComponent,
    RemoveBookingObjectDialogComponent,
    BookingObjectsMainPageComponent
  ],
  exports: [
    BookingObjectsMainPageComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTreeModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class BookingObjectsModule {}
