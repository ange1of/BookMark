export interface Client {
  id: string;
  phone: string;
  name: string;
  email?: string;
  additional_info?: string;
  created: Date;
  updated: Date;
}
