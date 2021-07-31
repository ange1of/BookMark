import { BookingObject } from './booking-object';
import { Client } from './client';

export interface Reservation {
  id: number;
  state: string;
  state_display: string;
  start: Date;
  end: Date;
  client: Client;
  booking_object: BookingObject;
  price: number;
  comments?: string;
  created: Date;
  updated: Date;
}
