import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  open(message: string, action = 'Close', config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      ...config
    });
  }

  success(message: string) {
    this.open(message, 'Close', { panelClass: ['success-snackbar'] });
  }

  error(message: string) {
    this.open(message, 'Close', { panelClass: ['error-snackbar'] });
  }

  warning(message: string) {
    this.open(message, 'Close', { panelClass: ['warning-snackbar'] });
  }

  info(message: string) {
    this.open(message, 'Close', { panelClass: ['info-snackbar'] });
  }
}
