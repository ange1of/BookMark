import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingObject } from '../../classes/booking-object';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-remove-booking-object-dialog',
  templateUrl: './remove-booking-object-dialog.component.html',
  styleUrls: ['./remove-booking-object-dialog.component.scss']
})
export class RemoveBookingObjectDialogComponent implements OnInit {

  constructor(
    public api: ApiService,
    public dialogRef: MatDialogRef<RemoveBookingObjectDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { element: BookingObject },
  ) {}

  ngOnInit(): void {}

  confirmRemove(): void {
    this.api.deleteBookingObject(this.data.element.id).subscribe(
      () => this.dialogRef.close(true),
      () => this.snackBar.open(
        'Не удалось удалить объект', '',
        {duration: 1500, panelClass: ['bg-danger', 'text-white']}
      )
    );
  }

}
