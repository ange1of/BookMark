import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Reservation } from '../../classes/reservation';
import { BookingObject } from '../../classes/booking-object';

@Component({
  selector: 'app-remove-reservation-dialog',
  templateUrl: './remove-reservation-dialog.component.html',
  styleUrls: ['./remove-reservation-dialog.component.scss']
})
export class RemoveReservationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RemoveReservationDialogComponent>,
    public api: ApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {elements: Reservation[]}
  ) { }

  ngOnInit(): void {}

  confirmRemove(): void {
    Promise.all(this.data.elements.map((item: Reservation) => this.api.deleteReservation(item.id).toPromise()))
      .then(() => this.dialogRef.close(true))
      .catch(() => {
        this.snackBar.open(
          'Ошибка при выполнении операции', '',
          {duration: 1500, panelClass: ['bg-danger', 'text-white']}
        );
        this.dialogRef.close(this.data.elements.length > 1);
      })
  }

  getBookingObjectsDisplay(booking_objects: BookingObject[]): string {
    return booking_objects.map(x => x.title).join(', ');
  }
}
