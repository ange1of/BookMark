import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ApiService} from "../../service/api.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ReservationDialogComponent} from "../reservation-dialog/reservation-dialog.component";
import {Reservation} from "../../classes/reservation";
import { MatPaginator } from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {debounceTime} from "rxjs/operators";
import {PaginatedResponse} from "../../classes/paginated-response";
import {RemoveReservationDialogComponent} from "../remove-reservation-dialog/remove-reservation-dialog.component";
import { Handbook } from '../../classes/handbook';
import { BookingObject } from '../../classes/booking-object';
import { BookingObjectType } from '../../classes/booking-object-type';

@Component({
  selector: 'app-reservations-main-page',
  templateUrl: './reservations-main-page.component.html',
  styleUrls: ['./reservations-main-page.component.scss']
})
export class ReservationsMainPageComponent implements OnInit, AfterViewInit {

  reservationStates: Handbook[] = [];
  bookingObjectTypes: Handbook[] = [];
  bookingObjects: BookingObject[] = [];

  filtersForm = new FormGroup({
    id: new FormControl(),
    state: new FormControl(),
    booking_object_type: new FormControl(),
    booking_objects: new FormControl(),
    start_from: new FormControl(),
    start_to: new FormControl(),
    end_from: new FormControl(),
    end_to: new FormControl(),
    created_from: new FormControl(),
    created_to: new FormControl(),
    updated_from: new FormControl(),
    updated_to: new FormControl(),
    client_phone: new FormControl(),
    client_name: new FormControl()
  });

  showFilters = true;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  totalLength = 0;
  dataSource = new MatTableDataSource<Reservation>([]);
  displayedColumns: string[] = [
    'select', 'id', 'state', 'booking_object', 'start', 'end', 'price', 'client-name',
    'client-phone', 'comments'
  ];

  selection = new SelectionModel<Reservation>(true, []);

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.api.getBookingObjectTypes().subscribe(
      (res: BookingObjectType[]) => {this.bookingObjectTypes = res.map((item: BookingObjectType) => {
        return {title: item.title, value: item.id};
      })}
    );
    this.api.getReservationStatesHandbook().subscribe(res => this.reservationStates = res);

    this.filtersForm.controls.booking_object_type.valueChanges.subscribe(
      (object_type: string) => {
        if (!object_type) {
          this.bookingObjects = [];
          return;
        }
        this.api.getBookingObjects({object_type}).subscribe(
          (res: BookingObject[]) => this.bookingObjects = res
        );
      }
    );

    this.filtersForm.valueChanges.pipe(debounceTime(400)).subscribe(value => {
      this.loadReservations();
    });
  }

  ngAfterViewInit() {
    this.loadReservations();
  }

  loadReservations(): void {
    const filters = this.filtersForm.value;
    for (const key of [
      'start_from', 'start_to', 'end_from', 'end_to',
      'created_from', 'created_to', 'updated_from', 'updated_to'
    ]) {
      if (filters[key]) {
        filters[key] = new Date(filters[key]).toISOString();
      }
    }
    filters.limit = this.paginator?.pageSize;
    filters.offset = (this.paginator?.pageIndex || 0) * (this.paginator?.pageSize || 0);

    this.api.getPaginatedReservations(filters).subscribe(
      (res: PaginatedResponse<Reservation>) => {
        this.selection.clear();
        this.dataSource.data = res.results;
        this.totalLength = res.count;
      }
    );
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  clearFilters(): void {
    this.filtersForm.reset();
  }

  openReservationDialog(reservation?: Reservation): void {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      minWidth: '80%', maxWidth: '90%', maxHeight: '90vh', data: {element: reservation}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) { this.loadReservations(); }
    });
  }

  openRemoveReservationsDialog(): void {
    const dialogRef = this.dialog.open(RemoveReservationDialogComponent, {
      minWidth: '60%', maxWidth: '80%', maxHeight: '90vh', data: {elements: this.selection.selected}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) { this.loadReservations(); }
    });
  }

  handlePageChange() {
    this.loadReservations();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows && numSelected > 0;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getBookingObjectsDisplay(booking_objects: BookingObject[]): string {
    return booking_objects.map(x => x.title).join(', ');
  }
}
