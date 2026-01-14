import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvoiceData, DOCUMENT_TYPE_LABELS } from '../../models/invoice.model';
import { InvoiceCalculationsService } from '../../services/invoice-calculations.service';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {

  @Input() data: InvoiceData | null = null;
  @Input() editable: boolean = true;
  @Output() dataChange = new EventEmitter<InvoiceData>();
  @Output() openEditDialog = new EventEmitter<void>();

  documentTypeLabels = DOCUMENT_TYPE_LABELS;

  constructor(private calculationsService: InvoiceCalculationsService) { }

  ngOnInit(): void { }

  get calculatedSubtotal(): number {
    return this.calculationsService.getCalculatedSubtotal(this.data);
  }

  get calculatedTotal(): number {
    return this.calculationsService.getCalculatedTotal(this.data);
  }

  get documentTypeLabel(): string {
    if (!this.data?.documentType) {
      return 'Document';
    }
    return this.documentTypeLabels[this.data.documentType] || this.data.documentType;
  }

  formatCurrency(amount: number | undefined | null): string {
    return this.calculationsService.formatCurrency(amount, this.data?.currency || 'NOK');
  }

  formatValue(value: string | number | undefined | null, type: string): string {
    return this.calculationsService.formatValue(value, type, this.data?.currency || 'NOK');
  }

  isColumnNumberType(columnKey: string): boolean {
    return this.calculationsService.isColumnNumberType(columnKey);
  }

  updateField(path: string, value: string): void {
    if (!this.data || !this.editable) {
      return;
    }

    const updatedData = { ...this.data };
    const keys = path.split('.');
    let current: any = updatedData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    const parsedValue = this.parseValue(value, lastKey);
    current[lastKey] = parsedValue;

    this.dataChange.emit(updatedData);
  }

  updateOrderLineColumn(lineIndex: number, columnKey: string, value: string): void {
    if (!this.data || !this.editable) {
      return;
    }

    const updatedData = { ...this.data };
    const orderLines = [...updatedData.orderLines];
    const line = { ...orderLines[lineIndex] };
    const columns = { ...line.columns };

    const parsedValue = this.isColumnNumberType(columnKey)
      ? this.calculationsService.parseNumericValue(value)
      : value;

    columns[columnKey] = {
      raw: value,
      value: parsedValue
    };

    line.columns = columns;
    orderLines[lineIndex] = line;
    updatedData.orderLines = orderLines;

    this.dataChange.emit(updatedData);
  }

  private parseValue(value: string, key: string): any {
    const numericKeys = ['subtotal', 'taxAmount', 'totalAmount', 'quantity', 'unitPrice'];
    if (numericKeys.includes(key)) {
      return this.calculationsService.parseNumericValue(value);
    }
    return value;
  }

  onEditClick(): void {
    this.openEditDialog.emit();
  }
}
