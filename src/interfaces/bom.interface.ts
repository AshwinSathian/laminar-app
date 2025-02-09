import { Base } from './base.interface';
import { Attachment } from './common.interface';

export interface BillOfMaterials extends Base {
  productName: string;
  contactInfo: string;
  approvedBy: string;
  dateOfApproval: Date;
  partCount: number;
  totalCost: number;
  parts: PartDetail[];
  currency: string;
}

export interface PartDetail extends Base {
  partNumber: string;
  name: string;
  description?: string;
  images?: Attachment[];
  material: string;
  manufacturingMethod: string;
  quantity: number;
  nonLinrary?: boolean;
  supplierOrManufacturer?: { id: string; name: string };
  unitCost: number;
  totalPartCost: number;
}
