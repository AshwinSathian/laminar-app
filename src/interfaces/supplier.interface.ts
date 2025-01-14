import { Base } from './base.interface';
import { Address, Attachment, Contact } from './common.interface';

export interface Supplier extends Base {
  name: string;
  primaryContact: Contact;
  website?: string;
  address?: Address;
  documents?: Attachment[];
}
