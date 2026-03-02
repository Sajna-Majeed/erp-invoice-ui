import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog';

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  constructor(private dialog: MatDialog) {}

  open(data: ConfirmDialogData): Observable<boolean> {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '250px',
       width: '400px',
      disableClose: true,
      data,
      panelClass: 'confirm-dialog'
    });

    return dialogRef.afterClosed();
  }
}