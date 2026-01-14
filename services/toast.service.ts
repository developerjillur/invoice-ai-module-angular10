import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a success toast
   */
  success(message: string, action: string = 'OK'): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration: 4000,
      panelClass: ['toast-success']
    });
  }

  /**
   * Show an error toast
   */
  error(message: string, action: string = 'OK'): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration: 6000,
      panelClass: ['toast-error']
    });
  }

  /**
   * Show an info toast
   */
  info(message: string, action: string = 'OK'): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration: 4000,
      panelClass: ['toast-info']
    });
  }

  /**
   * Show a warning toast
   */
  warning(message: string, action: string = 'OK'): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration: 5000,
      panelClass: ['toast-warning']
    });
  }

  /**
   * Show a custom toast with full configuration
   */
  show(message: string, action: string = '', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      ...this.defaultConfig,
      ...config
    });
  }

  /**
   * Dismiss current toast
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
