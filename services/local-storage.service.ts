import { Injectable } from '@angular/core';
import { InvoiceData, StoredInvoice } from '../models/invoice.model';

const STORAGE_KEY = 'invoice-ai-data';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  /**
   * Generate a unique invoice ID
   */
  private generateId(): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all stored invoices from localStorage
   */
  private getStoredData(): StoredInvoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  }

  /**
   * Save data to localStorage
   */
  private setStoredData(data: StoredInvoice[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  }

  /**
   * Save a new invoice to storage
   */
  saveInvoice(data: InvoiceData, fileName: string): StoredInvoice {
    const now = new Date().toISOString();
    const invoice: StoredInvoice = {
      id: this.generateId(),
      data: data,
      fileName: fileName,
      createdAt: now,
      updatedAt: now
    };

    const storedData = this.getStoredData();
    storedData.push(invoice);
    this.setStoredData(storedData);

    return invoice;
  }

  /**
   * Update an existing invoice
   */
  updateInvoice(id: string, data: InvoiceData): StoredInvoice | null {
    const storedData = this.getStoredData();
    const index = storedData.findIndex(inv => inv.id === id);

    if (index === -1) {
      return null;
    }

    storedData[index].data = data;
    storedData[index].updatedAt = new Date().toISOString();

    this.setStoredData(storedData);
    return storedData[index];
  }

  /**
   * Get all stored invoices
   */
  getAllInvoices(): StoredInvoice[] {
    return this.getStoredData();
  }

  /**
   * Get a single invoice by ID
   */
  getInvoice(id: string): StoredInvoice | null {
    const storedData = this.getStoredData();
    return storedData.find(inv => inv.id === id) || null;
  }

  /**
   * Delete an invoice by ID
   */
  deleteInvoice(id: string): boolean {
    const storedData = this.getStoredData();
    const filteredData = storedData.filter(inv => inv.id !== id);

    if (filteredData.length === storedData.length) {
      return false; // No invoice was removed
    }

    return this.setStoredData(filteredData);
  }

  /**
   * Clear all stored invoices
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get storage information
   */
  getStorageInfo(): { count: number; sizeKB: number } {
    const data = localStorage.getItem(STORAGE_KEY) || '';
    return {
      count: this.getStoredData().length,
      sizeKB: Math.round((data.length * 2) / 1024) // Approximate size in KB
    };
  }

  /**
   * Export all invoices as JSON string
   */
  exportToJson(): string {
    const data = this.getStoredData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import invoices from JSON string
   */
  importFromJson(json: string): { success: number; failed: number } {
    let result = { success: 0, failed: 0 };

    try {
      const importedData: StoredInvoice[] = JSON.parse(json);
      const existingData = this.getStoredData();
      const existingIds = new Set(existingData.map(inv => inv.id));

      for (const invoice of importedData) {
        if (existingIds.has(invoice.id)) {
          result.failed++;
          continue; // Skip duplicates
        }

        // Validate required fields
        if (invoice.id && invoice.data && invoice.fileName) {
          existingData.push({
            ...invoice,
            createdAt: invoice.createdAt || new Date().toISOString(),
            updatedAt: invoice.updatedAt || new Date().toISOString()
          });
          result.success++;
        } else {
          result.failed++;
        }
      }

      this.setStoredData(existingData);
    } catch (e) {
      console.error('Error importing JSON:', e);
      result.failed++;
    }

    return result;
  }
}
