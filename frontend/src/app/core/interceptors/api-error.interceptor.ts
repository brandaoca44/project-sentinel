import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        typeof error.error?.message === 'string'
          ? error.error.message
          : Array.isArray(error.error?.message)
            ? error.error.message.join(', ')
            : 'Unexpected API error';

      return throwError(() => new Error(message));
    }),
  );
};
