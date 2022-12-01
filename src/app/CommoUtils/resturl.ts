import { Constants } from "./constants";

const baseUrl = Constants.LOCATION_URL;
// const tempBaseUrl = 'http://localhost:9297';
// const tempBaseUrl = 'http://localhost:8083';
// const tempMgmt = 'http://localhost:8383';

// const tempUserMgmt = 'http://localhost:8383';

// const _dmsBaseUrl = 'http://localhost:8181';
// const proposalBaseUrl = 'http://localhost:9298';

const IS_GATEWAY_ON = true;
const apiGatewayUrl = baseUrl;// + '/gateway'; // baseUrl
const userUrl = apiGatewayUrl + '/user';
const userManagementUrl = apiGatewayUrl + '/user-management';
const workflow = apiGatewayUrl + '/workflow/';
const profileUrl = apiGatewayUrl + '/loans/profile';
const itrUrl = apiGatewayUrl + '/itr';
const analyzerUrl = apiGatewayUrl + '/analyzer';
const dmsUrl = apiGatewayUrl + '/dms';
const notificationUrl = apiGatewayUrl + '/notification';
const oneFormUrl = apiGatewayUrl + '/oneform';
const loansUrl = apiGatewayUrl + '/loans';
const productUrl = apiGatewayUrl + '/product';
const scoringUrl = apiGatewayUrl + '/scoring';
const proposalMsme = apiGatewayUrl + '/proposal/msme';
const adminPanelUrl = baseUrl + '/admin-panel';
// const adminPanelUrl = tempBaseUrl + '/admin-panel';

export const RestUrl = {
  ACCESS_TOKEN: userUrl + '/accessToken',
  LOGOUT_USER: userUrl + '/logoutUser',
  GET_VALIDATIONS: userUrl + '/getAllValidations/',
  GET_MENU_FOR_BANKER: userUrl + '/getMenuForBanker',
  GET_ACCESS_PATHS: userUrl + '/getAccessPaths',
  IS_TOKEN_VALID: userUrl + '/isTokenValid',
  //TN-APIS
  LOGIN: userUrl + '/login',
  GET_ALL_ORG_LIST: userUrl + '/org/getAllOrgList',
  GET_ALL_BY_ORG_TYPE: userUrl + '/org/getAllByOrgType',
  CHANGE_PASSWORD_AFTER_LOGIN: userUrl + '/set/passwordAfterLogin',
  UPDATED_USER_ACTIVE_FLAG: userUrl + '/updatedUserActiveFlag',
  GET_DASHBOARD_DATA_BY_USER_ID: userUrl + '/common/getDashBoardDataByUserId',
  // GET_PRODUCT_LIST_BY_USER_ID: userUrl + '/common/getProductListByUserId',
  GET_PRODUCT_LIST_BY_USER_ID: userUrl + '/userSchemeMapping/getSchemeListByUserId',

  // ======================================USER-MANAGEMENT======================================

  GET_STATUS_LIST: userManagementUrl + '/dashboard/getStatusList',
  // GET_STATUS_LIST_FOR_SA: userManagementUrl + '/dashboard/getStatusListForSA',
  GET_STATUS_LIST_FOR_SA: userManagementUrl + '/dashboard/getStatusListForSA',
  GET_STATUS_TAB_COUNT: userManagementUrl + '/dashboard/getStatusTabCount',
  GET_ALL_USERS_LIST: userManagementUrl + '/getUserList',
  USER_IS_LOCKED: userManagementUrl + '/userIsLocked',
  USER_RESET_PWD: userManagementUrl + '/userResetPassword',

  CHECK_EMAIL_EXIST: userManagementUrl + '/checkEmailExist',
  CREATE_OR_UPDATE_USER: userManagementUrl + '/createOrUpdateUser',
  GET_USER_DETAILS_BY_USER_ID: userManagementUrl + "/getUserDetailByUserId",
  UPLOAD_BORROWER_CONSENT: userManagementUrl + '/excelUpload', // USING BATCH
  // UPLOAD_BORROWER_CONSENT: userManagementUrl + '/excelUpload/existing', // WITHOUT BATCH

  GET_FIO_STATUS_LIST: userManagementUrl + '/dashboard/getFioStatusList',
  // GET_FIO_STATUS_TAB_COUNT: userManagementUrl + '/dashboard/getFioStatusTabCount',
  GET_FIO_STATUS_TAB_COUNT: userManagementUrl + '/dashboard/fo/getStatusCount',

  //----------------      BRANCH CONTROLLER ----------------------
  SAVE_BRANCH_DETAILS: userManagementUrl + '/branch/saveBranchDetail',
  GET_BRANCH_LIST: userManagementUrl + '/branch/getBranchListByOrgId',
  SP_GET_BRANCH_LIST: userManagementUrl + '/branch/spGetBranchList',
  CREATE_OR_UPDATE_BRANCH_DETAILS: userManagementUrl + '/branch/createOrUpdateBranchDetails',
  GET_BRANCH_DETAILS_BY_BRANCH_ID: userManagementUrl + '/branch/getBranchDetailsByBranchId',


  BULK_USER_CREATION: userManagementUrl + '/bulk/bulkUserCreation',
  GET_FILE_ENTRY_FOR_BULK_USERS: userManagementUrl + '/bulk/getFileEntryForBulkUsers',
  GET_FILE_ENTRY_LIST: userManagementUrl + '/bulk/getFileEntryList',

  // BM FIO BULK UPLOAD
  BULK_FIO_USER_CREATION: userManagementUrl + '/bulk/fio/creation',
  GET_FIO_FILE_ENTRY_FOR_BULK_USERS: userManagementUrl + '/bulk/fio/getAllFIOList',
  GET_FIO_FILE_ENTRY_LIST: userManagementUrl + '/bulk/fio/getAllFIOEntryList',
  GET_COMMON_LIST: userManagementUrl + '/common/getCommonList',

  BULK_BRANCH_OFC_CREATION: userManagementUrl + '/bulk/branch/office/creation',
  GET_FILE_ENTRY_FOR_BULK_BRANCH_OFC: userManagementUrl + '/bulk/branch/getFileEntryForBulkBranch',
  GET_FILE_ENTRY_LIST_BULK_BRANCH_OFC: userManagementUrl + '/bulk/branch/getFileEntryListBranchOfc',


  //UPLOAD_BORROWER_CONSENT: userManagementUrl + '/excelUpload', //USING BATCH ,
  //UPLOAD_BORROWER_CONSENT: userManagementUrl + '/excelUpload/existing', // WITHOUT BATCH
  BORROWER_CONSENT_FILE_ENTRY_COUNT: userManagementUrl + '/batch/getUserFileEntryCount',
  UPDATE_IS_LOCKED: userManagementUrl + '/updateIsLocked',

  GET_USER_IMPORT_EXCEL_LIST: userManagementUrl + '/consentListImportExcel',
  GET_BULK_CONSENT_USER_LIST: userManagementUrl + '/getFileEntries',

  PROCEED_AFTER_UPLOAD: userManagementUrl + '/sentNotification',

  LINK_EXPIRED_DAYS: userManagementUrl + '/getLinkExpiredDays',

  UPDATE_NOTIFICATION_STATUS: userManagementUrl + '/updateNotificationStatus',
  UPDATE_MULTIPLE_NOTIFICATION_STATUS: userManagementUrl + '/updateMultipleNotificationStatus',

  GET_FO_STATUS_LIST: userManagementUrl + '/dashboard/fo/getStatusView',
  GET_FO_STATUS_COUNT: userManagementUrl + '/dashboard/fo/getStatusCount',
  CREATE_HO_BO_FIO_WORKFLOW: workflow + 'create_job_for_masters',
  GET_ACTIVE_STEPS: workflow + 'get_active_step_for_masters',
  SAVE_BORROWER_DATA: userManagementUrl + '/saveBorrowerData',
  SAVE_APPLICANT_DETAILS: userManagementUrl + '/saveApplicantDetails',
  SAVE_FIELDS_FOR_HO_USER: userManagementUrl + '/saveFieldForHoUser',
  GET_BO_DETAILS: userManagementUrl + '/getBoDetailsByOrgId/',
  GET_FIELDS_DETAILS: userManagementUrl + '/getFieldDetails/',
  GET_BO_STATUS_COUNT: userManagementUrl + '/dashboard/bo/getStatusCount',
  GET_BO_STATUS_LIST: userManagementUrl + '/dashboard/bo/getStatusView',

  // One Form
  GETCITYLISTBYSTATEID: oneFormUrl + '/master/getCityList/cityByState/',
  GET_LIST_BY_CLASSES: oneFormUrl + '/master/getListByClasses',
  GET_INDUSTRY_LIST: oneFormUrl + '/industrySector/getIndustryList',
  GET_APPLICANT_DETAILS: userManagementUrl + '/getApplicantDetails',
  GET_INDUSTRY_PRODUCT_LIST: oneFormUrl + '/industrySector/getIndustryProductListById/',
  UPDATE_PROPOSAL_STATUS: userManagementUrl + '/updateProposalStatus',
  UPDATE_WORKFLOW: userManagementUrl + '/updateWorkflow',
  SANCTION_UPDATE_WORKFLOW: userManagementUrl + '/common/updateSanctionWorkflow',
  GET_BLOCK_BY_DISTRICT_ID: userManagementUrl + '/common/getBlockDistrictMappingList',

  // User Management    ---->  Common
  CREATE_UPDATE_USER: userManagementUrl + '/common/createOrUpdateUser',
  GET_USER_OBJECT_BY_USER_ID: userManagementUrl + "/common/getUserDetailByUserId",
  GET_DISTRICT_MASTER_LIST: userManagementUrl + '/common/getDistrictMasterList',
  GET_PINCODE_MASTER_LIST: userManagementUrl + '/common/getPincodeMasterList',
  GET_BRANCH_LIST_BY_DISTRICT_ID: userManagementUrl + '/common/getBranchListByDistrictId',
  GET_DISTRICT_MASTER_LIST_BY_PINCODE_ID: userManagementUrl + '/common/getDistrictMasterListByPincodeId',
  GET_ALL_PINCODE_MASTER_LIST: userManagementUrl + '/common/getAllPincodeMasterList',
  GET_FIO_CREATED_PINCODE_MASTER_LIST: userManagementUrl + '/common/fioCreatedPincodeList',
  GET_PINCODE_BY_DISTRICT_IDS: userManagementUrl + '/common/getPincodeByDistrictIds',
  GET_BRANCH_DISTRICT_MAPPING_LIST: userManagementUrl + '/common/getBranchDistrictMappingList',
  GET_USER_TAB_DETAILS: userManagementUrl + '/common/getUserTabDetails',
  GET_FIO_USERS_LIST: userManagementUrl + '/common/getFioUserList/',
  TRANSFER_PROPOSAL: userManagementUrl + '/fio/transferProposal',
  ENABLE_TRANSFER_PROPOSAL: userManagementUrl + '/common/addOrgUpdateAdminConfig',
  GET_ADMIN_CONFIG_DETAIL: userManagementUrl + '/common/getSuperAdminConfig',

  //PROFILE
  SAVE_PROFILE_DETAILS: profileUrl + '/saveConsentProfile',
  GET_PROFILE_VERSIONS: profileUrl + '/getProfileVersionDetails/',
  // profile pan update api
  UPDATE_PROFILE_PAN: loansUrl + '/profile/panUpdate',

  //ITR
  GET_ITR_DETAILS: itrUrl + '/getUpdateDate/',
  ITR_UPLOAD: itrUrl + '/upload_itr_xml', // upload ITR Files

  //BANK STATEMENT
  BANK_LIST: analyzerUrl + '/common/getBankList',
  BANK_STATEMENT_UPLOAD: analyzerUrl + '/common/uploadStatementForBanker',
  GET_BANK_STATEMENT_LIST: analyzerUrl + '/common/getStatementList',
  GET_BANK_LIST_FROM_ITR: itrUrl + "/getBankDetails/",
  GET_COMBINE_BANK_STATEMENT_LIST: analyzerUrl + "/common/getCombineBankStatmentList",
  PROCEED_BANK_STATEMENT: analyzerUrl + '/common/proceed_bank_statement',
  CHECK_MISSING_MONTHS: analyzerUrl + '/common/checkMissingMonth',
  CHECK_MISSING_MONTHS_BY_PERFIOUS_ID: analyzerUrl + '/common/checkMissingMonthByPerfiousId',
  CHECK_STATUS_REPORT: analyzerUrl + '/common/checkMissingMonth',
  IS_REPORT_GENERATED: analyzerUrl + '/netbanking/isReportGenerated',
  GET_BS_MASTER_ID: analyzerUrl + '/common/getBsMasterId',
  IS_BANK_STATEMENT_VALID: analyzerUrl + '/common/isBankStatementValid',
  IS_BANK_STATEMENT_VALID_OR_NOT: analyzerUrl + '/common/isBankStatementValidOrNot',
  CHECK_GST_VALIDATION: analyzerUrl + '/common/checkGSTValidation',
  SAVE_GST_CONSENT: analyzerUrl + '/common/saveGstConsent',
  SAVE_RENEWAL_AFFECTED: analyzerUrl + '/common/saveRenewalAffected',
  GET_TO_UPLOAD_MONTH_DETAILS: analyzerUrl + '/common/getToUploadMonthDetails',
  CHECK_IS_BS_VALID_FOR_FEDERAL: analyzerUrl + '/common/checkIsBSValidForFederal',
  UPDATE_ACC_TYPE_ID: analyzerUrl + '/common/updateAccountType',
  INACTIVE_BANK_STATEMENT: analyzerUrl + '/common/inactiveBankStatement',

  //LOANS
  CREATE_LOAN: loansUrl + '/loans/create',

  //Scoring
  SCORING_COUNT: scoringUrl + '/getScoringCounts',
  SCORING_COPY_LIST: scoringUrl + '/getScoringListForCopy',
  SAVE_SCORING_MODEL: scoringUrl + '/createScoringModelTemp',
  GET_SCORING_MODEL: scoringUrl + '/getScoringModel/',
  APPROVE_SCORING_MODEL: scoringUrl + '/approveScoring/',
  SCORING_LIST: scoringUrl + '/getScoringList/',
  SAVE_SCORING_PARAMETERS: scoringUrl + '/saveScoringParameters',
  SAVE_SCORING_PARAMETERS_MAPPING: scoringUrl + '/saveScoringParameterMapping',
  UPDATE_SCORING_PARAMETER: scoringUrl + '/updateFields/',
  INACTIVE_SCORING_MODEL: scoringUrl + '/updateInActiveScoring/',
  SEND_INACTIVE_SCORING_MODEL_FOR_CHECKER: scoringUrl + '/sendInActiveorActiveScoringforchecker/',
  SEND_ACTIVATE_SCORING_MODEL_FOR_CHECKER: scoringUrl + '/sendActivateScoringforchecker/',
  DELETE_SCORING_MODEL: scoringUrl + '/deleteScoringModel/',
  UPDATE_STATUS_SCORING_MODEL: scoringUrl + '/updateScoringStatus/',
  GET_SCORING_DATA: scoringUrl + '/getScoringData',
  GET_EXISTING_SCORING_COUNT: scoringUrl + '/getExistingScoringCount',
  GET_SCORING_MODEL_POPUP: scoringUrl + '/getScoringParametersForPopup/',
  PRODUCT_BY_SCORE_ID: productUrl + '/getProductByScoringId/',
  GET_SCORNG_CONFIG_PARA: scoringUrl + '/getScoringConfignPara/',

  GET_SCORING_UPDATED_DETAILS: scoringUrl + '/getScoringUpdateDetails/',


  //product
  GET_SUB_FIELD: productUrl + "/getfieldsub",
  SAVE_TMP_PRODUCT: productUrl + "/temp/save",
  GET_TEMP_ALL_PRODUCT: productUrl + "/temp/get",
  GET_ALL_PRODUCT: productUrl + "/getAll/",
  GET_ALL_ACTIVE_PRODUCT: productUrl + "/temp/getactive",
  GET_TMP_PRODUCT_BY_ID: productUrl + "/temp/get/",
  GET_PRODUCT_FIELD_BY_ID: productUrl + "/temp/getprodfield/",
  GET_FIELDS: productUrl + "/temp/getprodonlyfield/",
  SAVE_PROD_FIELDS: productUrl + "/temp/addprodfield",
  SAVE_SUB_PROD_FIELD: productUrl + "/temp/addprodsubfield",
  REMOVE_PRODUCT: productUrl + "/temp/remove",
  SAVE_STATE_AND_CITY_TMP: productUrl + "/temp/saveStateAndCityTemp",
  GET_GEOGRAPHICAL_DETAIL: productUrl + "/temp/getGeographicalDetail/",
  GET_PRODUCT_COUNT_BY_STATUS: productUrl + '/temp/getProductCounts/',



  GET_PRODUCT_VIEW_DATA: productUrl + "/temp/getProdViewData/",
  SAVE_SCALING_MATRIX: productUrl + "/scaling/saveScalingMatrix",
  GET_SCALING_MATRIX_BY_PRODUCT_ID: productUrl + "/scaling/getScalingMatrixByProductId",
  GET_SCALING_MATRIX_MASTER_BY_PRODUCT_ID: productUrl + "/scaling/getScalingMatrixMasterByProductId",
  GET_CURRENT_BASE_RATE: productUrl + "/baseRate/getCurrentEffectiveBaseRate",
  GET_TO_BE_ACTIVE_BASE_RATE: productUrl + "/baseRate/getToBeEffectiveBaseRate",
  GET_SCORING_MASTER_LIST: scoringUrl + '/getScoringMasterList/',
  GET_APPROVAL_FLAG: productUrl + '/temp/getApprovalFlag/',
  GET_PRODUCT_CONFIG_PARA: productUrl + '/temp/getProductConfignPara/',

  GET_INDUSTRY_DETAIL: baseUrl + '/oneform/industrySector/getIndustryList',
  GET_SECTOR_DETAIL: baseUrl + '/oneform/industrySector/getSectorList/',
  GET_SUB_SECTOR_DETAIL: baseUrl + '/oneform/industrySector/getSubSectorList/',
  GET_SECTOR_DETAIL_LIST: baseUrl + '/oneform/industrySector/getSectorListByIndustry',
  GET_SUB_SECTOR_DETAIL_LIST: baseUrl + '/oneform/industrySector/getSubSectorListBySector',
  GET_SCALING_CONFIG: productUrl + "/scaling/getScalingConfigByProductId",


  // master
  GET_FIELDS_FROM_MASATER: productUrl + "/getprodonlyfield/",
  GET_PRODUCT_FIELD_BY_ID_FROM_MASTER: productUrl + "/getprodfield/",
  GET_PRODUCT_BY_ID: productUrl + "/get/",
  GET_TEMP_PROD_ID_BY_ID: productUrl + "/getTempProductIdById/",
  GET_PRODUCT_LIST_BY_STATUS_ID: productUrl + '/temp/getProductListByStatusId/',
  GET_PRODUCT_MASTER_VIEW_DATA: productUrl + "/getProdViewData/",
  GET_INACTIVE_PRODUCT: productUrl + '/updateInActiveProduct/',
  //workflow
  CREATE_JOB: workflow + 'create_job_for_masters',
  SEND_FOR_APPROVAL: productUrl + '/temp/sendToChecker',
  CHECK_PRODUCT_EDITABLE: productUrl + '/temp/getProductIsEditable/',
  // eligibility model start
  SAVE_ELIGIBILITY_MODEL: productUrl + '/eligibility/saveEligibilityModel',
  GET_ELIGIBILITY_BY_PRODUCTID: productUrl + '/eligibility/getEligibilityByProductId/',
  SEND_ELIGIBILITY_FOR_APPROVAL: productUrl + '/eligibility/sendEligibilityForApproval',
  GET_ELIGIBILITY_MODEL_MASTER_BY_ID: productUrl + '/eligibility/getEligibilityModelMasterById/',
  LIST_BY_CLASS: oneFormUrl + '/getListByClasses',

  // base-rate-setup
  GET_JOB_ID: productUrl + '/baseRate/getJobId',
  GET_ACTIVE_STEPS_FOR_BASE_RATE: productUrl + '/baseRate/getActiveStepForMaster/',
  UPDATE_WORKFLOW_JOB: productUrl + '/baseRate/updateJob',
  GET_BASE_RATE_DETAILS: productUrl + '/baseRate/getBaseRateDetails',
  GET_ALL_BASE_RATE_DETAILS: productUrl + '/baseRate/getAllBaseRateDetails',
  GET_STATE_LGD_LIST: oneFormUrl + '/lgd/get/states',
  GET_DISTRICT_LIST: oneFormUrl + '/lgd/get/districts',
  GET_SUB_DISTRICT_LIST: oneFormUrl + '/lgd/get/subdistricts',
  GET_VILLAGE_LIST: oneFormUrl + '/lgd/get/village',
  GET_BLOCK_BY_DISTRICT: oneFormUrl + '/lgd/get/blocksbydistrict',
  GET_BLOCK_BY_VILLAGE: oneFormUrl + '/lgd/get/blocksbyvillage',

  GET_DISTRICT_LIST_BY_STATE_LIST: oneFormUrl + '/lgd/get/districtsByStateList',
  STATE_LIST: oneFormUrl + '/getStateListByCountryId/',
  CITY_LIST: oneFormUrl + '/getCityListByStateIdListId/',
  SUBSIDY_STATE_LIST: oneFormUrl + '/getStateListByCountry/',
  GET_BM_STATUS_TAB_COUNT: userManagementUrl + '/dashboard/branchmanager/getStatusCount',
  GET_BM_STATUS_LIST: userManagementUrl + '/dashboard/branchmanager/getStatusList',

  GET_APPLICANT_DETAIL: userManagementUrl + '/fio/getApplicantDetails',
  SAVE_APPLICANT_DETAIL: userManagementUrl + '/fio/saveOrUpdate',
  UPDATE_FIO_RIGHTS: userManagementUrl + '/updateProposalFioMapping',
  UPDATE_PROPOSAL_STAUTS: userManagementUrl + '/fio/updateApplicationStatus',

  // proposal view API
  SP_GET_SANCTION_TAB_COUNT: proposalMsme + '/msmeProposal/spGetSanctionTabCount',
  SP_GET_SANCTION_LIST: proposalMsme + '/msmeProposal/spGetSanctionList',
  GET_MSME_PROPOSAL_DETAIL: proposalMsme + '/msmeProposal/getMsmeProposalDetails',
  // GET_MSME_PROPOSAL_DETAIL:'http://localhost:9298/proposal/msme/msmeProposal/getMsmeProposalDetails',
  GET_APPLICANT_DETAILS_PROPOSAL: proposalMsme + '/msmeProposal/getApplicantdetails',
  GET_BUSINESS_DETAILS: proposalMsme + "/businessDetails/search/findByApplicationIdAndIsActive",
  GET_LIST_BY_CLASS: oneFormUrl + '/master/getListByClasses',
  GET_MSME_CAM_REPORT: loansUrl + '/getCamReport',
  GET_MSME_APPLICATION_FORM: loansUrl + '/applicationForm/getApplicationForm',
  DOWNLOAD_ALL_ZIP_FILE: dmsUrl + "/downloadDocZip",
  DOWNLOAD_FILE_BY_MAPPING_ID: dmsUrl + "/downloadDocumentByProductDocumentMappingId",
  USER_LIST_BY_ROLE_ID_AND_DISTRICT_ID: userManagementUrl + '/spGetUserListByRoleIdDistrictId/',
  SP_GET_SANCTION_TAB_COUNT_FOR_LBM_GM: proposalMsme + '/msmeProposal/spGetSanctionTabCountForLbmGm',
  SP_GET_SANCTION_LIST_FOR_LBM_GM: proposalMsme + '/msmeProposal/spGetSanctionListForLbmGm',
  UPDATE_SANCTION_PROPOSAL_STATUS: proposalMsme + '/msmeProposal/updateProposalStatus',
  GET_SANCTION_DETAILS: proposalMsme + '/msmeProposal/getSanctionDetails',



  // SANCTION REPORT API
  GET_PRE_SCREENING_DETAILS: proposalMsme + "/sanctionReport/preScreening/get",
  SAVE_PRE_SCREENING_DETAILS: proposalMsme + "/sanctionReport/preScreening/saveOrUpdate",
  GET_PRE_SANCTION_DETAILS: proposalMsme + "/sanctionReport/preSanction/get",
  SAVE_PRE_SANCTION_DETAILS: proposalMsme + "/sanctionReport/preSanction/saveOrUpdate",
  GET_PRE_SANCTION_MEMO_DETAILS: proposalMsme + "/sanctionReport/bankSanction/get",
  SAVE_PRE_SANCTION_MEMO_DETAILS: proposalMsme + "/sanctionReport/bankSanction/saveOrUpdate",
  GET_SANCTION_REPORT_PAGE_STATUS: proposalMsme + "/sanctionReport/PageStatus/get",
  SAVE_BRANCH_MANAGER_REMARKS: proposalMsme + "/sanctionReport/bankManagerRemarks/saveBankManagerRemarks",
  GET_BRANCH_MANAGER_REMARKS: proposalMsme + "/sanctionReport/bankManagerRemarks/getBankManagerRemarks",
  GET_SANCTION_LETTER_DETAILS: proposalMsme + "/sanctionReport/sanctionLetter/get",
  SAVE_SANCTION_LETTER_DETAILS: proposalMsme + "/sanctionReport/sanctionLetter/saveOrUpdate",


  //  DOWNLOAD SANCTION REPORT-LETTER AND FIO REPORT
  GET_SANCTION_REPORT: proposalMsme + "/getSanctionReport",
  GET_SANCTION_LETTER: proposalMsme + "/getSanctionLetter",
  GET_FIO_REPORT: loansUrl + '/getFioReport',

  // use For Aggrid Report
  SP_GET_AG_GRID_DATA: adminPanelUrl + '/admin/spGetAgGridData',
  SP_GET_FEEDBACK_LIST: userManagementUrl + '/common/spGetFeedBackList',

  //disbursement note
  GET_DISBURSEMENT_NOTE_DETAILS: loansUrl + '/getDisbursalDetails',
  GET_DISBURSEMENT_NOTE_REPORT: loansUrl + '/getDisbursalNote',

  // customer record details
  GET_USER_DETAILS: adminPanelUrl + '/admin/spUserDetails',
  GET_USER_PERSONAL_DETAILS: adminPanelUrl + '/admin/spUserPersonalDetails',
  GET_CUSTOMER_RECORD_LIST: adminPanelUrl + '/admin/spGetCustomerRecord',
  GET_CUSTOMER_DETAILS: adminPanelUrl + '/admin/spGetCustomerDetails',
  GET_ELIGIBLE_AND_IN_ELIGIBLE_RESPONSE: adminPanelUrl + '/admin/spGetCustomerEligibleAndInEligibleResponse',
  GET_ELIGIBILITY_CALCULATIONS_DETAILS: adminPanelUrl + '/admin/spGetCustomerEligibilityCalculations',
  GET_SCORING_CALCULATIONS_DETAILS: adminPanelUrl + '/admin/spGetCustomerScoringCalculations',
  GET_APP_PROD_MATCHES_DATA: adminPanelUrl + '/admin/spGetCustomerAppProdMatchesData',
};
