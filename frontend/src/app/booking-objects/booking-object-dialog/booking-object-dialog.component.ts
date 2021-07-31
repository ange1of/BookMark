import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../classes/base-component';
import { BookingObject } from '../../classes/booking-object';
import { BookingObjectType } from '../../classes/booking-object-type';
import { Handbook } from '../../classes/handbook';
import { ServerErrors } from '../../classes/server-errors';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-booking-object-dialog',
  templateUrl: './booking-object-dialog.component.html',
  styleUrls: ['./booking-object-dialog.component.scss']
})
export class BookingObjectDialogComponent extends BaseComponent implements OnInit {

  form = new FormGroup({
    'title': new FormControl(null, [Validators.required]),
    'object_type': new FormControl(null, [Validators.required]),
    'pricing_type': new FormControl(null, [Validators.required]),
    'price': new FormControl(null, [Validators.required])
  });

  bookingObjectTypes: Handbook[] = [];
  pricingTypes: Handbook[] = [];
  serverErrors: ServerErrors | null = null;

  get isUpdate(): boolean {
    return !!this.data.element;
  }

  get objectId(): string {
    return this.data.element?.id || '';
  }

  constructor(
    public dialogRef: MatDialogRef<BookingObjectDialogComponent>,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: {element?: BookingObject}
  ) { super(); }

  ngOnInit(): void {
    this.api.getBookingObjectTypes().subscribe(
      (res: BookingObjectType[]) => {this.bookingObjectTypes = res.map((item: BookingObjectType) => {
        return {title: item.title, value: item.id};
      })}
    );
    this.api.getPricingTypesHandbook().subscribe(res => this.pricingTypes = res);

    if (this.data.element) {
      this.form.patchValue(this.data.element);
    }
  }

  save(): void {
    const method = this.isUpdate ?
      () => this.api.updateBookingObject(this.objectId, this.form.value) :
      () => this.api.createBookingObject(this.form.value);

    method().subscribe(
      () => this.dialogRef.close(true),
      error => {
        this.serverErrors = error.error;
        this.displayErrors(error.error, this.form);
      }
    );
  }

}
