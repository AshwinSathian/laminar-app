import { OrderStatus } from '@laminar-app/enums';
import { Base } from './base.interface';
import { Material } from './material.interface';
import { Supplier } from './supplier.interface';

export interface OrderItem extends Base {
  part: Material;
  quantity: number;
  unitPrice: number;
}

export interface Order extends Base {
  referenceId?: string;
  parts: OrderItem[];
  supplier?: Supplier;
  orderDate: Date;
  status: OrderStatus;
  totalValue: number;
  currency: string;
  invoice?: string;
}
