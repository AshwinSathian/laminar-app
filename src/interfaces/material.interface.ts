import { Base } from './base.interface';
import { Attachment } from './common.interface';

export interface Material extends Base {
  partName: string;
  images?: Attachment[];
  material: string;
  manufacturingMethod: string;
  drawings?: Attachment[];
  dimensions?: {
    length: string;
    breadth: string;
    height: string;
  };
  weight: string;
  dataSheets?: Attachment[];
  suppliers?: any[];
}
