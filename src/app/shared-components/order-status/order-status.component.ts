import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderStatus } from '@laminar-app/enums';

@Component({
  selector: 'app-order-status',
  imports: [CommonModule, MatIconModule],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusComponent implements OnChanges {
  @Input() currentStatus!: OrderStatus;

  statusSteps = [
    {
      label: 'Placed',
      icon: 'check_circle',
      value: OrderStatus.placed,
    },
    {
      label: 'Dispatched',
      icon: 'local_shipping',
      value: OrderStatus.dispatched,
    },
    {
      label: 'Delivered',
      icon: 'task_alt',
      value: OrderStatus.delivered,
    },
  ];
  currentStepIndex = 0;
  OrderStatus = OrderStatus;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['currentStatus']?.currentValue) {
      switch (this.currentStatus) {
        case OrderStatus.placed:
          this.currentStepIndex = 0;
          break;
        case OrderStatus.dispatched:
          this.currentStepIndex = 1;
          break;
        case OrderStatus.delivered:
          this.currentStepIndex = 2;
          break;
      }
    }
  }
}
