import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../classes/base-component';
import { BookingObjectType } from '../../classes/booking-object-type';
import { ServerErrors } from '../../classes/server-errors';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-booking-object-type-dialog',
  templateUrl: './booking-object-type-dialog.component.html',
  styleUrls: ['./booking-object-type-dialog.component.scss']
})
export class BookingObjectTypeDialogComponent extends BaseComponent implements OnInit {

  form = new FormGroup({
    'title': new FormControl(this.data.element?.title, [Validators.required])
  });

  serverErrors: ServerErrors | null = null;

  get isUpdate(): boolean {
    return !!this.data.element;
  }

  get objectTypeId(): string {
    return this.data.element?.id || '';
  }

  constructor(
    public api: ApiService,
    public dialogRef: MatDialogRef<BookingObjectTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {element?: BookingObjectType},
  ) { super(); }

  ngOnInit(): void {}

  save(): void {
    const method = this.isUpdate ?
      () => this.api.updateBookingObjectType(this.objectTypeId, this.form.value) :
      () => this.api.createBookingObjectType(this.form.value);

    method().subscribe(
      () => this.dialogRef.close(true),
      error => {
        this.serverErrors = error.error;
        this.displayErrors(error.error, this.form);
      }
    );
  }
}
