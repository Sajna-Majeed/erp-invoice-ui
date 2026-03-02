import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceApiService } from '../../../core/service/api-services/invoice/invoice';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { DatePipe } from '@angular/common';
import { BussinessPointApiService } from '../../../core/service/api-services/bp/bussiness-point';
@Component({
  selector: 'app-invoice-print',
  imports: [SHARED_IMPORTS, DatePipe],
  templateUrl: './invoice-print.html',
  styleUrl: './invoice-print.css',
})
export class InvoicePrintComponent implements OnInit {

  invoice: any;
  invoiceId!: number;
  company = {
    name: 'Your Company LLC',
    address: 'Dubai, UAE',
    phone: '+971-500000000',
    email: 'info@company.com'
  };

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceApiService,
    private bpService:BussinessPointApiService
  ) { }

  ngOnInit() {
    this.invoiceId = +this.route.snapshot.paramMap.get('id')!;
    this.invoiceService.getById(this.invoiceId).subscribe((res: any) => {
      this.invoice = res.data;
debugger
      this.bpService.getById(this.invoice.bp_Id).subscribe((res: any) => {
      this.invoice.businessPoint = res.data;
    });
    });
     
  }

  print() {
    const content = document.getElementById('invoice-content')?.innerHTML;

    const printWindow = window.open('', '', 'width=900,height=650');

    printWindow?.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          table, th, td { border: 1px solid #ddd; padding: 8px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);

    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  }
}