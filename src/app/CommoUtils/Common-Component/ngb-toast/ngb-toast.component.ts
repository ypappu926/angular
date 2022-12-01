import { Component, OnInit, TemplateRef } from '@angular/core';
import { SnackbarService } from '../../common-services/SnackbarService';

@Component({
  selector: 'app-ngb-toast',
  templateUrl: './ngb-toast.component.html',
  styleUrls: ['./ngb-toast.component.scss'],
  host: { '[class.ngb-toasts]': 'true' }
})
export class NgbToastComponent implements OnInit {

  
  constructor(
    public snackbarService: SnackbarService,
    // @Inject(SnackbarService) public data: any
  ) { }


  ngOnInit(): void {
    // console.log(this.snackbarService);
  }
  // get getIcon() {
  //   switch (this.data.snackType) {
  //     case 'success':
  //       return 'mdi mdi-check-circle';
  //     case 'error':
  //       return 'mdi mdi-block-helper';
  //     case 'warning':
  //       return 'mdi mdi-alert-outline';
  //     case 'info':
  //       return 'mdi mdi-alert-circle';
  //     default:
  //       return '';
  //   }
  // }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
  }
