import { Material } from './material.interface';
import { Supplier } from './supplier.interface';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface OrgPersona {
  id: string;
  name: string;
}

export interface Meta {
  createdBy: UserPersona;
  updatedBy: UserPersona;
  createdDate: Date;
  updatedDate: Date;
  orgInfo: OrgPersona;
}

export interface Phone {
  code: string;
  number: string;
}

export interface Contact {
  name: string;
  email: string;
  designation?: string;
  phone?: Phone;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  stateProvinceCounty: string;
  country: string;
  postalZipCode: string;
  mapsLink?: string;
}

export interface Attachment {
  name: string;
  type: string;
  url: string;
}

export interface PartsDialogData {
  materials: Material[];
  supplier?: Supplier;
  selectedPartIds: string[];
}
