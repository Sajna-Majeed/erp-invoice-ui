import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports';
import { ErpNumberPipe } from '../../../../shared/pipes/erp-number-pipe';
import { QuoteApiService } from '../../../../core/service/api-services/quote/quote';
import { CustomerApiService } from '../../../../core/service/api-services/customer/customer';
import { ExcelExportService } from '../../../../core/service/excel-services/excel-services';
@Component({
  selector: 'app-quote-print',
  imports: [SHARED_IMPORTS,ErpNumberPipe],
  templateUrl: './quote-print.html',
  styleUrl: './quote-print.css',
})
export class QuotePrintComponent implements OnInit {

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
    private invoiceService: QuoteApiService,
    private bpService:CustomerApiService,
    private   excelService: ExcelExportService
  ) { }

  ngOnInit() {
    this.invoiceId = +this.route.snapshot.paramMap.get('id')!;
    this.invoiceService.getById(this.invoiceId).subscribe((res: any) => {
      this.invoice = res.data;
      this.bpService.getById(this.invoice.bp_Id).subscribe((res: any) => {
      this.invoice.businessPoint = res.data;
      this.invoice.bp_Name = res.data.name;
      this.invoice.addressLine = `${res.data.addressLine1}, ${res.data.city}, ${res.data.country_Subdivision}, ${res.data.country}`;
    });
    });
     
  }
exportExcel() {
  if (!this.invoice) return;
  this.excelService.exportInvoice(this.invoice);
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