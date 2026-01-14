import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ErrorType } from '../../models/invoice.model';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss']
})
export class ErrorStateComponent implements OnInit {

  @Input() type: ErrorType = 'general';
  @Input() message: string = '';
  @Output() retry = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void { }

  get errorTitle(): string {
    switch (this.type) {
      case 'credits':
        return 'API Credits Depleted';
      case 'timeout':
        return 'Processing Timeout';
      default:
        return 'Something went wrong';
    }
  }

  get errorMessage(): string {
    if (this.message) {
      return this.message;
    }

    switch (this.type) {
      case 'credits':
        return 'Your API credits have been exhausted. Please contact your administrator to add more credits.';
      case 'timeout':
        return 'The document took too long to process. Please try again with a smaller file or contact support.';
      default:
        return 'An unexpected error occurred while processing your document. Please try again.';
    }
  }

  get errorIcon(): string {
    switch (this.type) {
      case 'credits':
        return 'account_balance_wallet';
      case 'timeout':
        return 'timer_off';
      default:
        return 'error_outline';
    }
  }

  onRetry(): void {
    this.retry.emit();
  }
}
