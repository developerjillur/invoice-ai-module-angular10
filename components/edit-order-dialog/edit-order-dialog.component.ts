import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceData } from '../../models/invoice.model';
import { InvoiceCalculationsService } from '../../services/invoice-calculations.service';

interface Tab {
  id: string;
  label: string;
}

export interface EditOrderDialogData {
  data: InvoiceData;
}

@Component({
  selector: 'app-edit-order-dialog',
  templateUrl: './edit-order-dialog.component.html',
  styleUrls: ['./edit-order-dialog.component.scss']
})
export class EditOrderDialogComponent implements OnInit {

  tabs: Tab[] = [
    { id: 'general', label: 'General' },
    { id: 'parties', label: 'Parties' },
    { id: 'lines', label: 'Order Lines' },
    { id: 'totals', label: 'Totals' }
  ];

  activeTab: string = 'general';
  formData: InvoiceData;

  constructor(
    public dialogRef: MatDialogRef<EditOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: EditOrderDialogData,
    private calculationsService: InvoiceCalculationsService
  ) {
    // Deep clone the data to avoid modifying original
    this.formData = JSON.parse(JSON.stringify(dialogData.data));
  }

  ngOnInit(): void { }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  updateField(path: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const keys = path.split('.');
    let current: any = this.formData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = this.parseFieldValue(value, lastKey);
  }

  updateOrderLine(lineIndex: number, columnKey: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (!this.formData.orderLines[lineIndex].columns) {
      this.formData.orderLines[lineIndex].columns = {};
    }

    const parsedValue = this.calculationsService.isColumnNumberType(columnKey)
      ? this.calculationsService.parseNumericValue(value)
      : value;

    this.formData.orderLines[lineIndex].columns[columnKey] = {
      raw: value,
      value: parsedValue
    };
  }

  private parseFieldValue(value: string, key: string): any {
    const numericKeys = ['subtotal', 'taxAmount', 'totalAmount', 'quantity', 'unitPrice', 'pagesProcessed', 'totalOrderLines'];
    if (numericKeys.includes(key)) {
      return this.calculationsService.parseNumericValue(value);
    }
    return value;
  }

  getFieldValue(path: string): any {
    const keys = path.split('.');
    let current: any = this.formData;

    for (const key of keys) {
      if (current === undefined || current === null) {
        return '';
      }
      current = current[key];
    }

    return current !== undefined && current !== null ? current : '';
  }

  onSave(): void {
    this.dialogRef.close(this.formData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
