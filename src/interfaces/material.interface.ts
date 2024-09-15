import { Base } from './base.interface';

export interface Material extends Base {
  partName: string;
  images?: string[];
  material: string;
  manufacturingMethod: string;
  drawings?: string[];
  dimensions?: {
    length: string;
    breadth: string;
    height: string;
  };
  weight: string;
  dataSheets?: string[];
  suppliers?: any[];
}
