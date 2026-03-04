import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../service/loading-service/loading-service';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoadingService);
 // skip spinner if header present
  const skip = req.headers.has('X-Skip-Spinner');
   if (!skip) {
    loadingService.show();
  }

 

  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};