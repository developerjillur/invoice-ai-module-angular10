import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules (Angular 10 compatible)
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

// Routing
import { InvoiceAiRoutingModule } from './invoice-ai-routing.module';

// Services
import { DocumentAnalysisService } from './services/document-analysis.service';
import { InvoiceCalculationsService } from './services/invoice-calculations.service';
import { LocalStorageService } from './services/local-storage.service';
import { ToastService } from './services/toast.service';
import { ExportService } from './services/export.service';

// Components
import { HeaderComponent } from './components/header/header.component';
import { UploadZoneComponent } from './components/upload-zone/upload-zone.component';
import { ProcessingStateComponent } from './components/processing-state/processing-state.component';
import { CompletionStateComponent } from './components/completion-state/completion-state.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { InvoicePreviewComponent } from './components/invoice-preview/invoice-preview.component';
import { EditableTextComponent } from './components/editable-text/editable-text.component';
import { EditOrderDialogComponent } from './components/edit-order-dialog/edit-order-dialog.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { FeatureCardsComponent } from './components/feature-cards/feature-cards.component';
import { JsonOutputComponent } from './components/json-output/json-output.component';

// Pages
import { IndexComponent } from './pages/index/index.component';

@NgModule({
  declarations: [
    // Components
    HeaderComponent,
    UploadZoneComponent,
    ProcessingStateComponent,
    CompletionStateComponent,
    ErrorStateComponent,
    InvoicePreviewComponent,
    EditableTextComponent,
    EditOrderDialogComponent,
    StepIndicatorComponent,
    FeatureCardsComponent,
    JsonOutputComponent,
    // Pages
    IndexComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InvoiceAiRoutingModule,
    // Angular Material
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule
  ],
  providers: [
    DocumentAnalysisService,
    InvoiceCalculationsService,
    LocalStorageService,
    ToastService,
    ExportService
  ],
  exports: [
    // Export components that might be used elsewhere
    HeaderComponent,
    UploadZoneComponent,
    InvoicePreviewComponent,
    IndexComponent
  ]
})
export class InvoiceAiModule { }
