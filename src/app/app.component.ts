import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { HttpErrorComponent } from './interceptors/components/http-error/http-error.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ErrorMessageService } from './services/error-message.service';

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
    HttpErrorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private _bottomSheet = inject(MatBottomSheet);

  menuItems = [
    {
      label: 'Materials',
      route: '/materials',
      icon: 'category',
      isActive: false,
    },
    {
      label: 'Bill Of Materials',
      route: '/bill-of-materials',
      icon: 'receipt_long',
      isActive: false,
    },
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

  constructor(
    private router: Router,
    private _errorMessageService: ErrorMessageService
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._updatedActiveRoute(this.router.url);
      }
    });

    this._errorMessageService.errorDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this._bottomSheet.open(HttpErrorComponent, {
            data: error,
          });
        }
      });
  }

  private _updatedActiveRoute(url: string) {
    this.menuItems = this.menuItems.map((m) => ({ ...m, isActive: false }));

    if (url.includes('/materials')) {
      this.menuItems[0].isActive = true;
    } else if (url.includes('/bill-of-materials')) {
      this.menuItems[1].isActive = true;
    } else if (url.includes('/orders')) {
      this.menuItems[2].isActive = true;
    } else if (url.includes('/inventory')) {
      this.menuItems[3].isActive = true;
    } else if (url.includes('/suppliers')) {
      this.menuItems[4].isActive = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
