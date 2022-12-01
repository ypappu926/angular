import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbProgressbarModule, NgbTooltipModule, NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule } from 'ng2-charts';
import { UIModule } from '../shared/ui/ui.module';

import { TIICRoutingModule } from './tiic-routing.module';
import { TIICBulkUploadComponent } from './Applicant-details/tiic-bulk-upload/tiic-bulk-upload.component';
import { TIICStatusListComponent } from './Applicant-details/tiic-status-list/tiic-status-list.component';
import { TIICBankPartnerComponent } from './tiic-bank-partner/tiic-bank-partner.component';
import { TIICAddBankPartnerComponent } from './tiic-add-bank-partner/tiic-add-bank-partner.component';
import { TIICFieldInspectionListComponent } from './tiic-field-inspection-list/tiic-field-inspection-list.component';
import { TIICFieldInspectionFormComponent } from './tiic-field-inspection-form/tiic-field-inspection-form.component';
import { SharedModule } from '../shared/shared.module';
import { SetPasswordComponent } from './set-password/set-password.component';
import { BulkUploadReadInstructionComponent } from './bulk-upload-read-instruction/bulk-upload-read-instruction.component';
import { ValidationMessagesComponent } from 'src/app/CommoUtils/common-services/validation-message.component';
import { HOBODatafieldsComponent } from './Ho-Bo/ho-bo-datafields/ho-bo-datafields.component';
import { BODashboardListComponent } from './Ho-Bo/bo-dashboard-list/bo-dashboard-list.component';
import { BMFIOListViewComponent } from './BM-FIO/bm-fio-list-view/bm-fio-list-view.component';
import { BMFIOFormDetailsComponent } from './BM-FIO/bm-fio-form-details/bm-fio-form-details.component';
import { SAAdminUserListComponent } from './SuperAdmin/sa-admin-user-list/sa-admin-user-list.component';
import { SAAddAdminUsersComponent } from './SuperAdmin/sa-add-admin-users/sa-add-admin-users.component';
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

import { DragDropDirective } from 'src/app/CommoUtils/common-services/directives/drag-drop.directive';
import { CommonUserListComponent } from './Bank-User/common-user-list/common-user-list.component';
import { CommonUserCreateComponent } from './Bank-User/common-user-create/common-user-create.component';
import { BranchOfficeCreateComponent } from './Bank-User/branch-office-create/branch-office-create.component';
import { BranchOfficeListComponent } from './Bank-User/branch-office-list/branch-office-list.component';
import { HttpClientModule } from '@angular/common/http';
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
import { EligibilityModelComponent } from './Products-Scoring/eligibility-model/eligibility-model.component';
import { ProductTemplateComponent } from './product-template/product-template.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ScalingMatrixComponent } from './Products-Scoring/scaling-matrix/scaling-matrix.component';
import { ComProductListComponent } from './Products-Scoring/com-product-list/com-product-list.component';
import { AddressMasterComponent } from './address-master/address-master.component';
import { BMFIOSComLoanApplicationViewComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application-view/bmfios-com-loan-application-view.component';
import { BMFIOSComLoanApplicationComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application/bmfios-com-loan-application.component';
import { PreScreeningReportComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application-view/pre-screening-report/pre-screening-report.component';
import { PreSanctionReportComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application-view/pre-sanction-report/pre-sanction-report.component';
import { PreSanctionMemoComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application-view/pre-sanction-memo/pre-sanction-memo.component';
import { SactionLetterComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application-view/saction-letter/saction-letter.component';
import { ProposalBifurcationComponent } from './proposal-bifurcation/proposal-bifurcation.component';
import { CommitteeComLoanApplicationComponent } from './Committee/committee-com-loan-application/committee-com-loan-application.component';
import { BranchManagerRemarksComponent } from './BM-FIO/BM-Sanction/bmfios-com-loan-application-view/branch-manager-remarks/branch-manager-remarks.component';
import { BMFIOSDisbursmentCertificateComponent } from './BM-FIO/BM-Sanction/bmfios-disbursment-certificate/bmfios-disbursment-certificate.component';
import { BMFIOUserBulkUploadComponent } from './Bank-User/bm-fio-user-bulk-upload/bm-fio-user-bulk-upload.component';
import { AgGridComponent } from './ag-grid/ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { SAConsentLinkResendComponent } from './SuperAdmin/sa-consent-link-resend/sa-consent-link-resend.component';
import { CustomerRecordComponent } from './customer-record/customer-record.component';

@NgModule({
  declarations: [
    TIICBulkUploadComponent,
    TIICStatusListComponent,
    TIICBankPartnerComponent,
    TIICAddBankPartnerComponent,
    TIICFieldInspectionListComponent,
    TIICFieldInspectionFormComponent,
    SetPasswordComponent,
    BulkUploadReadInstructionComponent,
    ValidationMessagesComponent,
    HOBODatafieldsComponent,
    BODashboardListComponent,
    BMFIOListViewComponent,
    BMFIOFormDetailsComponent,
    SAAdminUserListComponent,
    SAAddAdminUsersComponent,
    SALeadBankManagersListComponent,
    SAAddLeadBankManagersComponent,
    SAGeneralManagersListComponent,
    SAAddGeneralManagersComponent,
    SAFieldInspectionOfficerComponent,
    SAAddFieldInspectionOfficerComponent,
    BUAllUserListComponent,
    BUAllOfficeListComponent,
    BUAddBranchOfficeManagerComponent,
    CommonUserListComponent,
    BUUserBulkUploadComponent,
    BUOfficeBulkUploadComponent,
    CommonUserCreateComponent,
    BranchOfficeCreateComponent,
    BranchOfficeListComponent,
    TIICApplicationStatusListComponent,
    CompletedESignComponent,
    FIOTaicoDICListComponent,
    // DragDropDirective
    ComProductListComponent,
    ComScoringListComponent,
    ScoringAddNewComponent,
    ProductAddNewComponent,
    ProductEditComponent,
    ProductViewComponent,
    ScoringEditComponent,
    ScoringViewComponent,
    SetupInterestRatesComponent,
    ProductTemplateComponent,
    EligibilityModelComponent,
    ScalingMatrixComponent,
    AddressMasterComponent,
    BMFIOSComLoanApplicationViewComponent,
    BMFIOSComLoanApplicationComponent,
    PreScreeningReportComponent,
    PreSanctionReportComponent,
    PreSanctionMemoComponent,
    SactionLetterComponent,
    ProposalBifurcationComponent,
    CommitteeComLoanApplicationComponent,
    BranchManagerRemarksComponent,
    BMFIOSDisbursmentCertificateComponent,
    BMFIOUserBulkUploadComponent,
    AgGridComponent,
    SupportDashboardComponent,
    SAConsentLinkResendComponent,
    CustomerRecordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgApexchartsModule,
    ChartsModule,
    NgbCollapseModule,
    NgSelectModule,
    UIModule,
    UiSwitchModule,
    NgbModule,
    TIICRoutingModule,
    SharedModule,
    // MaterialModule,
    AgGridModule.withComponents([AgGridComponent]),
  ]
})
export class TIICModule { }
