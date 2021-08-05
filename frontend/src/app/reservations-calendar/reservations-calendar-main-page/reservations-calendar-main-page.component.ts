import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarEvent as BaseCalendarEvent, CalendarView, } from 'angular-calendar';
import {
  endOfDay, endOfMonth, endOfWeek, isSameDay, isSameMonth,
  startOfDay, startOfMonth, startOfWeek,
} from 'date-fns';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BookingObject, BookingObjectTreeNode } from '../../classes/booking-object';
import { ApiService } from '../../service/api.service';
import { Reservation } from '../../classes/reservation';
import { PhonePipe } from '../../pipes/phone.pipe';
import { PaginatedResponse } from '../../classes/paginated-response';
import { MatDialog } from '@angular/material/dialog';
import {
  ReservationDialogComponent
} from '../../reservations/reservation-dialog/reservation-dialog.component';
import * as moment from 'moment';

const RESERVATION_COLORS: any = {
  created: { primary: '#F3E037', secondary: '#FFFCB3' },
  prepayment_received: { primary: '#5CADFF', secondary: '#D1E8FF' },
  active: { primary: '#88E170', secondary: '#C3F1B6' },
  completed: { primary: '#F69898', secondary: '#FAE3E3' },
  cancelled: { primary: '#919191', secondary: '#E3E3E3' }
};

interface CalendarEvent extends BaseCalendarEvent {
  reservation: Reservation;
  shortTitle: string;
}

interface DayEvent {
  obj: BookingObject;
  events?: CalendarEvent[];
  count?: number;
}

@Component({
  selector: 'app-reservations-calendar-main-page',
  templateUrl: './reservations-calendar-main-page.component.html',
  styleUrls: ['./reservations-calendar-main-page.component.scss']
})
export class ReservationsCalendarMainPageComponent implements OnInit {

  objectTree: BookingObjectTreeNode[] = [];

  filtersForm = new FormGroup({
    booking_object_type: new FormControl(),
    booking_objects: new FormControl(),
    date_from: new FormControl(),
    date_to: new FormControl(),
  });

  bookingObjects: BookingObject[] = [];

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;
  events: CalendarEvent[] = [];
  dayEventsMap: Map<string, DayEvent[]> = new Map<string, DayEvent[]>();

  constructor(
    public api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.api.getBookingObjectTree().subscribe(
      (res: BookingObjectTreeNode[]) => this.objectTree = res,
      () => this.snackBar.open(
        'Не удалось загрузить данные', '',
        {duration: 1500, panelClass: ['bg-danger', 'text-white']}
      )
    );

    this.api.getPaginatedReservations({ limit: 1 }).subscribe(
      (res: PaginatedResponse<Reservation>) => {
        if (res.results.length) {
          this.filtersForm.patchValue({
            booking_object_type: res.results[0].booking_objects[0].object_type
          });
        }
      }
    );

    this.filtersForm.controls.booking_object_type.valueChanges.subscribe(
      (value: string) => {
        this.bookingObjects = this.objectTree.find(x => x.id === value)?.booking_objects || [];
        this.filtersForm.controls.booking_objects.reset();
      }
    );

    this.filtersForm.valueChanges.pipe(debounceTime(500)).subscribe(
      (value) => {
        if (!(value.date_from && value.date_to)) {
          this.handleViewDateChange();
          return;
        }
        const filters = this.filtersForm.value;
        for (const key of ['date_from', 'date_to']) {
          if (filters[key]) { filters[key] = new Date(filters[key]).toISOString(); }
        }

        this.api.getReservationsRange(filters).subscribe(
          (reservations: Reservation[]) => {
            this.dayEventsMap.clear();
            this.events = reservations.filter(x => x.state !== 'cancelled').map(
              (res: Reservation) => {
                const titleStart = `№${res.id}: ${res.booking_objects.map(x => x.title).sort().join(', ')}`;
                const titleDates = `  |  ${moment(res.start).format('DD.MM HH:mm')} - ${moment(res.end).format('DD.MM HH:mm')}`;
                const titleState = `  |  [${res.state_display}]`;
                return {
                  id: res.id,
                  start: new Date(res.start),
                  end: new Date(res.end),
                  title: titleStart + titleDates +
                    `  |  ${res.client.name} ${new PhonePipe().transform(res.client.phone)}` + titleState,
                  shortTitle: titleStart + titleDates + titleState,
                  color: RESERVATION_COLORS[res.state],
                  reservation: res
                };
              }
            )
          },
          () => this.snackBar.open(
            'Не удалось загрузить данные', '',
            {duration: 1500, panelClass: ['bg-danger', 'text-white']}
          )
        );
      }
    );
  }

  dayClicked({ date, events }: { date: Date; events: BaseCalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen =
        !((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0);
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
    this.handleViewDateChange();
  }

  handleViewDateChange(): void {
    this.activeDayIsOpen = false;

    let from, to;

    switch (this.view) {
      case CalendarView.Month:
        from = startOfMonth(this.viewDate);
        to = endOfMonth(this.viewDate);
        break;
      case CalendarView.Week:
        from = startOfWeek(this.viewDate, { weekStartsOn: 1 });
        to = endOfWeek(this.viewDate, { weekStartsOn: 1 });
        break;
      case CalendarView.Day:
        from = startOfDay(this.viewDate);
        to = endOfDay(this.viewDate);
    }

    this.filtersForm.patchValue({ date_from: from, date_to: to });
  }

  openReservationDialog(id?: string | number): void {
    if (!id) { return; }

    this.api.getReservation(+id).subscribe((res: Reservation) => {
      const dialogRef = this.dialog.open(ReservationDialogComponent, {
        width: '80%', data: {element: res}
      });
      dialogRef.afterClosed().subscribe((reload: boolean) => {
        if (reload) { this.handleViewDateChange() }
      });
    });
  }

  openCreateReservationDialog(): void {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '80%', data: {}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) { this.handleViewDateChange() }
    });
  }

  transformDayEvents(day: any): DayEvent[] {
    const cachedEvents = this.dayEventsMap.get(day.date.toDateString());
    if (cachedEvents) { return cachedEvents; }

    if (!this.filtersForm.controls.booking_object_type) { return []; }

    const objectMap = new Map<string, CalendarEvent[]>();
    day.events.forEach((event: CalendarEvent) => {
      if (event.reservation.state === 'cancelled') { return; }
      event.reservation.booking_objects.forEach(
        obj => {
          if (objectMap.has(obj.id)) {
            objectMap.get(obj.id)?.push(event);
          } else {
            objectMap.set(obj.id, [event]);
          }
        }
      );
    });

    const dayEvents: DayEvent[] = [];
    for (const obj of this.bookingObjects) {
      const dayEvent: DayEvent = { obj: obj };
      if (obj.pricing_type !== 'daily-payment') {
        dayEvent.count = objectMap.get(obj.id)?.length;
      }
      dayEvent.events = objectMap.get(obj.id)?.sort(
        (a, b) => a.start > b.start ? 1 : -1
      );
      dayEvents.push(dayEvent);
    }

    this.dayEventsMap.set(day.date.toDateString(), dayEvents);
    return dayEvents;
  }

  getCompositeTooltipTitle(events: CalendarEvent[], obj: BookingObject): string {
    return `<b>${obj.title}</b><br>` + events.map(x => x.shortTitle).join('<br>');
  }
}
