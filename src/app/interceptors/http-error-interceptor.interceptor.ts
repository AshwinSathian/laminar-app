import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorMessageService } from '@laminar-app/services';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorMessageService: ErrorMessageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorObj = {
          title: error.error?.title || 'Unknown Error',
          details: error.error?.details || 'Something went wrong.',
        };

        this.errorMessageService.showError(errorObj);

        return throwError(() => new Error(errorObj?.details));
      })
    );
  }
}
