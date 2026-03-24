import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports';
import { QuoteApiService } from '../../../../core/service/api-services/quote/quote';
import { CrudTableComponent } from "../../../../shared/components/crud-table/crud-table";


@Component({
  selector: 'app-quote-list',
  imports: [SHARED_IMPORTS, CrudTableComponent],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './quote-list.html',
  styleUrl: './quote-list.css',
})
export class QuoteListComponent implements OnInit {

  columns: any[] = [];

  quotes: any[] = [];
  loading = false;

  constructor(
    private service: QuoteApiService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.load();
    this.columns = [
      { field: 'rowId', header: '#', type: 'rowId' },
      { field: 'quote_No', header: 'Quote No', type: 'text' },
      { field: 'quote_Date', header: 'Quote_Date', type: 'date' },
      { field: 'customer', header: 'Customer', type: 'text' },
      { field: 'net_Amt', header: 'Net Amt', type: 'number' },
      { field: 'quote_Send', header: 'Quote Send', type: 'status', sortable: false },
      { field: 'contract_Signed', header: 'Contract Signed', type: 'status', sortable: false },
      { field: 'invoiced', header: 'Invoiced', type: 'status', sortable: false },
      { field: 'payment_Received', header: 'Payment Recieved', type: 'status', sortable: false }
    ];
  }
  load() {
    this.service.getAll().subscribe({
      next: (res: any) => {
        this.quotes = res.data;
        this.quotes.forEach((quote: any, index: number) => {
          quote.id = index + 1;
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Operation failed'
        });
      }
    });
  }

  create() {
    this.router.navigate(['/quote/create']);
  }

  edit(row: any) {
    this.router.navigate(['/quote/edit', row.q_Id]);
  }
  view(row: any) {
    this.router.navigate(['/quote/view', row.q_Id]);
  }

  delete(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Quote?',
      header: 'Delete Quote',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.service.delete(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Quote deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to change Quote status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.service.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Quote status updated'
          });

        });

      }
    });
  }


}

