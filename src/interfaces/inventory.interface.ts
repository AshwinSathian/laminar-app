import { Base } from './base.interface';
import { Address } from './common.interface';

export interface Inventory extends Base {
  itemId: string;
  description?: string;
  address: Address;
  notes?: string;
}
