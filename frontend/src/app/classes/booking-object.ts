export interface BookingObject {
  id: string;
  title: string;
  object_type: string;
  object_type_display: string;
  pricing_type: string;
  pricing_type_display: string;
  price: number;
}

export interface BookingObjectTreeNode {
  id: string;
  title: string;
  booking_objects: BookingObject[];
}
