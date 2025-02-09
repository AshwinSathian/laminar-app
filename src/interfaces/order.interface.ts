import { OrderStatus } from '@laminar-app/enums';
import { Base } from './base.interface';
import { Attachment } from './common.interface';

export interface OrderItem extends Base {
  name: string;
  images?: Attachment[];
  material: string;
  manufacturingMethod: string;
  quantity: number;
  unitPrice: number;
  nonLinrary?: boolean;
}

export interface Order extends Base {
  referenceId?: string;
  parts: OrderItem[];
  supplier?: { id: string; name: string };
  orderDate: Date;
  estimatedDeliveryDate?: Date;
  status: OrderStatus;
  totalValue: number;
  currency: string;
  invoice?: string;
  otherAttachments?: Attachment[];
}
