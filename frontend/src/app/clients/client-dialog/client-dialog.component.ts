import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../classes/base-component';
import { Client } from '../../classes/client';
import { ServerErrors } from '../../classes/server-errors';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-client-dialog',
  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client-dialog.component.scss']
})
export class ClientDialogComponent extends BaseComponent implements OnInit {

  form = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null),
    additional_info: new FormControl(null),
  });

  serverErrors: ServerErrors | null = null;

  get isUpdate(): boolean {
    return !!this.data.element;
  }

  get clientId(): string {
    return this.data.element?.id || '';
  }

  constructor(
    public dialogRef: MatDialogRef<ClientDialogComponent>,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { element?: Client }
  ) { super(); }

  ngOnInit(): void {
    if (this.data.element) {
      this.form.patchValue(this.data.element);
    }
  }

  save(): void {
    const method = this.isUpdate ?
      () => this.api.updateClient(this.clientId, this.form.value) :
      () => this.api.createClient(this.form.value);

    method().subscribe(
      () => this.dialogRef.close(true),
      error => {
        this.serverErrors = error.error;
        this.displayErrors(error.error, this.form);
      }
    );
  }

}
