import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

// Import the Invoice AI Module
import { InvoiceAiModule } from '../../invoice-ai.module';
import { IndexComponent } from '../../pages/index/index.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    InvoiceAiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
