/**
 * Invoice AI Models - Angular 10 Compatible
 * These interfaces define the data structures used throughout the Invoice AI module.
 */

// Table column definition for dynamic order line display
export interface TableColumn {
  key: string;
  header: string;
  type: 'text' | 'number' | 'currency' | 'percentage';
  align: 'left' | 'right';
}

// Column value with raw and parsed representations
export interface ColumnValue {
  raw: string;
  value: string | number;
}

// Order line item
export interface OrderLine {
  columns: { [key: string]: ColumnValue };
  productName?: { raw: string; value: string };
  ean?: { raw: string | null; value: string | null };
  lineNumber?: number;
  description?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  totalAmount?: number;
  // Additional Norwegian document fields (convenience accessors)
  itemNumber?: string;           // Nr. / Varenr. / Artikkelnr.
  brand?: string;                // Vareser. Beskr. / Merke
  vendorItemNumber?: string;     // Leverandørs varenummer
  discountPercent?: number;      // Rabatt -%
}

// Base party interface
export interface Party {
  name: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  taxId?: string | null;
}

// Vendor information
export interface Vendor extends Party {
  vendorNumber?: string | null;
}

// Customer information
export interface Customer extends Party {}

// Main invoice data structure
export interface InvoiceData {
  documentType?: 'order' | 'invoice' | 'quote' | string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string | null;
  pagesProcessed?: number;
  sheetsProcessed?: number;
  totalOrderLines?: number;
  customer: Customer;
  vendor: Vendor;
  deliveryAddress?: string | null;
  purchaser?: string | null;
  paymentTerms?: string | null;
  tableColumns?: TableColumn[];
  orderLines: OrderLine[];
  subtotal: number;
  taxAmount?: number | null;
  totalAmount: number;
  currency: string;
  notes?: string | null;
}

// API request structure
export interface AnalyzeDocumentRequest {
  fileContent: string;
  fileName: string;
  fileType: string;
  pdfBase64?: string;
}

// API response structure
export interface AnalyzeDocumentResponse {
  success: boolean;
  data: InvoiceData;
  error?: string;
}

// Error types
export type ErrorType = 'credits' | 'timeout' | 'general' | null;

export interface ErrorState {
  type: ErrorType;
  message?: string;
}

// Workflow step definition
export interface WorkflowStep {
  label: string;
}

// Workflow steps constant
export const WORKFLOW_STEPS: WorkflowStep[] = [
  { label: 'Upload' },
  { label: 'Processing' },
  { label: 'Review' },
  { label: 'Complete' }
];

// Document type labels (Norwegian)
export const DOCUMENT_TYPE_LABELS: { [key: string]: string } = {
  order: 'Bestilling',
  invoice: 'Faktura',
  quote: 'Tilbud'
};

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  pdf: ['application/pdf'],
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
};

export const SUPPORTED_EXTENSIONS = ['.pdf', '.xlsx', '.xls'];
export const ACCEPTED_FILE_TYPES = '.pdf,.xlsx,.xls';

// File type utility functions
export function isExcelFile(file: File): boolean {
  return SUPPORTED_FILE_TYPES.excel.includes(file.type) ||
    file.name.toLowerCase().endsWith('.xlsx') ||
    file.name.toLowerCase().endsWith('.xls');
}

export function isPdfFile(file: File): boolean {
  return SUPPORTED_FILE_TYPES.pdf.includes(file.type) ||
    file.name.toLowerCase().endsWith('.pdf');
}

export function isSupportedFile(file: File): boolean {
  return isExcelFile(file) || isPdfFile(file);
}

// Processing step interface
export interface ProcessingStep {
  text: string;
  completed: boolean;
  current: boolean;
}

// Feature card interface
export interface Feature {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

// Stored invoice for local storage
export interface StoredInvoice {
  id: string;
  data: InvoiceData;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}
