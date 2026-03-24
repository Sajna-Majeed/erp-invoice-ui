import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports';
import { ErpNumberPipe } from '../../../../shared/pipes/erp-number-pipe';
import { QuoteApiService } from '../../../../core/service/api-services/quote/quote';
import { ExcelExportService } from '../../../../core/service/excel-services/excel-services';
import { UserService } from '../../../../core/service/model-services/user/user';
import { MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-quote-print',
  imports: [SHARED_IMPORTS,ErpNumberPipe],
  templateUrl: './quote-print.html',
  styleUrl: './quote-print.css',
})
export class QuotePrintComponent implements OnInit {

  invoice: any;
  qId!: number;
  company:any={};

items: MenuItem[] = [
    { label: 'Excel', icon: 'pi pi-file-excel', command: () => this.exportToExcel() },
    { label: 'PDF', icon: 'pi pi-file-pdf', command: () => this.exportToPDF() },
  ];

  constructor(
    private route: ActivatedRoute,
    private invoiceService: QuoteApiService,
    private userservice:UserService,
    private   excelService: ExcelExportService
  ) { }

  ngOnInit() {
    this.qId = +this.route.snapshot.paramMap.get('id')!;
    this.company=this.userservice.getCompany();
    this.invoiceService.getViewById(this.qId).subscribe((res: any) => {
      this.invoice = res.data;
    });
     
  }
exportToExcel() {
  const wsData: any[][] = [];

  // ===== HEADER =====
  wsData.push(['INVOICE']);
  wsData.push([]);

  // ===== FROM / TO =====
  wsData.push(['From', '', '', 'To']);
  wsData.push([
    this.company.name,
    '',
    '',
    this.invoice.customer?.name
  ]);

  wsData.push([
    this.company.address_Line,
    '',
    '',
    this.invoice.customer?.addressLine1
  ]);

  wsData.push([
    `${this.company.city}, ${this.company.country_Subdivision}`,
    '',
    '',
    `${this.invoice.customer?.city}, ${this.invoice.customer?.country_Subdivision}`
  ]);

  wsData.push([
    `${this.company.country} - ${this.company.zip_Code}`,
    '',
    '',
    `${this.invoice.customer?.country} - ${this.invoice.customer?.zip_code}`
  ]);

  wsData.push([]);

  // ===== META =====
  wsData.push(['Quote No:', this.invoice.quote_No]);
  wsData.push(['Date:', new Date(this.invoice.quote_Date).toLocaleDateString()]);
  wsData.push([]);

  // ===== TABLE HEADER =====
  wsData.push([
    '#',
    'Service Type',
    'Product',
    'Module',
    'Last Bill Rate',
    'License Count',
    'Rate'
  ]);

  // ===== LINE ITEMS =====
  this.invoice.lines.forEach((line: any, index: number) => {
    wsData.push([
      index + 1,
      line.serviceType,
      line.product,
      line.module,
      line.previousRate ?? line.rate,
      line.license_Count,
      line.rate
    ]);
  });

  wsData.push([]);

  // ===== TOTALS =====
  wsData.push(['', '', '', '', '', 'Total', this.invoice.total_Amt]);
  wsData.push(['', '', '', '', '', 'Discount', this.invoice.discount]);
  wsData.push(['', '', '', '', '', 'Net Total', this.invoice.net_Amt]);

  // ===== CREATE SHEET =====
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Optional: column widths
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];

  const workbook = {
    Sheets: { Invoice: worksheet },
    SheetNames: ['Invoice']
  };

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/octet-stream'
  });

  FileSaver.saveAs(blob, `Invoice_${this.invoice.quote_No}.xlsx`);
}
 exportToPDF() {
  const element = document.getElementById('invoice-content');

  if (!element) return;

  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Invoice_${this.invoice.quote_No}.pdf`);
  });
}
}


