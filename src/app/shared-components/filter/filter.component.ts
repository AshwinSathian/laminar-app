import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-filter',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  showSidebar = false;

  openSidebar() {
    this.showSidebar = true;
  }
}
