import { OrderStatus } from '@laminar-app/enums';

export interface FiltersPayload {
  status?: {
    [OrderStatus.placed]?: boolean | string;
    [OrderStatus.dispatched]?: boolean | string;
    [OrderStatus.delivered]?: boolean | string;
  };
  value?: {
    min?: number;
    max?: number;
  };
  date?: {
    min?: Date;
    max?: Date;
  };
}
