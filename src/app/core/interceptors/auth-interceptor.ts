import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
const router = inject(Router);
  if (token) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(newReq);
  }
return next(req).pipe(
    catchError((error) => {

      // Auto logout on 401
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
