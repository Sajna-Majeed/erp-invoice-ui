import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {

  async exportInvoice(invoice: any) {

const invoiceDate = new Date(invoice.invoice_Date);
const dueDate = new Date(invoice.due_Date);


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoice');

    /* ================= HEADER ================= */

    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'INVOICE';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.addRow([]);

    let row=worksheet.addRow(['Invoice No:', invoice.invoice_No]);
    row.getCell(1).font = { bold: true };
    row.getCell(2).alignment = { horizontal: 'left' };
    const dateRow=worksheet.addRow(['Invoice Date:', invoiceDate]);
    dateRow.getCell(2).numFmt = 'dd/mm/yyyy';
    dateRow.getCell(1).font = { bold: true };
    dateRow.getCell(2).alignment = { horizontal: 'left' };
    const dueDateRow=worksheet.addRow(['Due Date:', dueDate]);
    dueDateRow.getCell(2).numFmt = 'dd/mm/yyyy';
    dueDateRow.getCell(1).font = { bold: true };
    dueDateRow.getCell(2).alignment = { horizontal: 'left' };
    row=worksheet.addRow(['Business Partner:', invoice.bp_Name]);
    row.getCell(1).font = { bold: true };
    row.getCell(2).alignment = { horizontal: 'left' };
    row=worksheet.addRow(['Address:', invoice.addressLine]);
    row.getCell(1).font = { bold: true };
    row.getCell(2).alignment = { horizontal: 'left' };
    worksheet.addRow([]);
    worksheet.addRow([]);

    /* ================= TABLE HEADER ================= */

    const headerRow = worksheet.addRow([
      'Sl No',
      'Product',
      'Qty',
      'Unit Price',
      'Tax %',
      'Net',
      'Tax',
      'Total'
    ]);

    headerRow.font = { bold: true };

    /* ================= LINE ITEMS ================= */

    invoice.lines.forEach((line: any, index: number) => {

      worksheet.addRow([
        index + 1,
        line.item_Name?.name || line.item_Name,
        line.item_Price_Base_Qty,
        line.item_Net_Price,
        line.item_Tax_Rate,
        line.net_Amt,
        line.vat_In_Aed,
        line.amt_In_Aed
      ]);
    });

    worksheet.addRow([]);
    worksheet.addRow([]);

    /* ================= TOTALS ================= */

    worksheet.addRow(['', '', '', '', '', 'Net:', invoice.net_Amt]);
    worksheet.addRow(['', '', '', '', '', 'Tax:', invoice.total_Tax_Amt]);
    worksheet.addRow(['', '', '', '', '', 'Total:', invoice.total_W_Tax]);

    /* ================= AUTO WIDTH ================= */

    worksheet.columns.forEach(column => {
      column.width = 18;
    });

worksheet.getColumn(3).numFmt = '0.00';      // Qty
worksheet.getColumn(4).numFmt = '"AED" #,##0.00';
worksheet.getColumn(5).numFmt = '0.00';      // Tax %
worksheet.getColumn(6).numFmt = '"AED" #,##0.00';
worksheet.getColumn(7).numFmt = '"AED" #,##0.00';
worksheet.getColumn(8).numFmt = '"AED" #,##0.00';

worksheet.getColumn(3).alignment = { horizontal: 'right' };
worksheet.getColumn(4).alignment = { horizontal: 'right' };
worksheet.getColumn(5).alignment = { horizontal: 'right' };
worksheet.getColumn(6).alignment = { horizontal: 'right' };
worksheet.getColumn(7).alignment = { horizontal: 'right' };
worksheet.getColumn(8).alignment = { horizontal: 'right' };
    /* ================= DOWNLOAD ================= */

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, `Invoice-${invoice.invoice_No}.xlsx`);
  }
}