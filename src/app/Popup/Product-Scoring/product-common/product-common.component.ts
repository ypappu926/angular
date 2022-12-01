import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-common',
  templateUrl: './product-common.component.html',
  styleUrls: ['./product-common.component.scss']
})
export class ProductCommonComponent implements OnInit {

  @Input() popUpObj: any;
  productObj: any = {};
  remarks: any;
  productId: any;
  productName:any;
  routeMainPath!: any;
  constructor(public activeModal: NgbActiveModal, private commonService:CommonService,private router:Router,private productService: ProductService) { }

  ngOnInit(): void {
    this.productId = this.popUpObj.productId;
    this.routeMainPath = 'TIIC';
  }



goToEdit() {
  this.activeModal.close('ok')
  this.router.navigate([this.routeMainPath+'/Product-New'], { queryParams: { id:   CommonService.encryptFunction( this.productId.toString())} });
}
deleteProduct(){
  this.productService.removeProduct(this.productId).subscribe(
    response => {
      // console.log(response);
      if (response.status === 200) {
        this.commonService.successSnackBar(response.message);
      } else {
        this.commonService.warningSnackBar(response.message);
      }
    }, (error: any) => {
      this.commonService.errorSnackBar(error);
    });
    window.location.reload();
}

goToEditParameter(){
  this.activeModal.close('Ok')
  // this.router.navigate([this.routeMainPath+'/Product-Edit'], { queryParams: { id:  this.productId.toString()} })
}
}
