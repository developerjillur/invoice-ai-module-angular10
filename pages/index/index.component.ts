import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceData, ErrorState, ErrorType, WORKFLOW_STEPS } from '../../models/invoice.model';
import { DocumentAnalysisService, ApiCreditsDepletedError, ApiTimeoutError } from '../../services/document-analysis.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastService } from '../../services/toast.service';
import { EditOrderDialogComponent, EditOrderDialogData } from '../../components/edit-order-dialog/edit-order-dialog.component';

@Component({
  selector: 'app-invoice-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  // Workflow state
  currentStep: number = 1;
  workflowSteps = WORKFLOW_STEPS;

  // File and data
  selectedFile: File | null = null;
  extractedData: InvoiceData | null = null;
  orderNumber: string | null = null;

  // UI state
  isLoading: boolean = false;
  errorState: ErrorState = { type: null };
  activeTab: 'preview' | 'json' = 'preview';

  constructor(
    private dialog: MatDialog,
    private documentAnalysisService: DocumentAnalysisService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void { }

  // File handling
  handleFileSelect(file: File): void {
    this.selectedFile = file;
    this.errorState = { type: null };
    this.currentStep = 2;
    this.isLoading = true;

    this.documentAnalysisService.analyzeDocument(file).subscribe({
      next: (data) => {
        this.extractedData = data;
        this.isLoading = false;
        this.currentStep = 3;
        this.toastService.success('Document analyzed successfully');

        // Save to local storage
        this.localStorageService.saveInvoice(data, file.name);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    });
  }

  private handleError(error: Error): void {
    let errorType: ErrorType = 'general';
    let errorMessage = error.message;

    if (error instanceof ApiCreditsDepletedError) {
      errorType = 'credits';
    } else if (error instanceof ApiTimeoutError) {
      errorType = 'timeout';
    }

    this.errorState = {
      type: errorType,
      message: errorMessage
    };

    this.currentStep = 1;
    this.toastService.error('Failed to analyze document');
  }

  // Order confirmation
  handleConfirmOrder(): void {
    if (!this.extractedData) {
      return;
    }

    this.orderNumber = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);
    this.currentStep = 4;
    this.toastService.success('Order confirmed: ' + this.orderNumber);
  }

  // Cancel and reset
  handleCancel(): void {
    this.resetState();
  }

  handleReset(): void {
    this.resetState();
    this.toastService.info('Ready to process a new invoice');
  }

  private resetState(): void {
    this.currentStep = 1;
    this.selectedFile = null;
    this.extractedData = null;
    this.orderNumber = null;
    this.errorState = { type: null };
    this.activeTab = 'preview';
  }

  // Retry and regenerate
  handleRetry(): void {
    this.errorState = { type: null };
    if (this.selectedFile) {
      this.handleFileSelect(this.selectedFile);
    } else {
      this.currentStep = 1;
    }
  }

  handleRegenerate(): void {
    if (this.selectedFile) {
      this.handleFileSelect(this.selectedFile);
    }
  }

  // Data editing
  handleDataChange(data: InvoiceData): void {
    this.extractedData = data;
  }

  openEditDialog(): void {
    if (!this.extractedData) {
      return;
    }

    const dialogRef = this.dialog.open(EditOrderDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { data: this.extractedData } as EditOrderDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.extractedData = result;
        this.toastService.success('Invoice data updated');
      }
    });
  }

  // Tab switching
  setActiveTab(tab: 'preview' | 'json'): void {
    this.activeTab = tab;
  }
}
