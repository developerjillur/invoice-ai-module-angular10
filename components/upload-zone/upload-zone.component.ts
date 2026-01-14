import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { isSupportedFile, ACCEPTED_FILE_TYPES } from '../../models/invoice.model';

@Component({
  selector: 'app-upload-zone',
  templateUrl: './upload-zone.component.html',
  styleUrls: ['./upload-zone.component.scss']
})
export class UploadZoneComponent implements OnInit {

  @Input() disabled: boolean = false;
  @Output() fileSelect = new EventEmitter<File>();

  isDragging: boolean = false;
  acceptedTypes = ACCEPTED_FILE_TYPES;

  constructor() { }

  ngOnInit(): void { }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging = true;
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.disabled) {
      return;
    }

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
      input.value = ''; // Reset input for re-upload of same file
    }
  }

  private handleFile(file: File): void {
    if (isSupportedFile(file)) {
      this.fileSelect.emit(file);
    } else {
      console.warn('Unsupported file type:', file.type);
    }
  }
}
