import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { InvoiceApiService } from '../../../core/service/api-services/invoice/invoice';


@Component({
  selector: 'app-invoice-list',
  imports: [SHARED_IMPORTS, MatPaginator],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
})

export class InvoiceList implements OnInit {

  private api = inject(InvoiceApiService);
  private snack = inject(MatSnackBar);

  displayedColumns: string[] = [
    'invoice_No',
    'invoice_Date',
    'net_Amt',
    'total_W_Tax',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.api.getAll().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data ?? res;
        this.dataSource.paginator = this.paginator;
      },
      error: () => {
        this.snack.open('Failed to load invoices', 'OK', { duration: 3000 });
      }
    });
  }

  delete(id: number) {

    if (!confirm('Are you sure you want to delete this invoice?'))
      return;

    this.api.delete(id).subscribe({
      next: () => {
        this.snack.open('Invoice deleted', 'OK', { duration: 2000 });
        this.loadInvoices();
      },
      error: () => {
        this.snack.open('Delete failed', 'OK', { duration: 3000 });
      }
    });
  }
}