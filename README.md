# Invoice AI Module for Angular 10

A complete, production-ready Invoice AI module designed for Angular 10 applications. This module provides AI-powered invoice parsing, data extraction, and order management functionality.

## Compatibility

This module is specifically designed to be compatible with:

```json
{
  "@angular/core": "~10.2.5",
  "@angular/material": "^10.2.7",
  "@angular/cdk": "^10.2.7"
}
```

## Features

- **PDF & Excel Support**: Upload and process invoice documents in PDF, XLSX, and XLS formats
- **AI-Powered Extraction**: Automatic extraction of invoice data including:
  - Invoice number and dates
  - Vendor and customer information
  - Order line items with quantities and prices
  - Totals, taxes, and currency
- **Interactive Review**: Edit extracted data before confirmation
- **JSON Export**: Copy or download data as JSON
- **Local Storage**: Persist processed invoices in browser storage
- **Responsive Design**: Works on desktop and mobile devices
- **Material Design**: Beautiful UI using Angular Material components

## Quick Start

### 1. Copy to Your Project

```bash
cp -r invoice-ai-module-angular10 your-project/src/app/invoice-ai
```

### 2. Add to App Routing

```typescript
// app-routing.module.ts
{
  path: 'invoice-ai',
  loadChildren: () => import('./invoice-ai/invoice-ai.module').then(m => m.InvoiceAiModule)
}
```

### 3. Include Styles

```scss
// styles.scss
@import './app/invoice-ai/styles/invoice-ai.scss';
```

### 4. Add Material Icons (index.html)

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

## File Structure

```
invoice-ai-module-angular10/
├── components/
│   ├── header/                    # App header with navigation
│   ├── upload-zone/               # Drag & drop file upload
│   ├── processing-state/          # Processing animation
│   ├── completion-state/          # Success screen
│   ├── error-state/               # Error handling
│   ├── invoice-preview/           # Invoice data display
│   ├── editable-text/             # Inline text editing
│   ├── edit-order-dialog/         # Full edit modal (4 tabs)
│   ├── step-indicator/            # Workflow progress
│   ├── feature-cards/             # Feature showcase cards
│   └── json-output/               # JSON viewer with export
├── models/
│   └── invoice.model.ts           # All TypeScript interfaces
├── pages/
│   └── index/                     # Main orchestration page
├── services/
│   ├── document-analysis.service.ts    # API/Mock data service
│   ├── export.service.ts               # CSV/PDF export functionality
│   ├── invoice-calculations.service.ts # Financial calculations
│   ├── local-storage.service.ts        # Browser storage
│   └── toast.service.ts                # Snackbar notifications
├── styles/
│   └── invoice-ai.scss            # Global styles
├── invoice-ai.module.ts           # NgModule definition
├── invoice-ai-routing.module.ts   # Routing configuration
├── public-api.ts                  # Public exports
├── README.md                      # This file
└── INTEGRATION.md                 # Detailed integration guide
```

## Components Overview

| Component | Purpose |
|-----------|---------|
| `HeaderComponent` | Navigation header with branding |
| `UploadZoneComponent` | Drag & drop file upload interface |
| `ProcessingStateComponent` | Animated processing indicator |
| `CompletionStateComponent` | Order confirmation success screen |
| `ErrorStateComponent` | Error display with retry option |
| `InvoicePreviewComponent` | Main invoice data display |
| `EditableTextComponent` | Inline editable text fields |
| `EditOrderDialogComponent` | Full modal editor with 4 tabs |
| `StepIndicatorComponent` | Visual workflow progress |
| `FeatureCardsComponent` | Feature showcase cards |
| `JsonOutputComponent` | JSON viewer with copy/download |

## Services Overview

| Service | Purpose |
|---------|---------|
| `DocumentAnalysisService` | API integration and mock data |
| `ExportService` | Export to CSV and PDF formats |
| `InvoiceCalculationsService` | Financial calculations and formatting |
| `LocalStorageService` | Browser localStorage management |
| `ToastService` | Material Snackbar notifications |

### ExportService Usage

```typescript
import { ExportService, InvoiceData } from './invoice-ai/public-api';

export class MyComponent {
  constructor(private exportService: ExportService) {}

  exportToCSV(data: InvoiceData) {
    // Downloads full invoice as CSV
    this.exportService.downloadCSV(data);
  }

  exportOrderLines(data: InvoiceData) {
    // Downloads only order lines as CSV
    this.exportService.downloadOrderLinesCSV(data);
  }

  async exportToPDF(data: InvoiceData) {
    // Downloads invoice as PDF
    await this.exportService.downloadPDF(data);
  }
}
```

## Configuration

### Enable Demo Mode (Default)

```typescript
documentAnalysisService.setConfig({
  useMockData: true
});
```

### Connect to Real API

```typescript
documentAnalysisService.setConfig({
  apiUrl: 'https://your-api.com',
  apiKey: 'your-key',
  useMockData: false
});
```

## Workflow States

1. **Upload** - User selects or drags a file
2. **Processing** - Document is analyzed (with animation)
3. **Review** - User reviews and edits extracted data
4. **Complete** - Order is confirmed with generated number

## TypeScript Interfaces

Key interfaces defined in `models/invoice.model.ts`:

- `InvoiceData` - Main invoice structure
- `OrderLine` - Line item with columns
- `Customer` / `Vendor` - Party information
- `TableColumn` - Dynamic column definition
- `ErrorState` - Error handling state

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

This module uses:

- Angular Material 10.x
- Angular CDK 10.x
- RxJS 6.x

## License

This module is provided for integration with the storeshop project.

---

For detailed integration instructions, see [INTEGRATION.md](./INTEGRATION.md).
