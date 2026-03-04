import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared-imports';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ErpCurrencyPipe } from "../../pipes/erp-currency-pipe";
import { ErpNumberPipe } from "../../pipes/erp-number-pipe";
import { UserService } from '../../../core/service/model-services/user/user';


@Component({
  selector: 'app-crud-table',
  imports: [CommonModule, SHARED_IMPORTS, ErpCurrencyPipe, ErpNumberPipe],
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


  userService = inject(UserService);
  company: any = this.userService.getCompany()?.company;
  currency = this.company?.currency ?? '₹';
  decimals = this.company?.decimalplace ?? 0;

  formatNumber = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals
    }).format(value);





  exportExcel() {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const currencyFormat = `"${this.currency}"#,##0.${'0'.repeat(this.decimals)}`;
    const numberFormat = `#,##0.${'0'.repeat(this.decimals)}`;
    // Header
    worksheet.addRow(['ERP Management System']);
    worksheet.addRow([`Report: ${this.fileName}`]);
    worksheet.addRow([`Generated: ${new Date().toLocaleString()}`]);
    worksheet.addRow([]);

    const headerRow = worksheet.addRow(this.columns.map(c => c.header));

    headerRow.font = { bold: true };

    headerRow.eachCell(cell => {
      cell.alignment = { horizontal: 'center' };
    });

    this.data.forEach(row => {

      const values = this.columns.map(col => row[col.field]);
      const newRow = worksheet.addRow(values);

      this.columns.forEach((col, index) => {

        const cell = newRow.getCell(index + 1);

        if (col.type === 'currency') {

          cell.numFmt = currencyFormat;
          cell.alignment = { horizontal: 'right' };

        }

        if (col.type === 'number') {

          cell.numFmt = numberFormat;
          cell.alignment = { horizontal: 'right' };

        }

        if (col.type === 'tax') {

          cell.numFmt = `${numberFormat}\\%`;
          cell.alignment = { horizontal: 'right' };

        }

        if (col.type === 'text') {

          cell.alignment = { horizontal: 'left' };

        }

        if (col.type === 'status') {

          cell.value = row[col.field] ? 'Active' : 'Inactive';
          cell.alignment = { horizontal: 'center' };

        }

      });

    });

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
        if (col.type === 'tax') {
          const value = Number(row[col.field] ?? 0);
          return `${value.toFixed(this.decimals)}%`;
        }

        if (col.type === 'currency') {
          const value = Number(row[col.field] ?? 0);
          return `${this.currency}${this.formatNumber(value)}`;
        }

        if (col.type === 'number') {
          const value = Number(row[col.field] ?? 0);
          return this.formatNumber(value);
        }

        return row[col.field];

      })
    );

    autoTable(doc, {
      startY: 35,
      head: headers,
      body: rows,
      theme: 'grid',

      columnStyles: this.columns.reduce((styles: any, col: any, index: number) => {

        if (col.type === 'currency' || col.type === 'number') {
          styles[index] = { halign: 'right' };
        }

        if (col.type === 'status') {
          styles[index] = { halign: 'center' };
        }

        return styles;

      }, {})
    });

    doc.save(`${this.fileName}.pdf`);

  }
}