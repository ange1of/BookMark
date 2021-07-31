import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingObjectType } from '../../classes/booking-object-type';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-remove-booking-object-type-dialog',
  templateUrl: './remove-booking-object-type-dialog.component.html',
  styleUrls: ['./remove-booking-object-type-dialog.component.scss']
})
export class RemoveBookingObjectTypeDialogComponent implements OnInit {

  constructor(
    public api: ApiService,
    public dialogRef: MatDialogRef<RemoveBookingObjectTypeDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { element: BookingObjectType },
  ) {}

  ngOnInit(): void {}

  confirmRemove(): void {
    this.api.deleteBookingObjectType(this.data.element.id).subscribe(
      () => this.dialogRef.close(true),
      () => this.snackBar.open(
        'Не удалось удалить категорию', '',
        { duration: 1500, panelClass: ['bg-danger', 'text-white'] }
      )
    );
  }

}
