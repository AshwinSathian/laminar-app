import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from './interceptors/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  menuItems = [
    {
      label: 'Materials',
      route: '/materials',
      icon: 'category',
      isActive: false,
    },
    { label: 'BoMs', route: '/boms', icon: 'receipt_long', isActive: false },
    {
      label: 'Orders',
      route: '/orders',
      icon: 'shopping_cart',
      isActive: false,
    },
    {
      label: 'Inventory',
      route: '/inventory',
      icon: 'inventory',
      isActive: false,
    },
    { label: 'Suppliers', route: '/suppliers', icon: 'store', isActive: false },
  ];

  destroy$ = new Subject<boolean>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._updatedActiveRoute(this.router.url);
      }
    });
  }

  private _updatedActiveRoute(url: string) {
    this.menuItems = this.menuItems.map((m) => ({ ...m, isActive: false }));

    if (url.includes('materials')) {
      this.menuItems[0].isActive = true;
    } else if (url.includes('boms')) {
      this.menuItems[1].isActive = true;
    } else if (url.includes('orders')) {
      this.menuItems[2].isActive = true;
    } else if (url.includes('inventory')) {
      this.menuItems[3].isActive = true;
    } else if (url.includes('suppliers')) {
      this.menuItems[4].isActive = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
