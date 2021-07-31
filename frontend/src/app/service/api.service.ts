import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingObject, BookingObjectTreeNode } from '../classes/booking-object';
import { BookingObjectType } from '../classes/booking-object-type';
import { map } from 'rxjs/operators';
import { Client } from '../classes/client';
import { Handbook } from '../classes/handbook';
import {Reservation} from "../classes/reservation";
import {PaginatedResponse} from "../classes/paginated-response";

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(public http: HttpClient) {}

  private processSearchFilters(filters: any): HttpParams {
    let params = new HttpParams();
    Object.keys(filters).map(key => {
      let value;
      if (filters[key]) {
        if (filters[key] instanceof Date) {
          value = filters[key];
        } else if (filters[key] instanceof Array) {
          filters[key].forEach((item: any) => {
            if (item) {
              params = params.append(key, item.toString().trim())
            }
          });
        } else {
          value = filters[key].toString().trim();
        }
      }
      if (value) {
        params = params.append(key, value);
      }
    });
    return params;
  }

  // BookingObjects API ==========================================
  getBookingObjects(filters?: object): Observable<BookingObject[]>{
    if (filters) {
      return this.http.get('booking-object/object/', { params: this.processSearchFilters(filters) })
        .pipe(map(res => <BookingObject[]>res));
    }
    return this.http.get('booking-object/object/').pipe(map(res => <BookingObject[]>res));
  }
  getBookingObject(id: string): Observable<BookingObject> {
    return this.http.get(`booking-object/object/${id}`).pipe(map(res => <BookingObject>res));
  }
  createBookingObject(data: object): Observable<void> {
    return this.http.post('booking-object/object', data).pipe(map(() => {}));
  }
  updateBookingObject(id: string, data: object): Observable<void> {
    return this.http.patch(`booking-object/object/${id}`, data).pipe(map(() => {}));
  }
  deleteBookingObject(id: string): Observable<void> {
    return this.http.delete(`booking-object/object/${id}`).pipe(map(() => {}));
  }

  getBookingObjectTree(): Observable<BookingObjectTreeNode[]> {
    return this.http.get('booking-object/object-tree/')
      .pipe(map(res => <BookingObjectTreeNode[]>res));
  }

  // BookingObjectType API ==========================================
  getBookingObjectTypes(): Observable<BookingObjectType[]>{
    return this.http.get('booking-object/type/').pipe(map(res => <BookingObjectType[]>res));
  }
  createBookingObjectType(data: object): Observable<void> {
    return this.http.post('booking-object/type/', data).pipe(map(() => {}));
  }
  updateBookingObjectType(id: string, data: object): Observable<void> {
    return this.http.patch(`booking-object/type/${id}`, data).pipe(map(() => {}));
  }
  deleteBookingObjectType(id: string): Observable<void> {
    return this.http.delete(`booking-object/type/${id}`).pipe(map(() => {}));
  }

  // Client API ==========================================
  getClients(filters?: any): Observable<Client[]> {
    if (filters) {
      delete filters.limit;
      delete filters.offset;
      return this.http.get('client/', { params: this.processSearchFilters(filters) })
        .pipe(map(res => <Client[]>res));
    }
    return this.http.get('client/').pipe(map(res => <Client[]>res));
  }
  getPaginatedClients(filters: any): Observable<PaginatedResponse<Client>> {
      filters.limit = filters.limit || 500;
      return this.http.get('client/', { params: this.processSearchFilters(filters) })
        .pipe(map(res => <PaginatedResponse<Client>>res));
  }
  getClient(id: string): Observable<Client> {
    return this.http.get(`client/${id}`).pipe(map(res => <Client>res));
  }
  createClient(data: object): Observable<Client> {
    return this.http.post('client/', data).pipe(map(res => <Client>res));
  }
  createOrUpdateClient(data: object): Observable<Client> {
    return this.http.put('client/create-or-update', data).pipe(map(res => <Client>res));
  }
  updateClient(id: string, data: object): Observable<Client> {
    return this.http.patch(`client/${id}`, data).pipe(map(res => <Client>res));
  }
  deleteClient(id: string): Observable<void> {
    return this.http.delete(`client/${id}`).pipe(map(res => {}));
  }

  // Reservation API ==========================================
  getReservations(filters?: any): Observable<Reservation[]> {
    if (filters) {
      delete filters.limit;
      delete filters.offset;
      return this.http.get(
        'reservation/', { params: this.processSearchFilters(filters) }
      ).pipe(map(res => <Reservation[]>res));
    }
    return this.http.get('reservation/').pipe(map(res => <Reservation[]>res));
  }
  getPaginatedReservations(filters: any): Observable<PaginatedResponse<Reservation>> {
      filters.limit = filters.limit || 500;
      return this.http.get('reservation/', { params: this.processSearchFilters(filters) })
        .pipe(map(res => <PaginatedResponse<Reservation>>res));
  }
  getReservationsRange(filters: any): Observable<Reservation[]> {
    return this.http.get(
      'reservation/range/', { params: this.processSearchFilters(filters) }
    ).pipe(map(res => <Reservation[]>res));
  }
  getReservation(id: number): Observable<Reservation> {
    return this.http.get(`reservation/${id}`).pipe(map(res => <Reservation>res));
  }
  createReservation(data: object): Observable<void> {
    return this.http.post('reservation/', data).pipe(map(() => {}));
  }
  updateReservation(id: number, data: object): Observable<void> {
    return this.http.patch(`reservation/${id}`, data).pipe(map(() => {}));
  }
  deleteReservation(id: number): Observable<void> {
    return this.http.delete(`reservation/${id}`).pipe(map(() => {}));
  }

  // Handbook API ==========================================
  getPricingTypesHandbook(): Observable<Handbook[]> {
    return this.http.get('handbook/pricing-types').pipe(map(res => <Handbook[]>res));
  }
  getReservationStatesHandbook(): Observable<Handbook[]> {
    return this.http.get('handbook/reservation-states').pipe(map(res => <Handbook[]>res));
  }

}
