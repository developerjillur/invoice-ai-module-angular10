# Invoice AI Module - Integration Guide for Angular 10 (storeshop)

This guide explains how to integrate the Invoice AI module into your existing Angular 10 "storeshop" project.

## Prerequisites

Your project should have the following dependencies (based on your package.json):

```json
{
  "@angular/animations": "~10.2.5",
  "@angular/cdk": "^10.2.7",
  "@angular/common": "~10.2.5",
  "@angular/compiler": "~10.2.5",
  "@angular/core": "~10.2.5",
  "@angular/forms": "~10.2.5",
  "@angular/material": "^10.2.7",
  "@angular/platform-browser": "~10.2.5",
  "@angular/platform-browser-dynamic": "~10.2.5",
  "@angular/router": "~10.2.5"
}
```

## Installation Steps

### Step 1: Copy Module Files

Copy the entire `invoice-ai-module-angular10` folder into your project's `src/app/` directory:

```
src/
  app/
    invoice-ai/                  <-- Rename folder to this
      components/
      models/
      pages/
      services/
      styles/
      invoice-ai.module.ts
      invoice-ai-routing.module.ts
      public-api.ts
      INTEGRATION.md
```

### Step 2: Install Required Dependencies

If not already installed, add these to your package.json:

```bash
npm install @angular/material@^10.2.7 @angular/cdk@^10.2.7 --save
```

### Step 3: Add Angular Material Theme

In your `angular.json`, add the Material theme to styles:

```json
{
  "styles": [
    "node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
    "src/styles.scss"
  ]
}
```

### Step 4: Include Invoice AI Styles

Add the Invoice AI styles to your main `styles.scss`:

```scss
// In src/styles.scss
@import './app/invoice-ai/styles/invoice-ai.scss';
```

### Step 5: Configure App Routing

Add a route to the Invoice AI module in your `app-routing.module.ts`:

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // Your existing routes...

  // Add Invoice AI route (lazy loaded)
  {
    path: 'invoice-ai',
    loadChildren: () => import('./invoice-ai/invoice-ai.module').then(m => m.InvoiceAiModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Step 6: Add Navigation Link (Optional)

Add a link to Invoice AI in your navigation:

```html
<a routerLink="/invoice-ai">Invoice AI</a>
```

## Configuration

### API Configuration

To connect to a real API backend, configure the DocumentAnalysisService in your app:

```typescript
// In your app.component.ts or a configuration service
import { DocumentAnalysisService } from './invoice-ai/services/document-analysis.service';

constructor(private documentAnalysisService: DocumentAnalysisService) {
  // Configure API settings
  this.documentAnalysisService.setConfig({
    apiUrl: 'https://your-api-endpoint.com',
    apiKey: 'your-api-key',
    useMockData: false  // Set to true for demo mode
  });
}
```

### Demo Mode

By default, the module runs in demo mode (useMockData: true), which generates realistic mock data for testing without requiring an API connection.

## Module Structure

```
invoice-ai/
├── components/
│   ├── header/                 # Navigation header
│   ├── upload-zone/            # File upload with drag & drop
│   ├── processing-state/       # Processing animation
│   ├── completion-state/       # Success confirmation
│   ├── error-state/            # Error handling
│   ├── invoice-preview/        # Main invoice display
│   ├── editable-text/          # Inline text editing
│   ├── edit-order-dialog/      # Full edit modal
│   ├── step-indicator/         # Workflow progress
│   ├── feature-cards/          # Feature showcase
│   └── json-output/            # JSON export view
├── models/
│   └── invoice.model.ts        # TypeScript interfaces
├── pages/
│   └── index/                  # Main page component
├── services/
│   ├── document-analysis.service.ts    # API integration
│   ├── invoice-calculations.service.ts # Financial calculations
│   ├── local-storage.service.ts        # Browser storage
│   └── toast.service.ts                # Notifications
├── styles/
│   └── invoice-ai.scss         # Global styles
├── invoice-ai.module.ts        # Main module
├── invoice-ai-routing.module.ts # Routing configuration
└── public-api.ts               # Public exports
```

## Features

1. **Document Upload**: Drag & drop or click to upload PDF/Excel files
2. **AI Processing**: Automatic extraction of invoice data
3. **Data Review**: View and edit extracted information
4. **JSON Export**: Copy or download data as JSON
5. **Order Confirmation**: Generate order numbers
6. **Local Storage**: Persist processed invoices

## Customization

### Styling

Override component styles by targeting the component classes in your global styles:

```scss
// Override upload zone colors
.upload-zone {
  border-color: #your-brand-color;

  &:hover {
    border-color: #your-hover-color;
  }
}
```

### Extending Services

Extend services for custom behavior:

```typescript
import { Injectable } from '@angular/core';
import { DocumentAnalysisService } from './invoice-ai/services/document-analysis.service';

@Injectable()
export class CustomDocumentService extends DocumentAnalysisService {
  // Add custom methods or override existing ones
}
```

## Troubleshooting

### Common Issues

1. **Material icons not showing**: Add Material Icons to index.html:
   ```html
   <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
   ```

2. **Module not found errors**: Ensure all import paths are correct and relative to your project structure.

3. **Styles not applying**: Verify the styles import in angular.json or styles.scss.

## API Endpoint Specification

If connecting to a real backend, your API should accept:

**POST** `/functions/v1/analyze-invoice`

**Request:**
```json
{
  "fileContent": "base64-encoded-file",
  "fileName": "invoice.pdf",
  "fileType": "application/pdf",
  "pdfBase64": "base64-for-pdf-files"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-12345",
    "invoiceDate": "2024-01-15",
    "customer": { ... },
    "vendor": { ... },
    "orderLines": [ ... ],
    "subtotal": 1000,
    "taxAmount": 250,
    "totalAmount": 1250,
    "currency": "NOK"
  }
}
```

## Support

For issues or questions, refer to the component documentation in each file or contact the development team.
