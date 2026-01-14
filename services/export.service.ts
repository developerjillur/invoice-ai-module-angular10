import { Injectable } from '@angular/core';
import { InvoiceData, OrderLine, TableColumn } from '../models/invoice.model';

/**
 * Export Service - Angular 10 Compatible
 * Provides functionality for exporting invoice data to CSV and PDF formats.
 */
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() {}

  // ============= CSV Export =============

  /**
   * Converts invoice data to CSV format
   */
  invoiceToCSV(data: InvoiceData): string {
    const lines: string[] = [];

    // Header Information
    lines.push('Document Information');
    lines.push(`Document Type,${this.escapeCSV(data.documentType || 'invoice')}`);
    lines.push(`Document Number,${this.escapeCSV(data.invoiceNumber)}`);
    lines.push(`Date,${this.escapeCSV(data.invoiceDate)}`);
    if (data.dueDate) {
      lines.push(`Due Date,${this.escapeCSV(data.dueDate)}`);
    }
    if (data.purchaser) {
      lines.push(`Purchaser,${this.escapeCSV(data.purchaser)}`);
    }
    lines.push('');

    // Customer Information
    lines.push('Customer Information');
    lines.push(`Name,${this.escapeCSV(data.customer.name)}`);
    if (data.customer.address) {
      lines.push(`Address,${this.escapeCSV(data.customer.address.replace(/\n/g, ', '))}`);
    }
    if (data.customer.email) {
      lines.push(`Email,${this.escapeCSV(data.customer.email)}`);
    }
    if (data.customer.phone) {
      lines.push(`Phone,${this.escapeCSV(data.customer.phone)}`);
    }
    if (data.customer.taxId) {
      lines.push(`Tax ID,${this.escapeCSV(data.customer.taxId)}`);
    }
    lines.push('');

    // Vendor Information
    lines.push('Vendor Information');
    lines.push(`Name,${this.escapeCSV(data.vendor.name)}`);
    if (data.vendor.address) {
      lines.push(`Address,${this.escapeCSV(data.vendor.address.replace(/\n/g, ', '))}`);
    }
    if (data.vendor.email) {
      lines.push(`Email,${this.escapeCSV(data.vendor.email)}`);
    }
    if (data.vendor.phone) {
      lines.push(`Phone,${this.escapeCSV(data.vendor.phone)}`);
    }
    if (data.vendor.taxId) {
      lines.push(`Tax ID,${this.escapeCSV(data.vendor.taxId)}`);
    }
    if (data.vendor.vendorNumber) {
      lines.push(`Vendor Number,${this.escapeCSV(data.vendor.vendorNumber)}`);
    }
    lines.push('');

    // Delivery Address
    if (data.deliveryAddress) {
      lines.push('Delivery Address');
      lines.push(`Address,${this.escapeCSV(data.deliveryAddress.replace(/\n/g, ', '))}`);
      lines.push('');
    }

    // Order Lines
    lines.push('Order Lines');

    // Determine columns
    const hasDynamicColumns = data.tableColumns && data.tableColumns.length > 0;
    const usesColumnsStructure = data.orderLines.length > 0 && !!data.orderLines[0]?.columns;

    if (hasDynamicColumns && usesColumnsStructure && data.tableColumns) {
      // Dynamic columns header
      const headers = data.tableColumns.map((col: TableColumn) => this.escapeCSV(col.header));
      lines.push(headers.join(','));

      // Dynamic columns data
      data.orderLines.forEach((line: OrderLine) => {
        const values = data.tableColumns!.map((col: TableColumn) => {
          const cellData = line.columns?.[col.key];
          const value = cellData?.value ?? cellData?.raw ?? '';
          return this.escapeCSV(String(value));
        });
        lines.push(values.join(','));
      });
    } else {
      // Standard columns
      lines.push('Line Number,Description,Quantity,Unit,Unit Price,Total Amount');
      data.orderLines.forEach((line: OrderLine) => {
        const row = [
          this.escapeCSV(String(line.lineNumber ?? '')),
          this.escapeCSV(line.description ?? line.productName?.value ?? ''),
          this.escapeCSV(String(line.quantity ?? '')),
          this.escapeCSV(line.unit ?? ''),
          this.escapeCSV(String(line.unitPrice ?? '')),
          this.escapeCSV(String(line.totalAmount ?? ''))
        ];
        lines.push(row.join(','));
      });
    }
    lines.push('');

    // Totals
    lines.push('Totals');
    lines.push(`Subtotal,${data.subtotal}`);
    if (data.taxAmount !== null && data.taxAmount !== undefined) {
      lines.push(`Tax Amount,${data.taxAmount}`);
    }
    lines.push(`Total Amount,${data.totalAmount}`);
    lines.push(`Currency,${this.escapeCSV(data.currency)}`);

    // Notes
    if (data.notes) {
      lines.push('');
      lines.push('Notes');
      lines.push(this.escapeCSV(data.notes));
    }

    return lines.join('\n');
  }

  /**
   * Exports only the order lines as CSV (for import into other systems)
   */
  orderLinesToCSV(data: InvoiceData): string {
    const lines: string[] = [];

    const hasDynamicColumns = data.tableColumns && data.tableColumns.length > 0;
    const usesColumnsStructure = data.orderLines.length > 0 && !!data.orderLines[0]?.columns;

    if (hasDynamicColumns && usesColumnsStructure && data.tableColumns) {
      // Dynamic columns header
      const headers = data.tableColumns.map((col: TableColumn) => this.escapeCSV(col.header));
      lines.push(headers.join(','));

      // Dynamic columns data
      data.orderLines.forEach((line: OrderLine) => {
        const values = data.tableColumns!.map((col: TableColumn) => {
          const cellData = line.columns?.[col.key];
          const value = cellData?.value ?? cellData?.raw ?? '';
          return this.escapeCSV(String(value));
        });
        lines.push(values.join(','));
      });
    } else {
      // Standard columns
      lines.push('Line Number,Product Name,EAN,Description,Quantity,Unit,Unit Price,Total Amount');
      data.orderLines.forEach((line: OrderLine) => {
        const row = [
          this.escapeCSV(String(line.lineNumber ?? '')),
          this.escapeCSV(line.productName?.value ?? ''),
          this.escapeCSV(line.ean?.value ?? ''),
          this.escapeCSV(line.description ?? ''),
          this.escapeCSV(String(line.quantity ?? '')),
          this.escapeCSV(line.unit ?? ''),
          this.escapeCSV(String(line.unitPrice ?? '')),
          this.escapeCSV(String(line.totalAmount ?? ''))
        ];
        lines.push(row.join(','));
      });
    }

    return lines.join('\n');
  }

  /**
   * Escape CSV special characters
   */
  private escapeCSV(value: string | null | undefined): string {
    if (value === null || value === undefined) { return ''; }
    const stringValue = String(value);
    // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  /**
   * Download a file with the given content
   */
  downloadFile(content: string | Blob, filename: string, mimeType: string): void {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Download invoice data as CSV
   */
  downloadCSV(data: InvoiceData, filename?: string): void {
    const csv = this.invoiceToCSV(data);
    const defaultFilename = `invoice-${data.invoiceNumber || 'export'}-${this.formatDateForFilename(new Date())}.csv`;
    this.downloadFile(csv, filename || defaultFilename, 'text/csv;charset=utf-8;');
  }

  /**
   * Download order lines as CSV
   */
  downloadOrderLinesCSV(data: InvoiceData, filename?: string): void {
    const csv = this.orderLinesToCSV(data);
    const defaultFilename = `order-lines-${data.invoiceNumber || 'export'}-${this.formatDateForFilename(new Date())}.csv`;
    this.downloadFile(csv, filename || defaultFilename, 'text/csv;charset=utf-8;');
  }

  // ============= PDF Export =============

  /**
   * Generate PDF from invoice data
   * Uses jsPDF library for PDF generation
   */
  async generatePDF(data: InvoiceData): Promise<void> {
    // Dynamically import jsPDF
    const { default: jsPDF } = await import('jspdf');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;

    // Helper functions
    const addText = (text: string, x: number, y: number, options?: {
      fontSize?: number;
      fontStyle?: 'normal' | 'bold';
      color?: [number, number, number]
    }) => {
      const { fontSize = 10, fontStyle = 'normal', color = [0, 0, 0] } = options || {};
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text, x, y);
      return y + (fontSize * 0.4);
    };

    const addLine = (y: number) => {
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      return y + 5;
    };

    const checkPageBreak = (requiredSpace: number) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (yPos + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    // Title
    yPos = addText('INVOICE / ORDER', margin, yPos, { fontSize: 20, fontStyle: 'bold', color: [51, 51, 51] });
    yPos += 5;

    // Document Info Box
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
    yPos += 5;

    addText(`Document #: ${data.invoiceNumber}`, margin + 5, yPos, { fontStyle: 'bold' });
    addText(`Date: ${data.invoiceDate}`, pageWidth / 2, yPos);
    yPos += 5;

    if (data.dueDate) {
      addText(`Due Date: ${data.dueDate}`, margin + 5, yPos);
    }
    addText(`Currency: ${data.currency}`, pageWidth / 2, yPos);
    yPos += 5;

    if (data.purchaser) {
      addText(`Purchaser: ${data.purchaser}`, margin + 5, yPos);
    }
    yPos += 15;

    // Customer and Vendor Info (side by side)
    const colWidth = (pageWidth - 3 * margin) / 2;

    // Customer
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, colWidth, 8, 'F');
    addText('CUSTOMER', margin + 3, yPos + 5.5, { fontSize: 9, fontStyle: 'bold' });
    yPos += 12;

    const customerStartY = yPos;
    yPos = addText(data.customer.name, margin, yPos, { fontStyle: 'bold' });
    yPos += 2;
    if (data.customer.address) {
      const addressLines = data.customer.address.split('\n');
      addressLines.forEach((line: string) => {
        yPos = addText(line, margin, yPos, { fontSize: 9 });
        yPos += 1;
      });
    }
    if (data.customer.email) {
      yPos = addText(data.customer.email, margin, yPos, { fontSize: 9 });
      yPos += 1;
    }
    if (data.customer.phone) {
      yPos = addText(data.customer.phone, margin, yPos, { fontSize: 9 });
      yPos += 1;
    }
    if (data.customer.taxId) {
      yPos = addText(`Tax ID: ${data.customer.taxId}`, margin, yPos, { fontSize: 9 });
    }

    // Vendor (same row)
    let vendorY = customerStartY - 12;
    const vendorX = margin + colWidth + margin;
    doc.setFillColor(240, 240, 240);
    doc.rect(vendorX, vendorY, colWidth, 8, 'F');
    addText('VENDOR', vendorX + 3, vendorY + 5.5, { fontSize: 9, fontStyle: 'bold' });
    vendorY += 12;

    vendorY = addText(data.vendor.name, vendorX, vendorY, { fontStyle: 'bold' });
    vendorY += 2;
    if (data.vendor.address) {
      const addressLines = data.vendor.address.split('\n');
      addressLines.forEach((line: string) => {
        vendorY = addText(line, vendorX, vendorY, { fontSize: 9 });
        vendorY += 1;
      });
    }
    if (data.vendor.email) {
      vendorY = addText(data.vendor.email, vendorX, vendorY, { fontSize: 9 });
      vendorY += 1;
    }
    if (data.vendor.vendorNumber) {
      vendorY = addText(`Vendor #: ${data.vendor.vendorNumber}`, vendorX, vendorY, { fontSize: 9 });
    }

    yPos = Math.max(yPos, vendorY) + 10;

    // Delivery Address
    if (data.deliveryAddress) {
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
      addText('DELIVERY ADDRESS', margin + 3, yPos + 5.5, { fontSize: 9, fontStyle: 'bold' });
      yPos += 12;
      const deliveryLines = data.deliveryAddress.split('\n');
      deliveryLines.forEach((line: string) => {
        yPos = addText(line, margin, yPos, { fontSize: 9 });
        yPos += 1;
      });
      yPos += 5;
    }

    // Order Lines Section
    yPos = addLine(yPos);
    yPos = addText('ORDER LINES', margin, yPos, { fontSize: 12, fontStyle: 'bold' });
    yPos += 5;

    // Table Header
    const tableStartX = margin;
    const hasDynamicColumns = data.tableColumns && data.tableColumns.length > 0;
    const usesColumnsStructure = data.orderLines.length > 0 && !!data.orderLines[0]?.columns;

    doc.setFillColor(51, 51, 51);
    doc.rect(tableStartX, yPos, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');

    if (hasDynamicColumns && usesColumnsStructure && data.tableColumns) {
      // Dynamic columns
      const colCount = data.tableColumns.length;
      const availableWidth = pageWidth - 2 * margin;
      const colWidthDyn = availableWidth / colCount;

      data.tableColumns.forEach((col: TableColumn, idx: number) => {
        const truncatedHeader = col.header.length > 15 ? col.header.substring(0, 12) + '...' : col.header;
        doc.text(truncatedHeader, tableStartX + idx * colWidthDyn + 2, yPos + 5.5);
      });
      yPos += 10;

      // Table Body
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      data.orderLines.forEach((line: OrderLine, rowIdx: number) => {
        checkPageBreak(8);

        if (rowIdx % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(tableStartX, yPos, pageWidth - 2 * margin, 7, 'F');
        }

        data.tableColumns!.forEach((col: TableColumn, colIdx: number) => {
          const cellData = line.columns?.[col.key];
          let value = String(cellData?.value ?? cellData?.raw ?? '-');
          if (value.length > 20) { value = value.substring(0, 17) + '...'; }
          doc.setFontSize(8);
          doc.text(value, tableStartX + colIdx * colWidthDyn + 2, yPos + 5);
        });
        yPos += 7;
      });
    } else {
      // Standard columns
      const standardCols = ['#', 'Description', 'Qty', 'Unit', 'Price', 'Total'];
      const standardWidths = [15, 70, 20, 20, 30, 30];
      let xOffset = tableStartX;

      standardCols.forEach((header, idx) => {
        doc.text(header, xOffset + 2, yPos + 5.5);
        xOffset += standardWidths[idx];
      });
      yPos += 10;

      // Table Body
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      data.orderLines.forEach((line: OrderLine, rowIdx: number) => {
        checkPageBreak(8);

        if (rowIdx % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(tableStartX, yPos, pageWidth - 2 * margin, 7, 'F');
        }

        xOffset = tableStartX;
        const values = [
          String(line.lineNumber ?? rowIdx + 1),
          ((line.description ?? line.productName?.value ?? '') as string).substring(0, 40),
          String(line.quantity ?? '-'),
          line.unit ?? '-',
          this.formatNumber(line.unitPrice),
          this.formatNumber(line.totalAmount)
        ];

        values.forEach((val, idx) => {
          doc.setFontSize(8);
          doc.text(val, xOffset + 2, yPos + 5);
          xOffset += standardWidths[idx];
        });
        yPos += 7;
      });
    }

    yPos += 5;

    // Totals
    checkPageBreak(30);
    yPos = addLine(yPos);

    const totalsX = pageWidth - margin - 80;
    doc.setFillColor(245, 245, 245);
    doc.rect(totalsX, yPos, 80, 30, 'F');

    yPos += 6;
    addText('Subtotal:', totalsX + 5, yPos, { fontSize: 9 });
    addText(this.formatCurrency(data.subtotal, data.currency), totalsX + 55, yPos, { fontSize: 9 });
    yPos += 6;

    if (data.taxAmount !== null && data.taxAmount !== undefined) {
      addText('Tax:', totalsX + 5, yPos, { fontSize: 9 });
      addText(this.formatCurrency(data.taxAmount, data.currency), totalsX + 55, yPos, { fontSize: 9 });
      yPos += 6;
    }

    doc.setDrawColor(100, 100, 100);
    doc.line(totalsX + 5, yPos, totalsX + 75, yPos);
    yPos += 6;

    addText('TOTAL:', totalsX + 5, yPos, { fontSize: 11, fontStyle: 'bold' });
    addText(this.formatCurrency(data.totalAmount, data.currency), totalsX + 50, yPos, { fontSize: 11, fontStyle: 'bold', color: [0, 100, 0] });

    // Notes
    if (data.notes) {
      yPos += 15;
      checkPageBreak(20);
      yPos = addText('Notes:', margin, yPos, { fontStyle: 'bold' });
      yPos += 3;
      const noteLines = doc.splitTextToSize(data.notes, pageWidth - 2 * margin);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      noteLines.forEach((line: string) => {
        doc.text(line, margin, yPos);
        yPos += 4;
      });
    }

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString()} by Invoice AI`, margin, pageHeight - 10);

    // Save
    const filename = `invoice-${data.invoiceNumber || 'export'}-${this.formatDateForFilename(new Date())}.pdf`;
    doc.save(filename);
  }

  /**
   * Download invoice as PDF
   */
  async downloadPDF(data: InvoiceData): Promise<void> {
    await this.generatePDF(data);
  }

  // ============= Helper Functions =============

  private formatDateForFilename(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) { return '-'; }
    return value.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private formatCurrency(amount: number, currency: string): string {
    return `${amount.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  }
}
