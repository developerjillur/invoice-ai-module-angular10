import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, timeout, delay } from 'rxjs/operators';
import { InvoiceData, AnalyzeDocumentResponse } from '../models/invoice.model';

// Custom error classes
export class ApiCreditsDepletedError extends Error {
  constructor(message: string = 'API credits have been depleted') {
    super(message);
    this.name = 'ApiCreditsDepletedError';
  }
}

export class ApiTimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'ApiTimeoutError';
  }
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Configuration interface
export interface InvoiceAiConfig {
  apiUrl: string;
  apiKey: string;
  useMockData: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentAnalysisService {
  private readonly API_TIMEOUT_MS = 180000; // 3 minutes

  // Default configuration - can be overridden via setConfig
  private config: InvoiceAiConfig = {
    apiUrl: '',
    apiKey: '',
    useMockData: true
  };

  constructor(private http: HttpClient) {}

  /**
   * Configure the service with API settings
   */
  setConfig(config: Partial<InvoiceAiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): InvoiceAiConfig {
    return { ...this.config };
  }

  /**
   * Analyze a document file and extract invoice data
   */
  analyzeDocument(file: File): Observable<InvoiceData> {
    if (this.config.useMockData) {
      return this.generateMockData(file);
    }

    return new Observable<InvoiceData>(observer => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Content = (reader.result as string).split(',')[1];

        const requestBody = {
          fileContent: base64Content,
          fileName: file.name,
          fileType: file.type,
          pdfBase64: file.type === 'application/pdf' ? base64Content : undefined
        };

        const headers = this.buildHeaders();
        const url = `${this.config.apiUrl}/functions/v1/analyze-invoice`;

        this.http.post<AnalyzeDocumentResponse>(url, requestBody, { headers })
          .pipe(
            timeout(this.API_TIMEOUT_MS),
            map(response => {
              if (!response.success) {
                throw new ApiError(response.error || 'Failed to analyze document');
              }
              return response.data;
            }),
            catchError(error => {
              if (error.name === 'TimeoutError') {
                return throwError(new ApiTimeoutError('Document processing timed out'));
              }
              if (error.status === 402) {
                return throwError(new ApiCreditsDepletedError());
              }
              return throwError(new ApiError(error.message || 'An error occurred', error.status));
            })
          )
          .subscribe({
            next: data => {
              observer.next(data);
              observer.complete();
            },
            error: err => observer.error(err)
          });
      };

      reader.onerror = () => {
        observer.error(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Async/await version of analyzeDocument
   */
  async analyzeDocumentAsync(file: File): Promise<InvoiceData> {
    return this.analyzeDocument(file).toPromise();
  }

  /**
   * Generate mock data for testing/demo purposes
   */
  generateMockData(file: File): Observable<InvoiceData> {
    const mockDelay = 2000 + Math.random() * 1500; // 2-3.5 seconds

    const mockData: InvoiceData = {
      documentType: 'invoice',
      invoiceNumber: 'INV-' + Math.floor(Math.random() * 90000 + 10000),
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pagesProcessed: 1,
      totalOrderLines: 4,
      customer: {
        name: 'Acme Corporation',
        address: '123 Business Street, Oslo 0150',
        email: 'orders@acme.no',
        phone: '+47 22 33 44 55',
        taxId: 'NO123456789MVA'
      },
      vendor: {
        name: 'Sample Supplier AS',
        vendorNumber: 'VS-001',
        address: '456 Supplier Road, Bergen 5003',
        email: 'sales@supplier.no',
        phone: '+47 55 66 77 88',
        taxId: 'NO987654321MVA'
      },
      deliveryAddress: '123 Business Street, Oslo 0150',
      purchaser: 'John Smith',
      paymentTerms: 'Net 30 days',
      tableColumns: [
        { key: 'lineNumber', header: '#', type: 'number', align: 'right' },
        { key: 'description', header: 'Description', type: 'text', align: 'left' },
        { key: 'quantity', header: 'Qty', type: 'number', align: 'right' },
        { key: 'unit', header: 'Unit', type: 'text', align: 'left' },
        { key: 'unitPrice', header: 'Unit Price', type: 'currency', align: 'right' },
        { key: 'totalAmount', header: 'Total', type: 'currency', align: 'right' }
      ],
      orderLines: [
        {
          columns: {
            lineNumber: { raw: '1', value: 1 },
            description: { raw: 'Office Chair - Ergonomic', value: 'Office Chair - Ergonomic' },
            quantity: { raw: '5', value: 5 },
            unit: { raw: 'pcs', value: 'pcs' },
            unitPrice: { raw: '2500.00', value: 2500 },
            totalAmount: { raw: '12500.00', value: 12500 }
          },
          lineNumber: 1,
          description: 'Office Chair - Ergonomic',
          quantity: 5,
          unit: 'pcs',
          unitPrice: 2500,
          totalAmount: 12500
        },
        {
          columns: {
            lineNumber: { raw: '2', value: 2 },
            description: { raw: 'Standing Desk - Electric', value: 'Standing Desk - Electric' },
            quantity: { raw: '3', value: 3 },
            unit: { raw: 'pcs', value: 'pcs' },
            unitPrice: { raw: '8500.00', value: 8500 },
            totalAmount: { raw: '25500.00', value: 25500 }
          },
          lineNumber: 2,
          description: 'Standing Desk - Electric',
          quantity: 3,
          unit: 'pcs',
          unitPrice: 8500,
          totalAmount: 25500
        },
        {
          columns: {
            lineNumber: { raw: '3', value: 3 },
            description: { raw: 'Monitor Arm - Dual', value: 'Monitor Arm - Dual' },
            quantity: { raw: '5', value: 5 },
            unit: { raw: 'pcs', value: 'pcs' },
            unitPrice: { raw: '1200.00', value: 1200 },
            totalAmount: { raw: '6000.00', value: 6000 }
          },
          lineNumber: 3,
          description: 'Monitor Arm - Dual',
          quantity: 5,
          unit: 'pcs',
          unitPrice: 1200,
          totalAmount: 6000
        },
        {
          columns: {
            lineNumber: { raw: '4', value: 4 },
            description: { raw: 'Cable Management Kit', value: 'Cable Management Kit' },
            quantity: { raw: '8', value: 8 },
            unit: { raw: 'sets', value: 'sets' },
            unitPrice: { raw: '350.00', value: 350 },
            totalAmount: { raw: '2800.00', value: 2800 }
          },
          lineNumber: 4,
          description: 'Cable Management Kit',
          quantity: 8,
          unit: 'sets',
          unitPrice: 350,
          totalAmount: 2800
        }
      ],
      subtotal: 46800,
      taxAmount: 11700,
      totalAmount: 58500,
      currency: 'NOK',
      notes: 'Delivered from file: ' + file.name
    };

    return of(mockData).pipe(delay(mockDelay));
  }

  /**
   * Build HTTP headers for API requests
   */
  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.config.apiKey) {
      headers = headers.set('Authorization', `Bearer ${this.config.apiKey}`);
      headers = headers.set('apikey', this.config.apiKey);
    }

    return headers;
  }
}
