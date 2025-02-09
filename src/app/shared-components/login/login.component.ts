import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '@laminar-app/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  email = '';
  password = '';
  error = '';

  destroy$ = new Subject<boolean>();

  constructor(private _authService: AuthService, private _router: Router) {}

  login() {
    this.error = '';
    this._authService
      .login(this.email, this.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this._router.navigate(['/']),
        error: (err) => (this.error = err.error.message || 'Login failed'),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
