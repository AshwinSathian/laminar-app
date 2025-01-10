import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-header',
    imports: [MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input({ required: true }) title = '';
  @Input() subTitle = '';
  @Input() icon = '';
}
