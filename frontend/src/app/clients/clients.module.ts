import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsMainPageComponent } from './clients-main-page/clients-main-page.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgxMaskModule} from "ngx-mask";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { RemoveClientDialogComponent } from './remove-client-dialog/remove-client-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import { PipesModule } from "../pipes/pipes.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";



@NgModule({
    declarations: [
        ClientsMainPageComponent,
        ClientDialogComponent,
        RemoveClientDialogComponent
    ],
    exports: [
        ClientsMainPageComponent
    ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    PipesModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
  ]
})
export class ClientsModule { }
