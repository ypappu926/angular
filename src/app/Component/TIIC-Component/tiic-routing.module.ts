import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TIICBulkUploadComponent } from './Applicant-details/tiic-bulk-upload/tiic-bulk-upload.component';
import { TIICStatusListComponent } from './Applicant-details/tiic-status-list/tiic-status-list.component';
import { TIICAddBankPartnerComponent } from './tiic-add-bank-partner/tiic-add-bank-partner.component';
import { TIICBankPartnerComponent } from './tiic-bank-partner/tiic-bank-partner.component';
import { TIICFieldInspectionListComponent } from './tiic-field-inspection-list/tiic-field-inspection-list.component';
import { TIICFieldInspectionFormComponent } from './tiic-field-inspection-form/tiic-field-inspection-form.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { BulkUploadReadInstructionComponent } from './bulk-upload-read-instruction/bulk-upload-read-instruction.component';
import { HOBODatafieldsComponent } from './Ho-Bo/ho-bo-datafields/ho-bo-datafields.component';
import { BODashboardListComponent } from './Ho-Bo/bo-dashboard-list/bo-dashboard-list.component';
import { BMFIOFormDetailsComponent } from './BM-FIO/bm-fio-form-details/bm-fio-form-details.component';
import { BMFIOListViewComponent } from './BM-FIO/bm-fio-list-view/bm-fio-list-view.component';
import { SAAddAdminUsersComponent } from './SuperAdmin/sa-add-admin-users/sa-add-admin-users.component';
import { SAAdminUserListComponent } from './SuperAdmin/sa-admin-user-list/sa-admin-user-list.component';
import { SALeadBankManagersListComponent } from './SuperAdmin/sa-lead-bank-managers-list/sa-lead-bank-managers-list.component';
import { SAAddLeadBankManagersComponent } from './SuperAdmin/sa-add-lead-bank-managers/sa-add-lead-bank-managers.component';
import { SAGeneralManagersListComponent } from './SuperAdmin/sa-general-managers-list/sa-general-managers-list.component';
import { SAAddGeneralManagersComponent } from './SuperAdmin/sa-add-general-managers/sa-add-general-managers.component';
import { SAFieldInspectionOfficerComponent } from './SuperAdmin/sa-field-inspection-officer/sa-field-inspection-officer.component';
import { SAAddFieldInspectionOfficerComponent } from './SuperAdmin/sa-add-field-inspection-officer/sa-add-field-inspection-officer.component';
import { BUAllUserListComponent } from './Bank-User/bu-all-user-list/bu-all-user-list.component';
import { BUAllOfficeListComponent } from './Bank-User/bu-all-office-list/bu-all-office-list.component';
import { BUAddBranchOfficeManagerComponent } from './Bank-User/bu-add-branch-office-manager/bu-add-branch-office-manager.component';
import { BUUserBulkUploadComponent } from './Bank-User/bu-user-bulk-upload/bu-user-bulk-upload.component';
import { BUOfficeBulkUploadComponent } from './Bank-User/bu-office-bulk-upload/bu-office-bulk-upload.component';
import { CommonUserListComponent } from './Bank-User/common-user-list/common-user-list.component';
import { CommonUserCreateComponent } from './Bank-User/common-user-create/common-user-create.component';
import { BranchOfficeListComponent } from './Bank-User/branch-office-list/branch-office-list.component';
import { BranchOfficeCreateComponent } from './Bank-User/branch-office-create/branch-office-create.component';
import { TIICApplicationStatusListComponent } from './Applicant-details/tiic-application-status-list/tiic-application-status-list.component';
import { CompletedESignComponent } from './BM-FIO/completed-e-sign/completed-e-sign.component';
import { FIOTaicoDICListComponent } from './BM-FIO/fio-taico-dic-list/fio-taico-dic-list.component';
import { ComScoringListComponent } from './Products-Scoring/com-scoring-list/com-scoring-list.component';
import { ProductAddNewComponent } from './Products-Scoring/product-add-new/product-add-new.component';
import { ProductEditComponent } from './Products-Scoring/product-edit/product-edit.component';
import { ProductViewComponent } from './Products-Scoring/product-view/product-view.component';
import { ScoringAddNewComponent } from './Products-Scoring/scoring-add-new/scoring-add-new.component';
import { ScoringEditComponent } from './Products-Scoring/scoring-edit/scoring-edit.component';
import { ScoringViewComponent } from './Products-Scoring/scoring-view/scoring-view.component';
import { SetupInterestRatesComponent } from './Products-Scoring/setup-interest-rates/setup-interest-rates.component';
import { ComProductListComponent } from './Products-Scoring/com-product-list/com-product-list.component';
import { BMFIOSComLoanApplicationComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application/bmfios-com-loan-application.component';
import { BMFIOSComLoanApplicationViewComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application-view/bmfios-com-loan-application-view.component';
import { ProposalBifurcationComponent } from './proposal-bifurcation/proposal-bifurcation.component';
import { CommitteeComLoanApplicationComponent } from './Committee/committee-com-loan-application/committee-com-loan-application.component';
import { BMFIOUserBulkUploadComponent } from './Bank-User/bm-fio-user-bulk-upload/bm-fio-user-bulk-upload.component';
import { AgGridComponent } from './ag-grid/ag-grid.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { SAConsentLinkResendComponent } from './SuperAdmin/sa-consent-link-resend/sa-consent-link-resend.component';
import { BMFIOSDisbursmentCertificateComponent } from './BM-FIO/BM-Sanction/bmfios-disbursment-certificate/bmfios-disbursment-certificate.component';
import { AccessGuard } from '../core/guards/access.guard';
import { CustomerRecordComponent } from './customer-record/customer-record.component';


const routes: Routes = [
  { path: '', redirectTo: '/TIIC/Status-list', pathMatch: 'full' },
  /* Common Routing Cont Start  */
  // { path: 'ChangePassword', component: SetPasswordComponent, data: { title: 'TamilNadu - Change Password Page' } },
  /* Common Routing Cont End  */

  /* Aplicant Details Pages Start */
  { path: 'Consent-Status', component: TIICStatusListComponent, data: { title: 'TamilNadu - Status List', type: 1, headerName: 'Status List' }, canActivate: [AccessGuard] },
  { path: 'Application-Status', component: TIICStatusListComponent, data: { title: 'TamilNadu - Application Status', type: 2, headerName: 'Application Status' }, canActivate: [AccessGuard] }, // TIICApplicationStatusListComponent
  { path: 'Bulk-Upload', component: TIICBulkUploadComponent, data: { title: 'TamilNadu - Bulk Upload' }, canActivate: [AccessGuard] },
  { path: 'ReadInstructions', component: BulkUploadReadInstructionComponent, data: { title: 'TamilNadu - Read Instructions' }, canActivate: [AccessGuard] },//
  { path: 'Com-DataFields', component: HOBODatafieldsComponent, data: { title: 'TamilNadu - HO - BO Data Fields' }, canActivate: [AccessGuard] },//
  /* Aplicant Details Pages End */

  /* Bank Partner Pages Start  */
  { path: 'Bank-Partner-List', component: TIICBankPartnerComponent, data: { title: 'TamilNadu - Bank Partner' }, canActivate: [AccessGuard] },//
  { path: 'Add-New-Bank-Partner', component: TIICAddBankPartnerComponent, data: { title: 'TamilNadu - Add New Bank Partner' }, canActivate: [AccessGuard] },//
  /* Bank Partner Pages End */

  /* Field Inspection & Branch Manager Pages Start */
  { path: 'FieldInspection-List', component: TIICFieldInspectionListComponent, data: { title: 'TamilNadu - Field Inspection List' }, canActivate: [AccessGuard] },//
  { path: 'FieldInspection-Form', component: TIICFieldInspectionFormComponent, data: { title: 'TamilNadu - Field Inspection Form' }, canActivate: [AccessGuard] },//

  { path: 'BMFIO-List', component: BMFIOListViewComponent, data: { title: 'TamilNadu - Branch Manager & Field Inspection  List' }, canActivate: [AccessGuard] },
  { path: 'BMFIO-Form', component: BMFIOFormDetailsComponent, data: { title: 'TamilNadu - Branch Manager & Field Inspection Form' }, canActivate: [AccessGuard] },//
  { path: 'FIOTAICODIC-List', component: FIOTaicoDICListComponent, data: { title: 'TamilNadu - Branch Manager & Field Inspection Form' }, canActivate: [AccessGuard] },//

  { path: 'ESignCompleted', component: CompletedESignComponent, data: { title: 'TamilNadu - Completed E-Sign ' }, canActivate: [AccessGuard] },//

  /* Branch User & Committee sanction flow New Component Pages Start */
  { path: 'BMFIOS-LoanApplication', component: BMFIOSComLoanApplicationComponent, data: { title: 'TamilNadu - Branch User Loan Application List' }, canActivate: [AccessGuard] },
  { path: 'BMFIOS-LoanApplicationView', component: BMFIOSComLoanApplicationViewComponent, data: { title: 'TamilNadu - Branch User Loan Application View' }, canActivate: [AccessGuard] },
  { path: 'Committee-LoanApplication', component: CommitteeComLoanApplicationComponent, data: { title: 'TamilNadu - Branch User Loan Application List' }, canActivate: [AccessGuard] },//
  /* Branch User sanction flow New Component Pages End */

  /* Field Inspection & Branch Manager Pages End */

  /* BO Routing List Start */
  { path: 'Dashboard-List', component: BODashboardListComponent, data: { title: 'TamilNadu - BO Dashboard List' }, canActivate: [AccessGuard] },
  /* BO Routing List End */

  /* Super Admin New Component Pages & Mobile View Done Start */
  { path: 'AdminUsers-List', component: SAAdminUserListComponent, data: { title: 'TamilNadu - Admin User List' }, canActivate: [AccessGuard] },//
  { path: 'Add-New-Admin-Users', component: SAAddAdminUsersComponent, data: { title: 'TamilNadu - Add New Admin Users' }, canActivate: [AccessGuard] },//
  { path: 'LeadBankManagers-List', component: SALeadBankManagersListComponent, data: { title: 'TamilNadu - Lead Bank Managers List' }, canActivate: [AccessGuard] },//
  { path: 'Add-New-Lead-Bank-Managers', component: SAAddLeadBankManagersComponent, data: { title: 'TamilNadu - Add New Lead Bank Managers' }, canActivate: [AccessGuard] },//
  { path: 'GeneralManagers-List', component: SAGeneralManagersListComponent, data: { title: 'TamilNadu - General Managers List' }, canActivate: [AccessGuard] },//
  { path: 'Add-New-General-Managers', component: SAAddGeneralManagersComponent, data: { title: 'TamilNadu - Add New General Managers' }, canActivate: [AccessGuard] },//
  { path: 'FieldInspectionOfficer-List', component: SAFieldInspectionOfficerComponent, data: { title: 'TamilNadu - Field Inspection Officer List' }, canActivate: [AccessGuard] },//
  { path: 'Add-New-Field-Inspection-Officer', component: SAAddFieldInspectionOfficerComponent, data: { title: 'TamilNadu - Add New Field Inspection Officer' }, canActivate: [AccessGuard] },//
  { path: 'resendLink', component: SAConsentLinkResendComponent, data: { title: 'TamilNadu - Consent Link Resend' }, canActivate: [AccessGuard] },//
  /* Super Admin New Component Pages & Mobile View Done End */

  /* Admin maker & Admin Checker New Component Pages Start */
  //  { path: 'AllUser-List', component:BUAllUserListComponent,data: { title: 'TamilNadu - All User List' }},
  { path: 'AllUser-List', component: CommonUserListComponent, data: { title: 'TamilNadu - All User List' }, canActivate: [AccessGuard] },
  { path: 'AllOffice-List', component: BranchOfficeListComponent, data: { title: 'TamilNadu - All Office List' }, canActivate: [AccessGuard] },
  { path: 'newUserCreate', component: CommonUserCreateComponent, data: { title: 'TamilNadu - Add New Branch & office Manageer' }, canActivate: [AccessGuard] },
  { path: 'newBranchCreate', component: BranchOfficeCreateComponent, data: { title: 'TamilNadu - Add New Branch & office Manageer' }, canActivate: [AccessGuard] }, //  for temp use only
  { path: 'BulkUpload-User', component: BUUserBulkUploadComponent, data: { title: 'TamilNadu - All User Bulk Upload' }, canActivate: [AccessGuard] },//
  { path: 'BulkUpload-Office', component: BUOfficeBulkUploadComponent, data: { title: 'TamilNadu - All Office Bulk Upload' }, canActivate: [AccessGuard] },//
  { path: 'BulkUpload-Fio', component: BMFIOUserBulkUploadComponent, data: { title: 'TamilNadu - All FIO User Bulk Upload' }, canActivate: [AccessGuard] },//

  /* Proposal Bifurcation Page Start */
  { path: 'ProposalBifurcation', component: ProposalBifurcationComponent, data: { title: 'TamilNadu - Proposal Bifurcation Page' }, canActivate: [AccessGuard] },//
  /* Proposal Bifurcation Page End */

  /* Admin maker & Admin Checker New Component Pages End */
  // For Product
  { path: 'Product-List', component: ComProductListComponent, data: { title: 'TamilNadu - Product List' }, canActivate: [AccessGuard] },
  { path: 'Product-New', component: ProductAddNewComponent, data: { title: 'TamilNadu - Product Add New' }, canActivate: [AccessGuard] },//
  { path: 'Product-Edit', component: ProductEditComponent, data: { title: 'TamilNadu -  Product Edit' }, canActivate: [AccessGuard] },//
  { path: 'Product-View', component: ProductViewComponent, data: { title: 'TamilNadu - Product View' }, canActivate: [AccessGuard] },//
  // For Scoring
  { path: 'Scoring-List', component: ComScoringListComponent, data: { title: 'TamilNadu - Scoring List' }, canActivate: [AccessGuard] },
  { path: 'Scoring-New', component: ScoringAddNewComponent, data: { title: 'TamilNadu - Scoring Add New' }, canActivate: [AccessGuard] }, //
  { path: 'Scoring-Edit/:scoringId/:type', component: ScoringEditComponent, data: { title: 'TamilNadu - Scoring Edit' }, canActivate: [AccessGuard] },// 
  { path: 'Scoring-View/:scoringId/:type/:tab', component: ScoringViewComponent, data: { title: 'TamilNadu - Scoring View' }, canActivate: [AccessGuard] },//
  // For Interest Page
  { path: 'Base-Rate-Setup', component: SetupInterestRatesComponent, data: { title: 'TamilNadu - Setup Interest Rate' }, canActivate: [AccessGuard] },
  { path: 'agGridProposalData', component: AgGridComponent, data: { title: 'Report Dashboard' }, canActivate: [AccessGuard] },
  { path: 'supportDashboard', component: SupportDashboardComponent, data: { title: 'Support Dashboard' }, canActivate: [AccessGuard] },
  { path: 'DisbursmentCertificate', component: BMFIOSDisbursmentCertificateComponent, data: { title: 'TamilNadu - Disbursment Certificate' }, canActivate: [AccessGuard] }, //

  /* Admin maker & Admin Checker New Component Pages End */
  { path: 'CustomerRecord', component: CustomerRecordComponent, data: { title: 'Customer_Record' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TIICRoutingModule { }
