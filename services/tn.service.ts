import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpService } from 'src/app/CommoUtils/common-services/http.service';
import { RestUrl } from 'src/app/CommoUtils/resturl';
import { CommonMethods } from '../CommoUtils/common-services/common-methods';
import { CommonService } from '../CommoUtils/common-services/common.service';


@Injectable({
  providedIn: 'root'
})
export class TnService {

  constructor(private http: HttpService) { }

  updateDataObserver = new Subject();
  public updateDataSubscriber$ = this.updateDataObserver.asObservable();

  emitData(data) {
    this.updateDataObserver.next(data);
  }

  getStatusList(data): Observable<any> {
    return this.http.post(RestUrl.GET_STATUS_LIST, data);
  }

  getStatusTabCount(data): Observable<any> {
    return this.http.post(RestUrl.GET_STATUS_TAB_COUNT, data);
  }

  getUserList(data): Observable<any> {
    return this.http.post(RestUrl.GET_ALL_USERS_LIST, data);
  }

  isUserLocked(data): Observable<any> {
    return this.http.post(RestUrl.USER_IS_LOCKED, data);
  }

  isUserResetPassword(data): Observable<any> {
    return this.http.post(RestUrl.USER_RESET_PWD, data);
  }


  getOrgList(): Observable<any> {
    return this.http.get(RestUrl.GET_ALL_ORG_LIST, false);
  }

  getAllByOrgType(orgType: any): Observable<any> {
    return this.http.get(RestUrl.GET_ALL_BY_ORG_TYPE + '/' + CommonService.encryptFunction(orgType), false);
  }

  checkEmailAvailibility(data): Observable<any> {
    return this.http.post(RestUrl.CHECK_EMAIL_EXIST, data);
  }

  createOrUpdateUser(data): Observable<any> {
    return this.http.post(RestUrl.CREATE_OR_UPDATE_USER, data);
  }

  createUpdateUser(data): Observable<any> {
    return this.http.post(RestUrl.CREATE_UPDATE_USER, data);
  }

  saveBranchDetail(data): Observable<any> {
    return this.http.post(RestUrl.SAVE_BRANCH_DETAILS, data);
  }

  getUserDetailByUserId(data): Observable<any> {
    return this.http.post(RestUrl.GET_USER_DETAILS_BY_USER_ID, data);
  }

  getUserDetailByUserIdWithDistrict(data): Observable<any> {
    return this.http.post(RestUrl.GET_USER_OBJECT_BY_USER_ID, data);
  }

  uploadBorrowerConsentFile(formData: FormData): Observable<any> {
    return this.http.post(RestUrl.UPLOAD_BORROWER_CONSENT, formData, true);
  }

  getSuccessAndFailCountList(data): Observable<any> {
    return this.http.post(RestUrl.BORROWER_CONSENT_FILE_ENTRY_COUNT, data, true);
  }

  getBulkConsentUserList(data): Observable<any> {
    return this.http.post(RestUrl.GET_BULK_CONSENT_USER_LIST, data, true);
  }
  listUserImportedExcel(orgId): Observable<any> {
    return this.http.get(RestUrl.GET_USER_IMPORT_EXCEL_LIST + '/' + CommonService.encryptFunction(orgId), false);
  }
  changePassword(data: any): Observable<any> {
    return this.http.post(RestUrl.CHANGE_PASSWORD_AFTER_LOGIN, data);
  }

  updateIsLocked(data): Observable<any> {
    return this.http.post(RestUrl.UPDATE_IS_LOCKED, data);
  }

  proceedAfterUpload(data): Observable<any> {
    return this.http.post(RestUrl.PROCEED_AFTER_UPLOAD, data, false);
  }

  getLinkedExpiredDays(): Observable<any> {
    return this.http.get(RestUrl.LINK_EXPIRED_DAYS, null, true);
  }

  updateNotificationStatus(data): Observable<any> {
    return this.http.post(RestUrl.UPDATE_NOTIFICATION_STATUS, data, true);
  }

  updateMultipleNotificationStatus(data): Observable<any> {
    return this.http.post(RestUrl.UPDATE_MULTIPLE_NOTIFICATION_STATUS, data, true);
  }

  //For dynamic validations
  getValidations(loanType: any): Observable<any> {
    return this.http.get(RestUrl.GET_VALIDATIONS + CommonService.encryptFunction(loanType), false);
  }

  getFoStatusList(data, isBMLogin): Observable<any> {
    return this.http.post(isBMLogin ? RestUrl.GET_BM_STATUS_LIST : RestUrl.GET_FO_STATUS_LIST, data);
  }

  getFoStatusCount(): Observable<any> {
    return this.http.post(RestUrl.GET_FO_STATUS_COUNT, false);
  }

  createHoBoFioWorkflow(req): Observable<any> {
    return this.http.post(RestUrl.CREATE_HO_BO_FIO_WORKFLOW, req, false);
  }

  getActiveSteps(req): Observable<any> {
    return this.http.post(RestUrl.GET_ACTIVE_STEPS, req, false);
  }

  saveBorrowerData(req): Observable<any> {
    return this.http.post(RestUrl.SAVE_BORROWER_DATA, req, false);
  }

  saveApplicantDetails(req): Observable<any> {
    return this.http.post(RestUrl.SAVE_APPLICANT_DETAILS, req);
  }

  saveFieldForHoUser(req): Observable<any> {
    return this.http.post(RestUrl.SAVE_FIELDS_FOR_HO_USER, req,);
  }

  getBoDetails(orgId): Observable<any> {
    return this.http.get(RestUrl.GET_BO_DETAILS + CommonService.encryptFunction(orgId), false);
  }

  getBoStatusCount(): Observable<any> {
    return this.http.post(RestUrl.GET_BO_STATUS_COUNT, false);
  }
  getBoStatusList(data): Observable<any> {
    return this.http.post(RestUrl.GET_BO_STATUS_LIST, data);
  }

  getFieldDetails(borrowerProposalId, roleId): Observable<any> {
    return this.http.get(RestUrl.GET_FIELDS_DETAILS + CommonService.encryptFunction(borrowerProposalId) +'/'+ CommonService.encryptFunction(roleId), false);
  }

  getListByClass(classList): Observable<any> {
    return this.http.post(RestUrl.GET_LIST_BY_CLASSES, classList, false);
  }

  getSectorList(): Observable<any> {
    return this.http.get(RestUrl.GET_INDUSTRY_LIST, false);
  }

  getApplicantDetails(req): Observable<any> {
    return this.http.post(RestUrl.GET_APPLICANT_DETAILS, req);
  }

  getIndustryProductList(industryId): Observable<any> {
    return this.http.get(RestUrl.GET_INDUSTRY_PRODUCT_LIST + CommonService.encryptFunction(industryId), false);
  }

  getIndustryList(): Observable<any> {
    return this.http.get(RestUrl.GET_INDUSTRY_LIST, false);
  }

  updatePropsoalStatus(data): Observable<any> {
    return this.http.post(RestUrl.UPDATE_PROPOSAL_STATUS, data);
  }

  updateWrokflow(data): Observable<any> {
    return this.http.post(RestUrl.UPDATE_WORKFLOW, data);
  }

  updateSanctionWrokflow(data): Observable<any> {
    return this.http.post(RestUrl.SANCTION_UPDATE_WORKFLOW, data);
  }

  createConsentProfile(profileReq): Observable<any> {
    return this.http.post(RestUrl.SAVE_PROFILE_DETAILS, profileReq);
  }

  updateProfilePanData(profileReq): Observable<any> {
    return this.http.post(RestUrl.UPDATE_PROFILE_PAN, profileReq);
  }



  getItrDetails(profileId: any): Observable<any> {
    return this.http.get(RestUrl.GET_ITR_DETAILS + CommonService.encryptFunction(profileId), false);
  }

  uploadITR(items: any): Observable<any> {
    return this.http.post(RestUrl.ITR_UPLOAD, items);
  }

  profileVersionDetails(profileId: any): Observable<any> {
    return this.http.get(RestUrl.GET_PROFILE_VERSIONS + CommonService.encryptFunction(profileId), false);
  }

  getBankList(): Observable<any> {
    return this.http.post(RestUrl.BANK_LIST, false);
  }

  uploadBankStatement(formData: FormData): Observable<any> {
    return this.http.post(RestUrl.BANK_STATEMENT_UPLOAD, formData, true);
  }

  getBankStatementList(reportRequest: any): Observable<any> {
    return this.http.post(RestUrl.GET_BANK_STATEMENT_LIST, reportRequest, false);
  }

  getBankListFromITR(itrProfileId: number): Observable<any> {
    return this.http.get(RestUrl.GET_BANK_LIST_FROM_ITR + CommonService.encryptFunction(itrProfileId) + '?isLatestYear=' + CommonService.encryptFunction('true'), false);
  }

  getCombineBankList(reportRequest: any): Observable<any> {
    return this.http.post(RestUrl.GET_COMBINE_BANK_STATEMENT_LIST, reportRequest, false);
  }

  proceedBankStatement(request: any): Observable<any> {
    return this.http.post(RestUrl.PROCEED_BANK_STATEMENT, request, false);
  }

  checkMissingMonth(request: any): Observable<any> {
    return this.http.post(RestUrl.CHECK_MISSING_MONTHS, request, false);
  }

  getBsMasterId(profileId: any): Observable<any> {
    return this.http.post(RestUrl.GET_BS_MASTER_ID, profileId, false);
  }

  getDistrictList(): Observable<any> {
    return this.http.get(RestUrl.GET_DISTRICT_MASTER_LIST, false);
  }

  getBlockList(districtId): Observable<any> {
    return this.http.get(RestUrl.GET_BLOCK_BY_DISTRICT_ID + '/' + CommonService.encryptFunction(districtId), false);
  }

  // currenti not in use
  getPincodeMasterList(districtId: number): Observable<any> {
    return this.http.get(RestUrl.GET_PINCODE_MASTER_LIST + '/' + CommonService.encryptFunction(districtId), false);
  }

  getBranchListByDistrictId(districtId: any, proposalMappingId: any): Observable<any> {
    return this.http.get(RestUrl.GET_BRANCH_LIST_BY_DISTRICT_ID + '/' + CommonService.encryptFunction(districtId) + '/' + CommonService.encryptFunction(proposalMappingId), false);
  }

  getDistrictMasterListByPincodeId(pincodeId: number): Observable<any> {
    return this.http.get(RestUrl.GET_DISTRICT_MASTER_LIST_BY_PINCODE_ID + '/' + CommonService.encryptFunction(pincodeId), false);
  }

  getAllPincodeMasterList(): Observable<any> {
    return this.http.get(RestUrl.GET_ALL_PINCODE_MASTER_LIST, false);
  }

  getFioCreatedPincodeList(districtId, campOrgId): Observable<any> {
    return this.http.get(RestUrl.GET_FIO_CREATED_PINCODE_MASTER_LIST + '/' + CommonService.encryptFunction(districtId) + '/' + CommonService.encryptFunction(campOrgId), false);
  }

  getPincodebyDistrictIdList(data: any): Observable<any> {
    return this.http.post(RestUrl.GET_PINCODE_BY_DISTRICT_IDS, data);
  }

  getBranchDistrictMapping(data: any): Observable<any> {
    return this.http.post(RestUrl.GET_BRANCH_DISTRICT_MAPPING_LIST, data);
  }

  getUserTabDetailsList(): Observable<any> {
    return this.http.get(RestUrl.GET_USER_TAB_DETAILS, false);
  }

  getBranchList(): Observable<any> {
    return this.http.get(RestUrl.GET_BRANCH_LIST, false);
  }

  getCityListByStateId(stateId: any): Observable<any> {
    return this.http.get(RestUrl.GETCITYLISTBYSTATEID + CommonService.encryptFunction(stateId), false);
  }

  getMenuDetails(): Observable<any> {
    return this.http.get(RestUrl.GET_MENU_FOR_BANKER, false);
  }

  getAccessPaths(): Observable<any> {
    return this.http.get(RestUrl.GET_ACCESS_PATHS, false);
  }

  uploadUserCreationFile(formData: FormData): Observable<any> {
    return this.http.post(RestUrl.BULK_USER_CREATION, formData, true);
  }

  getFileEntryForBulkUsers(): Observable<any> {
    return this.http.get(RestUrl.GET_FILE_ENTRY_FOR_BULK_USERS, false);
  }

  getFileEntryList(data: any): Observable<any> {
    return this.http.post(RestUrl.GET_FILE_ENTRY_LIST, data, true);
  }

  
//  FIO BULK Upload
uploadFIOCreationFile(formData: FormData): Observable<any> {
  return this.http.post(RestUrl.BULK_FIO_USER_CREATION, formData, true);
}
getFIOFileEntryForBulkUsers(data: any): Observable<any> {
  return this.http.post(RestUrl.GET_FIO_FILE_ENTRY_FOR_BULK_USERS,data, true);
}
getFIOFileEntryList(data: any): Observable<any> {
  return this.http.post(RestUrl.GET_FIO_FILE_ENTRY_LIST, data, true);
}
//  FIO BULK Upload Ends Here 




  uploadBulkBranchOfcData(formData: FormData): Observable<any> {
    return this.http.post(RestUrl.BULK_BRANCH_OFC_CREATION, formData, true);
  }

  getFileEntryForBulkBranchOfc(): Observable<any> {
    return this.http.get(RestUrl.GET_FILE_ENTRY_FOR_BULK_BRANCH_OFC, false);
  }

  getFileEntryListBranchOfc(data: any): Observable<any> {
    return this.http.post(RestUrl.GET_FILE_ENTRY_LIST_BULK_BRANCH_OFC, data, true);
  }

  spGetBranchList(data): Observable<any> {
    return this.http.post(RestUrl.SP_GET_BRANCH_LIST, data);
  }

  createOrUpdateBranchDetails(data): Observable<any> {
    return this.http.post(RestUrl.CREATE_OR_UPDATE_BRANCH_DETAILS, data);
  }

  getBranchDetailsByBranchId(branchId: number): Observable<any> {
    return this.http.get(RestUrl.GET_BRANCH_DETAILS_BY_BRANCH_ID + '/' + CommonService.encryptFunction(branchId), false);
  }

  getFioStatusTabCount(data, isBMLogin): Observable<any> {
    return this.http.post(isBMLogin ? RestUrl.GET_BM_STATUS_TAB_COUNT : RestUrl.GET_FIO_STATUS_TAB_COUNT, data);
  }

  getFioStatusList(data): Observable<any> {
    return this.http.post(RestUrl.GET_FIO_STATUS_LIST, data);
  }

  createLoan(req: any): Observable<any> {
    return this.http.post(RestUrl.CREATE_LOAN, req);
  }

  updatedUserActiveFlag(req): Observable<any> {
    return this.http.post(RestUrl.UPDATED_USER_ACTIVE_FLAG, req);
  }

  getApplicantDetail(borrowerProposalId, proposalMappingId): Observable<any> {
    return this.http.get(RestUrl.GET_APPLICANT_DETAIL + '/' + CommonService.encryptFunction(borrowerProposalId) + '/' + CommonService.encryptFunction(proposalMappingId), false);
  }

  saveApplicantDetail(data): Observable<any> {
    return this.http.post(RestUrl.SAVE_APPLICANT_DETAIL, data);
  }

  updateSubFioRights(proposalMappingId): Observable<any> {
    return this.http.get(RestUrl.UPDATE_FIO_RIGHTS + '/' + CommonService.encryptFunction(proposalMappingId), false);
  }

  updateProposalStauts(data): Observable<any> {
    return this.http.post(RestUrl.UPDATE_PROPOSAL_STAUTS, data);
  }

  getFioUsersList(userOrgId: any, proposalMappingId: any): Observable<any> {
    return this.http.get(RestUrl.GET_FIO_USERS_LIST + CommonService.encryptFunction(userOrgId) + '/' + CommonService.encryptFunction(proposalMappingId), false);
  }

  transferProposal(req: any): Observable<any> {
    return this.http.post(RestUrl.TRANSFER_PROPOSAL, req);
  }

  enableTransfer(request: any): Observable<any> {
    return this.http.post(RestUrl.ENABLE_TRANSFER_PROPOSAL, request);
  }

  getAdminConfig(userId): Observable<any> {
    return this.http.get(RestUrl.GET_ADMIN_CONFIG_DETAIL + "/" + CommonService.encryptFunction(userId), false);
  }

  getDashBoardDataByUserId(): Observable<any> {
    return this.http.get(RestUrl.GET_DASHBOARD_DATA_BY_USER_ID, false);
  }

  spGetSanctionTabCount(): Observable<any> {
    return this.http.get(RestUrl.SP_GET_SANCTION_TAB_COUNT, false);
  }

  spGetSanctionList(data: any): Observable<any> {
    return this.http.post(RestUrl.SP_GET_SANCTION_LIST, data);
  }

  getMsmeProposalDetails(proposalId: any, applicationId: any): Observable<any> {
    return this.http.get(RestUrl.GET_MSME_PROPOSAL_DETAIL + '/' + CommonService.encryptFunction(proposalId) + '/' + CommonService.encryptFunction(applicationId), false);
  }

  // getApplicantdetailsProposal(proposalId: any, applicationId: any): Observable<any> {
  //   return this.http.get(RestUrl.GET_APPLICANT_DETAILS_PROPOSAL + '/' + CommonService.encryptFunction(proposalId) + '/' + CommonService.encryptFunction(applicationId), false);
  // }

  getApplicantdetailsProposal(applicationId: any): Observable<any> {
    return this.http.get(RestUrl.GET_BUSINESS_DETAILS + "?applicationId=" + applicationId + "&isActive=true", false);
  }

  getEnumByType(type: any): Observable<any> {
    return this.http.post(RestUrl.GET_LIST_BY_CLASS, type, false);
  }

  getMsmeCamReport(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_MSME_CAM_REPORT + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false);
  }

  getMsmeApplicationForm(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_MSME_APPLICATION_FORM + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false);
  }

  downloadZipFile(data): Observable<any> {
    return this.http.downloadReport(RestUrl.DOWNLOAD_ALL_ZIP_FILE, data);
  }

  getUserListByRoleIdAndDistrictId(userRoleId: any, districtId: any): Observable<any> {
    return this.http.get(RestUrl.USER_LIST_BY_ROLE_ID_AND_DISTRICT_ID + CommonService.encryptFunction(userRoleId) + '/' + CommonService.encryptFunction(districtId), false);
  }


  spGetSanctionTabCountForLbmGm(): Observable<any> {
    return this.http.get(RestUrl.SP_GET_SANCTION_TAB_COUNT_FOR_LBM_GM, false);
  }

  spGetSanctionListForLbmGm(data: any): Observable<any> {
    return this.http.post(RestUrl.SP_GET_SANCTION_LIST_FOR_LBM_GM, data);
  }

  getPreScreeningData(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_PRE_SCREENING_DETAILS + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false)
  }

  savePreScreeningData(data: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_PRE_SCREENING_DETAILS, data)
  }

  getPreSanctionData(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_PRE_SANCTION_DETAILS + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false)
  }
  savePreSanctionData(data: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_PRE_SANCTION_DETAILS, data)
  }

  getPreSanctionMemoData(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_PRE_SANCTION_MEMO_DETAILS + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false)
  }
  savePreSanctionMemoData(data: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_PRE_SANCTION_MEMO_DETAILS, data)
  }

  getSanctionPageStatus(applicationId: any): Observable<any> {
    return this.http.get(RestUrl.GET_SANCTION_REPORT_PAGE_STATUS + '/' + CommonService.encryptFunction(applicationId), false)
  }

  getBranchManagerRemarks(applicationId: any): Observable<any> {
    return this.http.get(RestUrl.GET_BRANCH_MANAGER_REMARKS + '/' + CommonService.encryptFunction(applicationId), false)
  }

  saveBranchManagerRemarks(data: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_BRANCH_MANAGER_REMARKS, data)
  }

  getSanctionLetterDetails(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_SANCTION_LETTER_DETAILS + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false);
  }

  saveSanctionLetterDetails(data: any): Observable<any> {
    return this.http.post(RestUrl.SAVE_SANCTION_LETTER_DETAILS, data);
  }
  saveOrUpdateSectionProposalStatus(data: any): Observable<any> {
    return this.http.post(RestUrl.UPDATE_SANCTION_PROPOSAL_STATUS, data);
  
  }

  downloadFileByProductDocumentMappingId(data): Observable<any> {
    return this.http.downloadReport(RestUrl.DOWNLOAD_FILE_BY_MAPPING_ID, data);
  }
  
  isTokenValid(): Observable<any> {
    return this.http.get(RestUrl.IS_TOKEN_VALID, false);
  }
  getSanctionReport(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_SANCTION_REPORT + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false);
  }

  getSanctionLetter(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_SANCTION_LETTER + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false);
  }
 
  getFioReport(borrowerProposalId: any, proposalMappingId: any): Observable<any> {
    return this.http.get(RestUrl.GET_FIO_REPORT + '/' + CommonService.encryptFunction(borrowerProposalId) + '/' + CommonService.encryptFunction(proposalMappingId), false);
 }

 spGetAgGridData(data): Observable<any> {
    return this.http.post(RestUrl.SP_GET_AG_GRID_DATA, data, true);
  }

  getFeedBackList(data): Observable<any> {
    return this.http.post(RestUrl.SP_GET_FEEDBACK_LIST, data, true);
  }

  getGetStatusForSA(data): Observable<any> {
    return this.http.post(RestUrl.GET_STATUS_LIST_FOR_SA, data, true);
  }

  getSanctionDetails(applicationId: any): Observable<any> {
    return this.http.get(RestUrl.GET_SANCTION_DETAILS + '/' + CommonService.encryptFunction(applicationId), false);
  }

  getDisbursementDetails(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_DISBURSEMENT_NOTE_DETAILS + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false);
  }

  getDisbursementNoteReport(applicationId: any, proposalId: any): Observable<any> {
    return this.http.get(RestUrl.GET_DISBURSEMENT_NOTE_REPORT + '/' + CommonService.encryptFunction(applicationId) + '/' + CommonService.encryptFunction(proposalId), false);
  }

  getUserDetailsList(data): Observable<any> {
    return this.http.post(RestUrl.GET_USER_DETAILS, data);
  }
  getCustomerRecord(data): Observable<any> {
    return this.http.post(RestUrl.GET_CUSTOMER_RECORD_LIST, data);
  }
  getCustomerDetails(data: { proposalId: any; }): Observable<any> {
    return this.http.post(RestUrl.GET_CUSTOMER_DETAILS, data);
  }
  getEligibleAndInEligibleResponse(data: { proposalId: any; applicationId: any; }): Observable<any> {
    return this.http.post(RestUrl.GET_ELIGIBLE_AND_IN_ELIGIBLE_RESPONSE, data);
  }
  getScoringCalculationsDetails(data: { applicationId: any; productId: any; }): Observable<any> {
    return this.http.post(RestUrl.GET_SCORING_CALCULATIONS_DETAILS, data);
  }
  getEligibilityCalculationsDetails(data: { applicationId: any; productId: any; }): Observable<any> {
    return this.http.post(RestUrl.GET_ELIGIBILITY_CALCULATIONS_DETAILS, data);
  }
  getAppProdMatchesData(data: { proposalId: any; applicationId: any; productId: any; }): Observable<any> {
    return this.http.post(RestUrl.GET_APP_PROD_MATCHES_DATA, data);
  }

}
