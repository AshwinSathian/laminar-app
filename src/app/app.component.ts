import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
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
import { HttpErrorComponent } from './interceptors/components/http-error/http-error.component';
import { LoadingComponent } from './interceptors/components/loading/loading.component';
import { ErrorMessageService } from './services';
import { BreakpointService } from './services/breakpoint.service';

@Component({
  selector: 'app-root',
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
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private _bottomSheet = inject(MatBottomSheet);

  menuItems = [
    {
      label: 'Dashboard',
      route: '/',
      icon: 'dashboard',
      isActive: false,
    },
    {
      label: 'Materials',
      route: '/materials',
      icon: 'category',
      isActive: false,
    },
    { label: 'Suppliers', route: '/suppliers', icon: 'store', isActive: false },
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
  ];
  isMobile$ = this._breakpointService.isMobile$;

  destroy$ = new Subject<boolean>();

  constructor(
    private _router: Router,
    private _errorMessageService: ErrorMessageService,
    private _breakpointService: BreakpointService
  ) {}

  ngOnInit(): void {
    this._router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._updatedActiveRoute(this._router.url);
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
      this.menuItems[1].isActive = true;
    } else if (url.includes('/bill-of-materials')) {
      this.menuItems[3].isActive = true;
    } else if (url.includes('/orders')) {
      this.menuItems[4].isActive = true;
    } else if (url.includes('/inventory')) {
      this.menuItems[5].isActive = true;
    } else if (url.includes('/suppliers')) {
      this.menuItems[2].isActive = true;
    } else {
      this.menuItems[0].isActive = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
