import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-com-delete-popup',
  templateUrl: './com-delete-popup.component.html',
  styleUrls: ['./com-delete-popup.component.scss']
})
export class ComDeletePopupComponent implements OnInit {

  constructor( public activeModal: NgbActiveModal, private productService: ProductService, private route: ActivatedRoute,private commonService:CommonService) { }
  @Input() popUpObj: any;
  productId:any; 
  data:any={};
  ngOnInit(): void {
    console.log(this.popUpObj);
    this.productId = this.popUpObj;
  }
  closeModal() {
    this.activeModal.close('Close');
  }
  delete(){
    this.productService.removeProduct(this.productId).subscribe(
      response => {
        // console.log(response);
        if (response.status === 200) {
          this.commonService.successSnackBar("Removed");
          this.activeModal.close('Ok');
        } else {
          this.commonService.warningSnackBar(response.message);
        }
      }, (error: any) => {
        this.commonService.errorSnackBar(error);
      });
      // window.location.reload();
  }
}
