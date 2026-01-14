import { Injectable } from '@angular/core';
import { InvoiceData, OrderLine } from '../models/invoice.model';

// Keyword mappings for column identification
const TOTAL_COLUMN_KEYWORDS = ['total', 'beloep', 'beløp', 'sum', 'amount', 'pris'];
const QUANTITY_COLUMN_KEYWORDS = ['antall', 'quantity', 'qty', 'mengde', 'number'];
const PRICE_COLUMN_KEYWORDS = ['pris', 'price', 'enhetspris', 'unit', 'unitprice'];

@Injectable({
  providedIn: 'root'
})
export class InvoiceCalculationsService {

  constructor() {}

  /**
   * Parse a string or number value to a numeric value
   */
  parseNumericValue(value: string | number | undefined | null): number {
    if (value === undefined || value === null) {
      return 0;
    }

    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value;
    }

    // Remove all non-numeric characters except . and ,
    const cleanedValue = String(value).replace(/[^\d.,\-]/g, '');

    // Handle European number format (comma as decimal separator)
    const normalizedValue = cleanedValue.replace(',', '.');

    const parsed = parseFloat(normalizedValue);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Check if a key matches any of the provided keywords
   */
  matchesKeywords(key: string, keywords: string[]): boolean {
    const lowerKey = key.toLowerCase();
    return keywords.some(keyword => lowerKey.includes(keyword));
  }

  /**
   * Find a column value in an order line by keywords
   */
  findColumnValue(line: OrderLine, keywords: string[]): number {
    if (!line.columns) {
      return 0;
    }

    for (const [key, columnValue] of Object.entries(line.columns)) {
      if (this.matchesKeywords(key, keywords)) {
        return this.parseNumericValue(columnValue.value);
      }
    }

    return 0;
  }

  /**
   * Calculate line total from columns
   */
  calculateLineTotalFromColumns(line: OrderLine): number {
    // First try to find a total/amount column
    const total = this.findColumnValue(line, TOTAL_COLUMN_KEYWORDS);
    if (total > 0) {
      return total;
    }

    // Fall back to quantity * unit price
    const quantity = this.findColumnValue(line, QUANTITY_COLUMN_KEYWORDS);
    const unitPrice = this.findColumnValue(line, PRICE_COLUMN_KEYWORDS);

    if (quantity > 0 && unitPrice > 0) {
      return quantity * unitPrice;
    }

    return 0;
  }

  /**
   * Calculate subtotal from order lines
   */
  calculateSubtotalFromLines(orderLines: OrderLine[]): number {
    if (!orderLines || orderLines.length === 0) {
      return 0;
    }

    return orderLines.reduce((sum, line) => {
      // First check if line has direct totalAmount
      if (line.totalAmount !== undefined && line.totalAmount !== null) {
        return sum + this.parseNumericValue(line.totalAmount);
      }

      // Try to calculate from columns
      const columnTotal = this.calculateLineTotalFromColumns(line);
      if (columnTotal > 0) {
        return sum + columnTotal;
      }

      // Final fallback: quantity * unitPrice from direct properties
      if (line.quantity !== undefined && line.unitPrice !== undefined) {
        return sum + (line.quantity * line.unitPrice);
      }

      return sum;
    }, 0);
  }

  /**
   * Get calculated subtotal from invoice data
   */
  getCalculatedSubtotal(data: InvoiceData | null): number {
    if (!data) {
      return 0;
    }

    // Return subtotal if available
    if (data.subtotal !== undefined && data.subtotal !== null && data.subtotal > 0) {
      return data.subtotal;
    }

    // Calculate from order lines
    return this.calculateSubtotalFromLines(data.orderLines);
  }

  /**
   * Get calculated total from invoice data
   */
  getCalculatedTotal(data: InvoiceData | null): number {
    if (!data) {
      return 0;
    }

    // Return totalAmount if available
    if (data.totalAmount !== undefined && data.totalAmount !== null && data.totalAmount > 0) {
      return data.totalAmount;
    }

    // Calculate: subtotal + tax
    const subtotal = this.getCalculatedSubtotal(data);
    const tax = this.parseNumericValue(data.taxAmount);

    return subtotal + tax;
  }

  /**
   * Format currency value
   */
  formatCurrency(amount: number | undefined | null, currency: string = 'NOK'): string {
    if (amount === undefined || amount === null) {
      return '-';
    }

    try {
      return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      // Fallback for unsupported currencies
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  /**
   * Format value based on type
   */
  formatValue(value: string | number | undefined | null, type: string, currency: string = 'NOK'): string {
    if (value === undefined || value === null || value === '') {
      return '-';
    }

    switch (type) {
      case 'currency':
        const numValue = this.parseNumericValue(value);
        return this.formatCurrency(numValue, currency);

      case 'percentage':
        const percentValue = this.parseNumericValue(value);
        return `${percentValue.toFixed(1)}%`;

      case 'number':
        const num = this.parseNumericValue(value);
        return new Intl.NumberFormat('nb-NO').format(num);

      default:
        return String(value);
    }
  }

  /**
   * Check if column key represents a number type
   */
  isColumnNumberType(columnKey: string): boolean {
    const numberKeywords = [
      ...TOTAL_COLUMN_KEYWORDS,
      ...QUANTITY_COLUMN_KEYWORDS,
      ...PRICE_COLUMN_KEYWORDS,
      'number', 'line', 'nr', 'no'
    ];
    return this.matchesKeywords(columnKey, numberKeywords);
  }
}
