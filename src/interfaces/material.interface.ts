import { Base } from './base.interface';
import { Attachment } from './common.interface';

export interface Material extends Base {
  partName: string;
  images?: Attachment[];
  material: string;
  manufacturingMethod: string;
  drawings?: Attachment[];
  dimensions?: {
    length: { value: number; unit: string };
    breadth: { value: number; unit: string };
    height: { value: number; unit: string };
  };
  weight?: { value: number; unit: string };
  dataSheets?: Attachment[];
  suppliers?: any[];
}
