import { Base } from './base.interface';
import { Address, Contact, Document } from './common.interface';

export interface Supplier extends Base {
  name: string;
  primaryContact: Contact;
  website?: string;
  address?: Address;
  documents?: Document[];
}
