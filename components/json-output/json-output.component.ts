import { Component, OnInit, Input } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-json-output',
  templateUrl: './json-output.component.html',
  styleUrls: ['./json-output.component.scss']
})
export class JsonOutputComponent implements OnInit {

  @Input() data: object | null = null;

  copied: boolean = false;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void { }

  get formattedJson(): string {
    if (!this.data) {
      return '{}';
    }
    return JSON.stringify(this.data, null, 2);
  }

  handleCopy(): void {
    if (!this.data) {
      return;
    }

    navigator.clipboard.writeText(this.formattedJson).then(() => {
      this.copied = true;
      this.toastService.success('JSON copied to clipboard');

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }).catch(err => {
      this.toastService.error('Failed to copy to clipboard');
      console.error('Copy failed:', err);
    });
  }

  handleDownload(): void {
    if (!this.data) {
      return;
    }

    const blob = new Blob([this.formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.toastService.success('JSON file downloaded');
  }
}
