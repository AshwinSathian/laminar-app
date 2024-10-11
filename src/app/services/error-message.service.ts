import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  private errorDetailsSubject = new Subject<{
    title: string;
    details: string;
  }>();
  errorDetails$ = this.errorDetailsSubject.asObservable(); // Observable to subscribe in the component

  showError(details: { title: string; details: string }): void {
    this.errorDetailsSubject.next(details); // Emit the error details
  }

  clearError(): void {
    this.errorDetailsSubject.next({ title: '', details: '' }); // Clear the error details
  }
}
