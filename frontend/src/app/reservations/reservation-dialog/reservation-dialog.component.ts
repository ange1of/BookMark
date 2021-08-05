import { Component, Inject, OnInit } from '@angular/core';
import { ServerErrors } from '../../classes/server-errors';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Reservation } from '../../classes/reservation';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Handbook } from '../../classes/handbook';
import { BookingObjectType } from '../../classes/booking-object-type';
import { Client } from '../../classes/client';
import { BookingObject } from '../../classes/booking-object';
import { debounceTime } from 'rxjs/operators';
import {BaseComponent} from "../../classes/base-component";
import { RemoveReservationDialogComponent } from '../remove-reservation-dialog/remove-reservation-dialog.component';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.scss']
})
export class ReservationDialogComponent extends BaseComponent implements OnInit {

  form = new FormGroup({
    state: new FormControl(null, [Validators.required]),
    start: new FormControl(null, [Validators.required]),
    end: new FormControl(null, [Validators.required]),
    booking_objects: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    comments: new FormControl(null),
  });

  clientInfoForm = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null),
    additional_info: new FormControl(null),
  });

  bookingObjectTypeControl = new FormControl(null, [Validators.required]);

  reservationStates: Handbook[] = [];
  bookingObjectTypes: Handbook[] = [];
  bookingObjects: BookingObject[] = [];

  formErrors: ServerErrors | null = null;
  clientInfoErrors: ServerErrors | null = null;

  clientInfoPanelOpened = false;

  prevClientPhoneValue = '';
  isClientSearchProcessing = false;
  clientSearchStatus = '';

  get isUpdate(): boolean {
    return !!this.data.element;
  }

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<ReservationDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {element?: Reservation},
  ) { super(); }

  ngOnInit(): void {
    this.api.getBookingObjectTypes().subscribe(
      (res: BookingObjectType[]) => {this.bookingObjectTypes = res.map((item: BookingObjectType) => {
        return {title: item.title, value: item.id};
      })}
    );
    this.api.getReservationStatesHandbook().subscribe(res => this.reservationStates = res);

    this.bookingObjectTypeControl.valueChanges.subscribe(
      (object_type: string) => {
        this.api.getBookingObjects({object_type}).subscribe(
          (res: BookingObject[]) => {
            this.bookingObjects = res;
            if (this.bookingObjectTypeControl.dirty) {
              this.form.controls.booking_objects.setValue([]);
            }
          }
        );
      }
    );

    if (this.data.element) {
      this.form.patchValue(this.data.element);
      this.form.controls.booking_objects.setValue(this.data.element.booking_objects.map(x => x.id));
      this.clientInfoForm.patchValue(this.data.element.client);
      this.clientInfoPanelOpened = true;
      this.bookingObjectTypeControl.patchValue(this.data.element.booking_objects[0]?.object_type);
    }

    this.clientInfoForm.controls.phone.valueChanges.pipe(debounceTime(300)).subscribe(
      (value: string) => {
        if (value.length < 17 || value == this.prevClientPhoneValue || this.isClientSearchProcessing) { return; }
        this.isClientSearchProcessing = true;
        this.prevClientPhoneValue = value;
        this.api.getClients({phone: value}).subscribe(
          (res: Client[]) => {
            if (!res.length) {
              this.clientSearchStatus = 'not-found';
              return;
            }
            this.clientSearchStatus = 'found';
            this.clientInfoForm.patchValue(res[0]);
            this.clientInfoForm.controls.phone.setErrors(null);
          },
          () => {
            this.clientSearchStatus = 'error';
            setTimeout(() => this.isClientSearchProcessing = false, 200);
          },
          () => setTimeout(() => this.isClientSearchProcessing = false, 200)
        );
      }
    );
  }

  calculatePrice(): void {
    if (!(this.form.controls.booking_object.value &&
          this.form.controls.start.value && this.form.controls.start.value)) { return; }

    const obj: BookingObject | undefined =
      this.bookingObjects.find(item => item.id == this.form.controls.booking_object.value);
    if (!obj) { return; }

    let value = obj.price;
    const diff: number =
      new Date(this.form.controls.end.value).getTime() - new Date(this.form.controls.start.value).getTime();
    if (diff < 0) { return; }

    if (obj.pricing_type == 'daily-payment') {
      value = diff / 86400000
    } else if (obj.pricing_type == 'hourly-payment') {
      value = diff / 3600000
    } else if (obj.pricing_type === 'per-minute-payment') {
      value = diff / 1440
    }
    this.form.controls.price.setValue(Math.ceil(value) * obj.price);
  }

  openRemoveReservationDialog(): void {
    if (!this.data.element) { return; }
    const dialogRef = this.dialog.open(RemoveReservationDialogComponent, {
      minWidth: '60%', maxWidth: '80%', maxHeight: '90vh', data: {elements: [this.data.element]}
    });
    dialogRef.afterClosed().subscribe((removed: boolean) => {
      if (removed) { this.dialogRef.close(true); }
    });
  }

  save(): void {
    this.api.createOrUpdateClient(this.clientInfoForm.value).subscribe(
      (client: Client) => {
        const data = this.form.value;
        data.client = client.id;

        const method = this.isUpdate ?
          () => this.api.updateReservation(this.data.element?.id || -1, this.form.value) :
          () => this.api.createReservation(data);
        method().subscribe(
          () => this.dialogRef.close(true),
          error => {
            this.formErrors = error.error;
            this.displayErrors(error.error, this.form);
          }
        );
      },
      (error) => {
        this.clientInfoErrors = error.error;
        this.displayErrors(error.error, this.clientInfoForm);
      }
    );
  }

  getBookingObjectDisplay(id: string): string {
    return this.bookingObjects.find(x => x.id == id)?.title || '';
  }

  removeChip(id: string): void {
    this.form.controls.booking_objects.setValue(this.form.controls.booking_objects.value.filter((x: string) => x !== id));
  }
}
