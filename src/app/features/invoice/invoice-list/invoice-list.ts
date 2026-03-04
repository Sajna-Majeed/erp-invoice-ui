import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { InvoiceApiService } from '../../../core/service/api-services/invoice/invoice';

@Component({
  selector: 'app-invoice-list',
  imports: [SHARED_IMPORTS,],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
})
export class InvoiceListComponent implements OnInit {

  displayedColumns = [
    'invoiceNumber',
    'partner',
    'invoiceDate',
    'dueDate',
    'total',
    'status',
    'actions'
  ];

  data: any[] = [];
  loading = false;

  constructor(
    private service: InvoiceApiService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.service.getAll().subscribe({
      next: (res: any) => {
        this.data = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load invoices', 'Close', { duration: 3000 });
      }
    });
  }

  create() {
    this.router.navigate(['/invoice/create']);
  }

  edit(row: any) {
    this.router.navigate(['/invoice/edit', row.invoice_Id]);
  }
 view(row: any) {
    this.router.navigate(['/invoice/view', row.invoice_Id]);
  }

  

  delete(id: number) {

  // this.confirm.open({
  //   title: 'Delete Invoice',
  //   message: 'Are you sure you want to delete this invoice?',
  //   confirmText: 'Yes, Delete',
  //   cancelText: 'Cancel',
  //   color: 'warn'
  // }).subscribe(result => {

  //   if (result) {
  //      this.service.delete(id).subscribe(() => {
  //         this.snackBar.open('Invoice deleted', 'Close', { duration: 3000 });
  //         this.load();
  //       });
  //     }

  // });
}
}