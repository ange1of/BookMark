import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../service/api.service";
import {Client} from "../../classes/client";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-remove-client-dialog',
  templateUrl: './remove-client-dialog.component.html',
  styleUrls: ['./remove-client-dialog.component.scss']
})
export class RemoveClientDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RemoveClientDialogComponent>,
    public api: ApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {elements: Client[]}
  ) { }

  ngOnInit(): void {}

  confirmRemove(): void {
    Promise.all(this.data.elements.map((item: Client) => this.api.deleteClient(item.id).toPromise()))
      .catch(() => this.snackBar.open(
        'Ошибка при выполнении операции', '',
        {duration: 1500, panelClass: ['bg-danger', 'text-white']}
      ))
      .finally(() => this.dialogRef.close(true));
  }

}
