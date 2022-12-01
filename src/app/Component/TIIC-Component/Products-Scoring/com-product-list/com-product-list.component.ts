import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Customers } from '../../../../CommoUtils/common-services/Product-Scoring-Data/customers.model';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { widgetData, widgeScoringData } from '../../../../CommoUtils/common-services/Product-Scoring-Data/data';
import { Observable } from 'rxjs';
import { AdvancedService } from '../../../../CommoUtils/common-services/advanced.service';
import { customersData } from '../../../../CommoUtils/common-services/Product-Scoring-Data/dataCustomer';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { Widget } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/default.model';
import * as _ from 'lodash';
import { ComDeletePopupComponent } from 'src/app/Popup/Product-Scoring/com-delete-popup/com-delete-popup.component';
import { ProductCommonComponent } from 'src/app/Popup/Product-Scoring/product-common/product-common.component';
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-com-product-list',
  templateUrl: './com-product-list.component.html',
  styleUrls: ['./com-product-list.component.scss']
})
export class ComProductListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  widgetData!: Widget[];
  currentDate = new Date();
  paginatedData: Array<any> = [];
  customersData!: Customers[];
  submitted!: boolean;

  // page number
  page = 1;
  // default page size
  pageSize = 10;

  // start and end index
  startIndex = 1;
  endIndex = 10;
  totalSize = 0;
  totalRecords: any;
  PageSelectNumber!: number[];
  total$!: Observable<number>;

  tab!: number;
  request!: Request;
  isActive = false;
  activateTab!: number;
  selectedTabDetails: any;

  selectValue!: string[];

  allProduct: any = [];
  activeProductList: any = [];
  businessTypeId: number;
  orgId: number;
  roleId: number;
  roles: any = {};
  productCategory: any;
  routeMainPath!: any;
  popUpObj: any = [];
  requestEnum: any[];
  responseEnum: any = [];
  typeOfBorrower: any = [];
  indexValue!: number;
  productId!: number;
  userPermissionList: any = [];

  jobId!: any;
  action: any = {};
  byIdData: any = {};

  schemeId!: number;

  productStatus: any = Constants.productStatus;
  constructor(public NPconfig: NgbModalConfig, private eref: ElementRef, private modalService: NgbModal, public service: AdvancedService,
    private productService: ProductService,
    private router: Router, private commonService: CommonService) {
    NPconfig.backdrop = 'static';
    this.total$ = service.total$;
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    this.schemeId = 9;
    this.routeMainPath = 'TIIC';
    this.businessTypeId = 1;
     this.roles = Constants.UserRoleList;
    this.userPermissionList = _.split(CommonService.getStorage('UserPermission', true), ',');

  }

  // Scroll table For Nikul Don't Remove  05-Feb-2021 Start
  @ViewChild('ProductListContent', { read: ElementRef }) public ProductListContent!: ElementRef<any>;

  public scrollRight(): void {
    this.ProductListContent.nativeElement.scrollTo({ left: (this.ProductListContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.ProductListContent.nativeElement.scrollTo({ left: (this.ProductListContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  isLargeScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 1650) {
      return true;
    } else {
      return false;
    }
  }
  // Scroll table For Nikul Don't Remove  05-Feb-2021 End

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: this.routeMainPath + '/dashboard' }, { label: 'Product List', path: '/', active: true }];
    this.activateTab = 0;
    this.PageSelectNumber = [10, 15, 20, 25, 30];
    /**
     * fetches data
     */
    this.getBusinessType(this.businessTypeId);
    this.getProductCountByStatus();
  }

  /**
 * paginatio onchange event
 * @param page page
 */
  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;

  }

  private _fetchData() {
    this.widgetData = widgetData;
    // table data
    this.customersData = customersData;
    // apply pagination
    this.startIndex = 0;
    this.endIndex = this.pageSize;

    this.paginatedData = this.customersData.slice(this.startIndex, this.endIndex);
    this.totalSize = this.customersData.length;
  }

  Delete_Product_Permantly(objData: any) {
    const config = {
      windowClass: 'popup-650',
    };
    const modalRef = this.modalService.open(ComDeletePopupComponent, config);
    modalRef.componentInstance.popUpObj = objData;
    return modalRef.result.then(result => {
      if (result === 'Ok') {
        this.getProductCountByStatus();
      }
    });
  }
  activeClick(index: any, item: any) {
    this.activateTab = index;
    this.selectedTabDetails = item;
    this.getProducListByStatusId(this.activateTab);
  }


  getProductCountByStatus() {
    this.productService.getProductCountByStatus(this.businessTypeId, this.schemeId).subscribe(response => {
      if (response.status === 200) {
        this.widgetData = response.data;
        if (this.roleId === this.roles.ADMIN_MAKER.id) {
          this.activateTab = 2;
        } else {
          this.activateTab = 1;
        }
        this.getProducListByStatusId(this.activateTab);
      }
    }, function (error: any) {
      if (error.status == 401) {
        // CommonMethod.logoutUser();
      }
    });
  }

  getProducListByStatusId(index: any) {
    let status = 1;
    this.activateTab = index;
    if (this.activateTab == 1) {
      status = 1;
    } else if (this.activateTab == 2) {
      status = 2;
    } else if (this.activateTab == 3) {
      status = 3;
    } else if (this.activateTab == 4) {
      status = 4;
    } else if (this.activateTab == 5) {
      status = 5;
    }
    this.productService.getProducListByStatusId(status, this.businessTypeId, this.schemeId).subscribe(response => {
      if (response.status === 200) {
        this.allProduct = response.data;

        // console.log(this.allProduct)
      }
    }, function (error) {
      if (error.status == 401) {

      }
    });
  }


  getActiveProductList(activeIndex) {
    this.activeProductList = [];
    if (activeIndex == 0) {
      this.productService.getAllMasterProduct(this.businessTypeId, this.schemeId).subscribe(res => {
        if (!CommonService.isObjectNullOrEmpty(res) && !CommonService.isObjectNullOrEmpty(res.data)) {
          this.activeProductList = res.data;
          return;
        }

      }, error => {
        console.log(error);
      })
    } else {
      this.allProduct.forEach(element => {
        if (element.producStatusId == (activeIndex + 1)) {
          this.activeProductList.push(element);
        }
      });
    }
  }
  goToEdit(id: number) {
    const config = {
      windowClass: 'popup-650',
    };
    this.popUpObj.productId = id;
    this.popUpObj.type = 7;
    if (this.activateTab === 1) {
      this.productService.checkProductEditable(id).subscribe(response => {
        if (response && response.status === 200) {
          if (response.data != null && response.data) {
            this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
              if (result === 'Ok') {
                if (this.activateTab === 1) {
                  this.getTempDataByMasterProductId(id)
                } else {
                  this.router.navigate([this.routeMainPath + '/Product-Edit'], { queryParams: { id: CommonService.encryptFunction(id.toString()), tab: CommonService.encryptFunction(this.activateTab.toString()) } });
                }

              }

            });
          } else {
            this.commonService.warningSnackBar("Your request is already sent to checker for approval. Hence you can not edit product");
            return;
          }
        }
      });
    } else {
      this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
        if (result === 'Ok') {
          if (this.activateTab === 1) {
            this.getTempDataByMasterProductId(id)
          } else {
            this.router.navigate([this.routeMainPath + '/Product-Edit'], { queryParams: { id: CommonService.encryptFunction(id.toString()), tab: CommonService.encryptFunction(this.activateTab.toString()) } });
          }

        }

      });
    }
  }
  getTempDataByMasterProductId(id: number) {
    // if(this.activateTab ==1){
    this.productService.getTempProductId(id).subscribe(res => {
      if (res && res.data) {
        this.productId = res.data;
        // console.log(res.data);
        this.router.navigate([this.routeMainPath + '/Product-Edit'], { queryParams: { id: CommonService.encryptFunction(this.productId.toString()), tab: CommonService.encryptFunction(this.activateTab.toString()) } })
      }
    });
    // }
  }

  goToView(id: number, tab: number) {
    // console.log(id)
    if (tab == 5) {
      // console.log(id)
      this.productService.getTempProductId(id).subscribe(res => {
        if (res && res.data) {
          this.productId = res.data;
          // console.log(this.productId);
          this.router.navigate([this.routeMainPath + '/Product-View'], { queryParams: { id: CommonService.encryptFunction(this.productId.toString()), tab: CommonService.encryptFunction(tab.toString()), old: CommonService.encryptFunction(false) } });
        } else {
          this.router.navigate([this.routeMainPath + '/Product-View'], { queryParams: { id: CommonService.encryptFunction(id.toString()), tab: CommonService.encryptFunction(tab.toString()), old: CommonService.encryptFunction(true) } });

        }
      });
    } else {
      this.router.navigate([this.routeMainPath + '/Product-View'], { queryParams: { id: CommonService.encryptFunction(id.toString()), tab: CommonService.encryptFunction(tab.toString()), isFromView: CommonService.encryptFunction(true) } });
    }

  }
  getBusinessType(businessTypeId: any) {
    // this.productCategory = Constants.productCategory.filter((item) => item.id == businessTypeId)[0].name;
  }
  checkButtonPermission(buttton: any): boolean {
    const index: number = this.userPermissionList.indexOf(buttton);
    if (index != -1)
      return true;
    else
      return false;
  }


  Active_Deactive_Popup(product: any, type: any) {
    const config = {
      windowClass: 'popup-650',
    };
    this.popUpObj.title = type == 1 ? 'Deactivation' : 'Activation';
    this.popUpObj.name = product.productName;
    this.popUpObj.type = 8;
    this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
      if (result === 'Ok') {
      this.getTempProductId(product.id);
      // this.sendForApproval(product);
      }
    });
  }

  inActiveProduct(product: any, type: any) {
    {
      let data: any = {};
      data.type = 8;
      data.name = product.productName;
      // data.title = type == 1 ? 'Deactivation' : 'Activation';
      this.productService.inActiveProduct(product.id, type).subscribe(success => {
        if (success.status === 200) {
          this.getProducListByStatusId(this.activateTab);
          this.getProductCountByStatus();
        }
      });

    }
  }
  getTempProductId(id: number) {
    this.productService.getTempProductId(id).subscribe(res => {
      if (res && res.data) {
        this.productId = res.data;
        this.getProductDetailById(this.productId, this.businessTypeId, this.schemeId);
        }
    });
  }
  getProductDetailById(id: number, businessTypeId: number, schemeId: number) {
    this.productService.getProductById(id, businessTypeId, schemeId)
      .subscribe(
        data => {
          this.byIdData = data.data;
          this.jobId = this.byIdData.jobId;
          this.sendForApproval(this.byIdData);
        },
        error => {
          console.log(error);
        });
  }

  sendForApproval(byIdData: any) {
    this.action.jobId = this.jobId;
    this.action.currentStep = 7;
    this.action.toStep = 8;
    this.action.actionId = 18;
    byIdData.workflowRequest = this.action;

    // console.log(byIdData)

    this.productService.sendForApproval(byIdData).subscribe(res => {
      if (!CommonService.isObjectNullOrEmpty(res)) {
        this.commonService.successSnackBar('Successfully');

        if (this.action.currentStep == 7 && this.action.actionId == 18) {// Active or Deactive product 
          if (this.activateTab == 3) {
            this.inActiveProduct(byIdData, Number(1));

          }
          this.router.navigate([this.routeMainPath + '/Product-List'])
          return;
        }
      }
      // this.getWorkflowRes();
    }, error => {
      this.commonService.errorSnackBar(error);
    })
  }
  toNewProduct() {
    this.router.navigate(['TIIC/Product-New']);
  }

}
