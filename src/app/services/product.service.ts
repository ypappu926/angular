import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommonService } from '../CommoUtils/common-services/common.service';
import { HttpService } from '../CommoUtils/common-services/http.service';
import { RestUrl } from '../CommoUtils/resturl';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  saveSubject = new Subject();
  public saveSubjectSubscriber$ = this.saveSubject.asObservable();
  emitSaveEvent(data): void {
    this.saveSubject.next(data);
  }

  constructor(
    private http: HttpService,
    private commonService: CommonService,
    ) { }
  //get all fields
  getAll(): Observable<any> {
    return this.http.get(RestUrl.GET_SUB_FIELD,false);
  }
  //create new product
  createNewProduct(data:any):Observable<any>{
    return this.http.post(RestUrl.SAVE_TMP_PRODUCT,data);
  }

  // saveBureauConfig(data:any):Observable<any>{
  //   return this.http.post(RestUrl.SAVE_BUREAU_CONFIG,data);
  // }

  // updatePopupData(data:any):Observable<any>{
  //   return this.http.post(RestUrl.UPDATE_POPUP_DATA,data);
  // }

  getAllProduct(): Observable<any>{
    return this.http.get(RestUrl.GET_TEMP_ALL_PRODUCT,false);
  }
  getAllActiveProduct(businessTypeId:number): Observable<any>{
    return this.http.get(RestUrl.GET_ALL_ACTIVE_PRODUCT + CommonService.encryptFunction(businessTypeId),false);
  }
  getProductById(id:number,businessTypeId:number,schemeId:number): Observable<any>{
    return this.http.get(RestUrl.GET_TMP_PRODUCT_BY_ID + CommonService.encryptFunction(id) + '/' + CommonService.encryptFunction(businessTypeId) + '/' + CommonService.encryptFunction(schemeId), false);
  }
  getFieldsByProduct(id:number,tab:Boolean):Observable<any>{
    return this.http.get(RestUrl.GET_PRODUCT_FIELD_BY_ID + CommonService.encryptFunction(id) + '/' + CommonService.encryptFunction(tab), false);
  }
  getFields(data:any): Observable<any>{
    return this.http.post(RestUrl.GET_FIELDS,data);
  }
  saveProductFields(data:any):Observable<any>{
    return this.http.post(RestUrl.SAVE_PROD_FIELDS,data);
  }
  saveProductSubFields(data:any):Observable<any>{
    return this.http.post(RestUrl.SAVE_SUB_PROD_FIELD,data);
  }
  removeProduct(id:any):Observable<any>{
    return this.http.post(RestUrl.REMOVE_PRODUCT,id);
  }

  saveStateTemp(data:any):Observable<any>{
    return this.http.post(RestUrl.SAVE_STATE_AND_CITY_TMP,data);
  }

  getGeographicalDetail(productId:number):Observable<any>{
    return this.http.get(RestUrl.GET_GEOGRAPHICAL_DETAIL + CommonService.encryptFunction(productId), false);
  }

  //Master Service
  getAllMasterProduct(businessTypeId:number,schemeId:number): Observable<any>{
    return this.http.get(RestUrl.GET_ALL_PRODUCT+ CommonService.encryptFunction(businessTypeId) + '/' + CommonService.encryptFunction(schemeId), false);
  }

  getFieldsFromMaster(id:number): Observable<any>{
    return this.http.get(RestUrl.GET_FIELDS_FROM_MASATER + CommonService.encryptFunction(id), false);
  }

  getFieldsByProductFromMaster(id:number):Observable<any>{
    return this.http.get(RestUrl.GET_PRODUCT_FIELD_BY_ID_FROM_MASTER + CommonService.encryptFunction(id), false);
  }

  getProductByIdFromMaster(id:number,type:number): Observable<any>{
    return this.http.get(RestUrl.GET_PRODUCT_BY_ID + CommonService.encryptFunction(id) + '/' + CommonService.encryptFunction(type),false);
  }

  getTempProductId(id:number): Observable<any>{
    return this.http.get(RestUrl.GET_TEMP_PROD_ID_BY_ID + CommonService.encryptFunction(id), false);
  }

  getProducListByStatusId(productStatusId:number,businessTypeId:number,schemeId:number) : Observable<any>{
    return this.http.get(RestUrl.GET_PRODUCT_LIST_BY_STATUS_ID + CommonService.encryptFunction(productStatusId) + '/' + CommonService.encryptFunction(businessTypeId) + '/' + CommonService.encryptFunction(schemeId), false);
  }

  sendForApproval(request: any) :Observable<any>{
    return this.http.post(RestUrl.SEND_FOR_APPROVAL, request);
  }

  getActiveSteps(request: any):Observable<any> {
    return this.http.post(RestUrl.GET_ACTIVE_STEPS, request);
  }

  createWorkflowJob(request: any):Observable<any> {
    return this.http.post(RestUrl.CREATE_JOB, request);
  }
  getProductCountByStatus(businessTypeId:number,schemeId:number):Observable<any>{
    return this.http.get(RestUrl.GET_PRODUCT_COUNT_BY_STATUS + CommonService.encryptFunction(businessTypeId) + '/' + CommonService.encryptFunction(schemeId), false);
  }

  // getBureauConfigMasterList(orgId :number):Observable<any>{
  //   return this.http.get(RestUrl.GET_BUREAU_CONFIG_MASTER_LIST + CommonService.encryptFunction(orgId) ,false);

  // }

  // getBureauConfigMasterListNew(orgId :number,activateTab :number):Observable<any>{
  //   return this.http.get(RestUrl.GET_BUREAU_CONFIG_MASTER_LIST_ACTIVE + CommonService.encryptFunction(orgId) + '/'+ CommonService.encryptFunction(activateTab) ,false);

  // }

  // getEditMasterList(id :Number,activateTab:Number):Observable<any>{
  //   return this.http.get(RestUrl.GET_EDIT_MASTER_LIST + CommonService.encryptFunction(id) + '/' +CommonService.encryptFunction(activateTab),false);

  // }


  // getEditMasterList(id :Number,activateTab:Number):Observable<any>{
  //   return this.http.get(RestUrl.GET_EDIT_MASTER_LIST + CommonService.encryptFunction(id) + '/' +CommonService.encryptFunction(activateTab),false);

  // }
  
  
  //   getBureauConfigMasterListNew1(orgId :Number,id:Number):Observable<any>{
  //   return this.http.get(RestUrl.GET_BUREAU_CONFIG_MASTER_LIST_NEW + CommonService.encryptFunction(orgId) + '/'+ CommonService.encryptFunction(id) ,false);

  // }

  // getInactiveBureaMasterList(orgId :number):Observable<any>{
  //   return this.http.get(RestUrl.GET_BUREAU_INACTIVE_COUNT_LIST + CommonService.encryptFunction(orgId) ,false);
  // }

  // inactiveMasterList(id :Number,type:Number):Observable<any>{
  //   console.log( "id" ,id  + "  type  " , type )
  //   return this.http.get(RestUrl.INACTIVE_MASTER_LIST + CommonService.encryptFunction(id) + '/' + CommonService.encryptFunction(type) ,false);
  // }

  // commonDashBoardData(masterId :number,orgId:Number):Observable<any>{
  //   return this.http.get(RestUrl.COMMON_DASHBOARD_DATA +  CommonService.encryptFunction(masterId) + '/' + CommonService.encryptFunction(orgId)  ,false);
  // }

  getViewData(id:number):Observable<any>{
    return this.http.get(RestUrl.GET_PRODUCT_VIEW_DATA + CommonService.encryptFunction(id), false);
  }
  getMasterViewData(id:number):Observable<any>{
    return this.http.get(RestUrl.GET_PRODUCT_MASTER_VIEW_DATA + CommonService.encryptFunction(id), false);
  }
  inActiveProduct(id:number,type:number):Observable<any>{
    return this.http.get(RestUrl.GET_INACTIVE_PRODUCT + CommonService.encryptFunction(id) + '/' + CommonService.encryptFunction(type), false);
  }


  // eligibility model start
  saveEligibilityModel(request: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_ELIGIBILITY_MODEL, request);
  }

  getEligibilityByProductId(fpProductId: any): Observable<any> {
    return this.http.get(RestUrl.GET_ELIGIBILITY_BY_PRODUCTID + CommonService.encryptFunction(fpProductId), false);
  }

  sendEligibilityForApproval(request: any): Observable<any> {
    return this.http.post(RestUrl.SEND_ELIGIBILITY_FOR_APPROVAL, request);
  }

  getEligibilityModelMasterById(fpProductId: any): Observable<any> {
    return this.http.get(RestUrl.GET_ELIGIBILITY_MODEL_MASTER_BY_ID + CommonService.encryptFunction(fpProductId), false);
  }
  // eligibility model end

  saveScalingMatrix(request:any):Observable<any>{
    return this.http.post(RestUrl.SAVE_SCALING_MATRIX, request);
  }

  getScalingMatrix(request:any):Observable<any>{
    return this.http.post(RestUrl.GET_SCALING_MATRIX_BY_PRODUCT_ID ,request,false);
  }

  getScalingMatrixMaster(request:any):Observable<any>{
    return this.http.post(RestUrl.GET_SCALING_MATRIX_MASTER_BY_PRODUCT_ID ,request,false);
  }

  getBaseRate(request):Observable<any>{
    return this.http.post(RestUrl.GET_CURRENT_BASE_RATE ,request ,false);
  }

  getToBeActiveBaseRate(request):Observable<any>{
    return this.http.post(RestUrl.GET_TO_BE_ACTIVE_BASE_RATE ,request ,false);
  }

  getScoringMasterList(businessTypeId,schemeId,typeId):Observable<any>{
    return this.http.get(RestUrl.GET_SCORING_MASTER_LIST + CommonService.encryptFunction(businessTypeId) + "/" + CommonService.encryptFunction(schemeId) +  "/" + CommonService.encryptFunction(typeId), false);
  }

  getApprovalFlag(productId: any): Observable<any>{
    return this.http.get(RestUrl.GET_APPROVAL_FLAG + CommonService.encryptFunction(productId), null, false);
  }
  checkProductEditable(productId: any): Observable<any>{
    return this.http.get(RestUrl.CHECK_PRODUCT_EDITABLE + CommonService.encryptFunction(productId), null, false);
  }
  getEnumByType(type:any): Observable<any>{
    return this.http.post(RestUrl.LIST_BY_CLASS, type ,false);
  }
  getProductConfignPara(businessTypeId:number,schemeId:number):Observable<any>{
    return this.http.get(RestUrl.GET_PRODUCT_CONFIG_PARA + CommonService.encryptFunction(businessTypeId) + '/' + CommonService.encryptFunction(schemeId), false);
  }
  
  getIndustryList():Observable<any>{
    return this.http.get(RestUrl.GET_INDUSTRY_DETAIL , false);
  }

  getSectorList(industry:any):Observable<any>{
    return this.http.post(RestUrl.GET_SECTOR_DETAIL_LIST, industry, false);
  }
  getSubSectorList(sector:any):Observable<any>{
    return this.http.post(RestUrl.GET_SUB_SECTOR_DETAIL_LIST,sector, false);
  }
  
  getUpdatedScoringDetails(value):Observable<any>{
    return this.http.get(RestUrl.GET_SCORING_UPDATED_DETAILS + CommonService.encryptFunction(value),false);
  }

  getScalingConfig(request:any):Observable<any>{
    return this.http.post(RestUrl.GET_SCALING_CONFIG ,request,false);
  }

   getStateList(countryId: any): Observable<any> {
    return this.http.get(RestUrl.STATE_LIST + CommonService.encryptFunction(countryId), false);
  }

  getCityList(data: any): Observable<any> {
    return this.http.post(RestUrl.CITY_LIST,data, false);
  }

  getCityListByStateId(stateId: any): Observable<any> {
    return this.http.get(RestUrl.GETCITYLISTBYSTATEID + CommonService.encryptFunction(stateId), false);
  }

  getLDGStateList(): Observable<any> {
    return this.http.get(RestUrl.GET_STATE_LGD_LIST, false);
  }

  getLDGDistrictList(data: any): Observable<any> {
    return this.http.post(RestUrl.GET_DISTRICT_LIST_BY_STATE_LIST,data, false);
  }

  getSubDistrictList(districtId): Observable<any> {
    return this.http.get(RestUrl.GET_SUB_DISTRICT_LIST + '/' + CommonService.encryptFunction(districtId), false);
  }

  getVillageList(subDistrictId): Observable<any> {
    return this.http.get(RestUrl.GET_VILLAGE_LIST + '/' + CommonService.encryptFunction(subDistrictId), false);
  }
}
