import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared-imports';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-crud-table',
  imports: [CommonModule, SHARED_IMPORTS],
  templateUrl: './crud-table.html',
  styleUrl: './crud-table.css',
})
export class CrudTableComponent {
  items: MenuItem[] = [
    { label: 'Excel', icon: 'pi pi-file-excel', command: () => this.exportExcel() },
    { label: 'PDF', icon: 'pi pi-file-pdf', command: () => this.exportPdf() },
  ];


  @Input() data: any[] = [];
  @Input() fileName: string = '';
  @Input() columns: any[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() toggle = new EventEmitter<any>();

 
exportExcel() {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Company Header
  worksheet.addRow(['ERP Management System']);
  worksheet.addRow(['Report: ' + this.fileName]);
  worksheet.addRow(['Generated: ' + new Date().toLocaleString()]);
  worksheet.addRow([]);

  const headerRow = worksheet.addRow(this.columns.map(c => c.header));

  // Style header
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  headerRow.eachCell(cell => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Data rows
  this.data.forEach(row => {

    const values = this.columns.map(col => {

      if (col.type === 'status')
        return row[col.field] ? 'Active' : 'Inactive';

      return row[col.field];

    });

    const newRow = worksheet.addRow(values);

    newRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

  });

  // Auto column width
  worksheet.columns.forEach(column => {
    column.width = 20;
  });

  workbook.xlsx.writeBuffer().then(buffer => {

    const blob = new Blob(
      [buffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    saveAs(blob, `${this.fileName}.xlsx`);

  });

}
 exportPdf() {

  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text('ERP Management System', 14, 15);

  doc.setFontSize(12);
  doc.text(`Report: ${this.fileName}`, 14, 22);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  const headers = [this.columns.map(c => c.header)];

  const rows = this.data.map(row =>
    this.columns.map(col => {

      if (col.type === 'status')
        return row[col.field] ? 'Active' : 'Inactive';

      return row[col.field];

    })
  );

  autoTable(doc, {
    startY: 35,
    head: headers,
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185]
    }
  });

  doc.save(`${this.fileName}.pdf`);

}
}