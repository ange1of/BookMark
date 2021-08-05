import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
  BookingObjectTypeDialogComponent
} from '../booking-object-type-dialog/booking-object-type-dialog.component';
import {
  BookingObjectDialogComponent
} from '../booking-object-dialog/booking-object-dialog.component';
import {
  RemoveBookingObjectTypeDialogComponent
} from '../remove-booking-object-type-dialog/remove-booking-object-type-dialog.component';
import {
  RemoveBookingObjectDialogComponent
} from '../remove-booking-object-dialog/remove-booking-object-dialog.component';
import { BookingObject, BookingObjectTreeNode } from '../../classes/booking-object';
import { BookingObjectType } from '../../classes/booking-object-type';
import { ApiService } from '../../service/api.service';

interface BookingObjectNode {
  element: BookingObject;
}

interface BookingObjectTypeNode {
  element: BookingObjectType;
  children?: BookingObjectTypeNode[];
  subChildren?: BookingObjectNode[];
}

@Component({
  selector: 'app-booking-objects-main-page',
  templateUrl: './booking-objects-main-page.component.html',
  styleUrls: ['./booking-objects-main-page.component.scss']
})
export class BookingObjectsMainPageComponent implements OnInit {

  dataSource = new MatTreeNestedDataSource<BookingObjectTypeNode>();
  treeControl = new NestedTreeControl<BookingObjectTypeNode>(node => {
    return node.children || node.subChildren;
  });

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.reloadTree();
  }

  hasChild (_: number, node: BookingObjectTypeNode): boolean {
    return node.subChildren !== undefined || !!node.children && node.children.length > 0;
  }

  reloadTree(): void {
    this.api.getBookingObjectTree().subscribe(
      (res: BookingObjectTreeNode[]) => {
        const newData: BookingObjectTypeNode[] = res.map((item: BookingObjectTreeNode) => {
          return {
            element: {id: item.id, title: item.title},
            subChildren: item.booking_objects.map((obj: BookingObject) => {return {element: obj}})
          };
        });
        this.dataSource.data = newData;
        this.treeControl.dataNodes = newData;
        this.treeControl.expandAll();
      },
      () => {
        this.snackBar.open(
          'Не удалось загрузить объекты', '',
          {duration: 1500, panelClass: ['bg-danger', 'text-white']}
        )
      }
    );
  }

  openBookingObjectDialog(bookingObject?: BookingObject): void {
    const dialogRef = this.dialog.open(BookingObjectDialogComponent, {
      minWidth: '40%', maxWidth: '80%', maxHeight: '90vh', data: {element: bookingObject}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) { this.reloadTree() }
    });
  }

  openDeleteBookingObjectDialog(bookingObject: BookingObject): void {
    const dialogRef = this.dialog.open(RemoveBookingObjectDialogComponent, {
      minWidth: '40%', maxWidth: '80%', maxHeight: '90vh', data: {element: bookingObject}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) { this.reloadTree() }
    });
  }

  openBookingObjectTypeDialog(bookingObjectType?: BookingObjectType): void {
    const dialogRef = this.dialog.open(BookingObjectTypeDialogComponent, {
      minWidth: '40%', maxWidth: '80%', maxHeight: '90vh', data: {element: bookingObjectType}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) { this.reloadTree() }
    });
  }

  openDeleteBookingObjectTypeDialog(bookingObjectType: BookingObjectType): void {
    const dialogRef = this.dialog.open(RemoveBookingObjectTypeDialogComponent, {
      minWidth: '40%', maxWidth: '80%', maxHeight: '90vh', data: {element: bookingObjectType}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) { this.reloadTree() }
    });
  }

}
