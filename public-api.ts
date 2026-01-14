/**
 * Invoice AI Module - Public API
 * Export all public interfaces for use in the main application
 */

// Module
export * from './invoice-ai.module';
export * from './invoice-ai-routing.module';

// Models
export * from './models/invoice.model';

// Services
export * from './services/document-analysis.service';
export * from './services/invoice-calculations.service';
export * from './services/local-storage.service';
export * from './services/toast.service';
export * from './services/export.service';

// Components (for direct use if needed)
export * from './components/header/header.component';
export * from './components/upload-zone/upload-zone.component';
export * from './components/processing-state/processing-state.component';
export * from './components/completion-state/completion-state.component';
export * from './components/error-state/error-state.component';
export * from './components/invoice-preview/invoice-preview.component';
export * from './components/editable-text/editable-text.component';
export * from './components/edit-order-dialog/edit-order-dialog.component';
export * from './components/step-indicator/step-indicator.component';
export * from './components/feature-cards/feature-cards.component';
export * from './components/json-output/json-output.component';

// Pages
export * from './pages/index/index.component';
