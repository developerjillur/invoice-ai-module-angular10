import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditableTextComponent implements OnInit {

  @Input() value: string | number | null | undefined = '';
  @Input() placeholder: string = 'Enter value';
  @Input() className: string = '';
  @Input() inputClassName: string = '';
  @Input() type: string = 'text';
  @Output() save = new EventEmitter<string>();

  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

  isEditing: boolean = false;
  editValue: string = '';

  constructor() { }

  ngOnInit(): void { }

  startEditing(): void {
    this.editValue = this.value !== null && this.value !== undefined ? String(this.value) : '';
    this.isEditing = true;

    // Focus and select after view updates
    setTimeout(() => {
      if (this.inputField) {
        this.inputField.nativeElement.focus();
        this.inputField.nativeElement.select();
      }
    }, 0);
  }

  saveValue(): void {
    this.isEditing = false;
    if (this.editValue !== String(this.value || '')) {
      this.save.emit(this.editValue);
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editValue = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveValue();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEditing();
    }
  }

  get displayValue(): string {
    if (this.value === null || this.value === undefined || this.value === '') {
      return this.placeholder;
    }
    return String(this.value);
  }

  get isPlaceholder(): boolean {
    return this.value === null || this.value === undefined || this.value === '';
  }
}
