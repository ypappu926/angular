import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  toasts: any[] = [];

  constructor(
    //  private snackBar: MatSnackBar
  ) { }

  /**
   * Open snackbar
   */
  // public openSnackBar(message: string, action: string, snackType: any) {
  //   console.log(snackType+"---------"+message);
  //   const sType = snackType !== undefined ? snackType : '';
  //   console.log(sType);

  //   this.snackBar.openFromComponent(SnackbarComponent, {
  //     duration: 3000,
  //     horizontalPosition: 'right',
  //     verticalPosition: 'top',
  //     panelClass: [sType + '-snackbar'],
  //     data: { message, snackType: sType },
  //   });

  // }

  /**
   * Close snackbar
   */
  // public dismiss() {
  //   this.snackBar.dismiss();
  // }



  // for ng toast
  openSnackBar(textOrTpl: string | TemplateRef<any>, action, snackType) {
    const ary = {
      textOrTpl,
      delay: 3000,
      classname: (snackType || '') + '-snackbar',
    }
    this.toasts = [];
    this.toasts.push(ary);
    // this.remove()
  }

  remove(toast) {
    // console.log('remove');
    // this.toasts = this.toasts.filter(t => t !== toast);
    this.toasts = [];
  }
}