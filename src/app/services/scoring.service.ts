import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../CommoUtils/common-services/common.service';
import { HttpService } from '../CommoUtils/common-services/http.service';
import { RestUrl } from '../CommoUtils/resturl';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {

  constructor(
    private http: HttpService,
    private commonService: CommonService,
    ) { }

  getCopyScoringList(businessType: any, schemeId: any,type): Observable<any> {
    return this.http.get(RestUrl.SCORING_COPY_LIST + "/" + CommonService.encryptFunction(businessType) + "/" + CommonService.encryptFunction(schemeId) + "/" + CommonService.encryptFunction(type), false);
  }
  getScoringData(scoringId: any,type: any): Observable<any> {
    return this.http.get(RestUrl.GET_SCORING_DATA + "/" + CommonService.encryptFunction(scoringId)+"/" + CommonService.encryptFunction(type), false);
  }

  //For save Scoring
  saveScoringModel(data: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_SCORING_MODEL, data);
  }

  //get existing scoring count
  getExistingScoringCount(type, businessTypeId, schemeId: any): Observable<any> {
    return this.http.get(RestUrl.GET_EXISTING_SCORING_COUNT +"/"+ CommonService.encryptFunction(businessTypeId) + "/" + CommonService.encryptFunction(schemeId) + "/"+ CommonService.encryptFunction(type), false);
  }

  //For get scoring model data
  getScoringModel(scoringModelId: any, type: any, tabType:any): Observable<any> {
    return this.http.get(RestUrl.GET_SCORING_MODEL + CommonService.encryptFunction(scoringModelId) + "/" + CommonService.encryptFunction(type)+ "/" + CommonService.encryptFunction(tabType), false);
  }

  getScoringModelPopUp(scoringModelId: any,tab: any): Observable<any> {
    return this.http.get(RestUrl.GET_SCORING_MODEL_POPUP + CommonService.encryptFunction(scoringModelId)+ "/" + CommonService.encryptFunction(tab), false);
  }

  saveScoringParameters(data: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_SCORING_PARAMETERS, data);
  }

  saveScoringParameterMapping(data: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_SCORING_PARAMETERS_MAPPING, data);
  }

  //ForUpdate field
  updateField(data: any): Observable<any> {
    return this.http.get(RestUrl.UPDATE_SCORING_PARAMETER + CommonService.encryptFunction(data), false);
  }

  //For Approve scoring model
  approveScoringModel(data: any, type: any): Observable<any> {
    return this.http.post(RestUrl.APPROVE_SCORING_MODEL + CommonService.encryptFunction(type), data);
  }

  //For update scoring status
  updateScoringStatus(scoringId: any, status: any): Observable<any> {
    return this.http.get(RestUrl.UPDATE_STATUS_SCORING_MODEL + CommonService.encryptFunction(scoringId) + "/" + CommonService.encryptFunction(status), false);
  }

  //For Scoring Service
  getScroringCount(businessType: any,schemeId: any): Observable<any> {
    return this.http.get(RestUrl.SCORING_COUNT + "/" + CommonService.encryptFunction(businessType) + "/" + CommonService.encryptFunction(schemeId), false);
  }

  //For Scoring List
  getScroringList(status: any, businessType: any, schemeId: any): Observable<any> {
    return this.http.get(RestUrl.SCORING_LIST + CommonService.encryptFunction(status) + "/" + CommonService.encryptFunction(businessType) + "/" + CommonService.encryptFunction(schemeId), false);
  }

  //For delete scoring model
  deleteScoringModel(scoringId: any): Observable<any> {
    return this.http.get(RestUrl.DELETE_SCORING_MODEL + CommonService.encryptFunction(scoringId), false);
  }
  inActiveScoringModel(scoringId: any, type: any): Observable<any> {
    return this.http.get(RestUrl.INACTIVE_SCORING_MODEL + CommonService.encryptFunction(scoringId) + "/" + CommonService.encryptFunction(type), false);
  }
  sendInActiveScoringModelForChecker(scoringId: any, type: any): Observable<any> {
    return this.http.get(RestUrl.SEND_INACTIVE_SCORING_MODEL_FOR_CHECKER + CommonService.encryptFunction(scoringId) + "/" + CommonService.encryptFunction(type), false);
  }

  sendActivateScoringModelForChecker(scoringId: any, type: any): Observable<any> {
    return this.http.get(RestUrl.SEND_ACTIVATE_SCORING_MODEL_FOR_CHECKER + CommonService.encryptFunction(scoringId) + "/" + CommonService.encryptFunction(type), false);
  }

  getProductSByscoringId(scoringId: any): Observable<any> {
    return this.http.get(RestUrl.PRODUCT_BY_SCORE_ID + CommonService.encryptFunction(scoringId), false);
  }

  getScoringConfignPara(businessTypeId:number,schemeId:number):Observable<any>{
    return this.http.get(RestUrl.GET_SCORNG_CONFIG_PARA + CommonService.encryptFunction(businessTypeId) + '/' + CommonService.encryptFunction(schemeId), false);
  }

  // schemes start
  // getSchemes(): Observable<any> {
  //   return this.http.get(RestUrl.GETSCHEMESWITHLOAN, false);
  // }

  // getLoanById(loanTypeId: any): Observable<any> {
  //   return this.http.get(RestUrl.GETLOANBYID + '/' + CommonService.encryptFunction(loanTypeId), false);
  // }

  // editScheme(schemeMapId, loanTypeId: any, schemeId: any, dataFromMaster): Observable<any> {
  //   return this.http.get(RestUrl.SCHEMEID + '/' + CommonService.encryptFunction(schemeMapId) + '/' + CommonService.encryptFunction(loanTypeId) + '/' + CommonService.encryptFunction(schemeId) + '/' + CommonService.encryptFunction(dataFromMaster), false);
  // }

  // getSchemeViewInfo(loanTypeId: any, schemeId: any): Observable<any> {
  //   return this.http.get(RestUrl.GETSCHEMEVIEWINFO + '/' + CommonService.encryptFunction(loanTypeId) + '/' + CommonService.encryptFunction(schemeId), false);
  // }

  // saveSchemeMappingData(schAry: any): Observable<any> {
  //   return this.http.post(RestUrl.SAVESCHEMEMAPPINGDATA, schAry);
  // }

  // approveScheme(data: any): Observable<any> {
  //   return this.http.post(RestUrl.APPROVE_SCHEME, data);
  // }

  // toggleSchemeIsActive(computeData: any): Observable<any> {
  //   return this.http.post(RestUrl.TOGGLESCHEMEISACTIVE, computeData);
  // }

  // saveSubsidyClaim(data: any): Observable<any> {
  //   return this.http.post(RestUrl.SAVESUBSIDYCLAIM, data);
  // }

  // supAdminTabData(tabType): Observable<any> {
  //   return this.http.get(RestUrl.SUP_ADMIN_TAB_DATA + '/' + CommonService.encryptFunction(tabType), false);
  // }

  // supAdminTabCount(): Observable<any> {
  //   return this.http.get(RestUrl.SUP_ADMIN_TAB_COUNT, false);
  // }

  // getSubsidyClaimTrail(schemeId): Observable<any> {
  //   return this.http.get(RestUrl.GET_SUBSIDY_CLAIM_TRAIL + '/' + CommonService.encryptFunction(schemeId), false);
  // }
  // // schemes end

  // //workflow
  getJobId(req: any): Observable<any> {
    return this.http.post(RestUrl.GET_JOB_ID, req);
  }

  getActiveStepForMaster(jobId): Observable<any> {
    return this.http.get(RestUrl.GET_ACTIVE_STEPS_FOR_BASE_RATE + CommonService.encryptFunction(jobId), null, false);
  }

  updateWorkflowjob(request: any): Observable<any> {
    return this.http.post(RestUrl.UPDATE_WORKFLOW_JOB, request);
  }

  getBaseRateDetails(request: any): Observable<any> {
    return this.http.post(RestUrl.GET_BASE_RATE_DETAILS, request);
  }

  getAllBaseRateDetails(request: any): Observable<any> {
    return this.http.post(RestUrl.GET_ALL_BASE_RATE_DETAILS, request);
  }

  
}
