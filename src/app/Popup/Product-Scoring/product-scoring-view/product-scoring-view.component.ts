import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-scoring-view',
  templateUrl: './product-scoring-view.component.html',
  styleUrls: ['./product-scoring-view.component.scss']
})
export class ProductScoringViewComponent implements OnInit {

  @Input() popUpObj: any;
  productList: any = [];
  mainList: any = [];
  searchText: any;
  routeMainPath!: any;
  constructor(public activeModal: NgbActiveModal, private commonService: CommonService, private router: Router,
    private productService: ProductService) {
    this.routeMainPath = 'TIIC';
  }

  ngOnInit(): void {
    this.productList = this.popUpObj;
    this.mainList = this.popUpObj;
  }

  closeModal() {
    this.activeModal.close('Close');
  }

  filterText(searchText: any) {
    if (this.commonService.isObjectNullOrEmpty(searchText)) {
      this.productList = this.mainList;
      return;
    }
    this.productList = this.mainList.filter((item) => (item.productName.toLowerCase().includes(searchText.toLowerCase())))
  }

  openProduct(productId) {
    // this.productService.getTempProductId(productId).subscribe(res => {
    //   if (res && res.data) {
    //     const productId = res.data;
        this.closeModal()
        this.router.navigate([this.routeMainPath + '/Product-View'], { queryParams: { id: CommonService.encryptFunction(productId.toString()), tab: CommonService.encryptFunction("1") } });
  //     }

  //   });
  }
}
