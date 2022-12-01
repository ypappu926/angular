import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadSucessFullyPopupComponent } from './upload-sucess-fully-popup/upload-sucess-fully-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule, NgbDatepickerModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgOtpInputModule } from 'ng-otp-input';
import { DownloadTsvPopupComponent } from './TIIC-Checker-TSV/download-tsv-popup/download-tsv-popup.component';
import { HoldTsvPopupComponent } from './TIIC-Checker-TSV/hold-tsv-popup/hold-tsv-popup.component';
import { RejectTsvPopupComponent } from './TIIC-Checker-TSV/reject-tsv-popup/reject-tsv-popup.component';
import { SanctionTsvPopupComponent } from './TIIC-Checker-TSV/sanction-tsv-popup/sanction-tsv-popup.component';
import { TransferTsvPopupComponent } from './TIIC-Checker-TSV/transfer-tsv-popup/transfer-tsv-popup.component';
import { BOApplicationSubmitPopupComponent } from './HO-BO/bo-application-submit-popup/bo-application-submit-popup.component';
import { BMFIORejectComponent } from './BM-FIO/bm-fio-reject/bm-fio-reject.component';
import { BMFIOApproveComponent } from './BM-FIO/bm-fio-approve/bm-fio-approve.component';
import { BMFIOTransferProposalComponent } from './BM-FIO/bm-fio-transfer-proposal/bm-fio-transfer-proposal.component';
import { BMFIOReasonComponent } from './BM-FIO/bm-fio-reason/bm-fio-reason.component';
import { BMFIOCommonProposalComponent } from './BM-FIO/bm-fio-common-proposal/bm-fio-common-proposal.component';
import { BMFIONegativeComponent } from './BM-FIO/bm-fio-negative/bm-fio-negative.component';
import { BMFIOPositiveComponent } from './BM-FIO/bm-fio-positive/bm-fio-positive.component';
import { BUUserOfficeReadInstructionComponent } from './bu-user-office-read-instruction/bu-user-office-read-instruction.component';
import { CommonLockUserComponent } from './common-lock-user/common-lock-user.component';
import { CommonResetPasswordComponent } from './common-reset-password/common-reset-password.component';
import { ComConfimConfigurationComponent } from './Product-Scoring/com-confim-configuration/com-confim-configuration.component';
import { ComDeletePopupComponent } from './Product-Scoring/com-delete-popup/com-delete-popup.component';
import { ComIndustrySectorPopupComponent } from './Product-Scoring/com-industry-sector-popup/com-industry-sector-popup.component';
import { ComREPOMCLRComponent } from './Product-Scoring/com-repo-mclr/com-repo-mclr.component';
import { ComViewProductConfigurationComponent } from './Product-Scoring/com-view-product-configuration/com-view-product-configuration.component';
import { ComViewScoringConfigurationComponent } from './Product-Scoring/com-view-scoring-configuration/com-view-scoring-configuration.component';
import { GeographicalAreasPopupComponent } from './Product-Scoring/geographical-areas-popup/geographical-areas-popup.component';
import { ProductCommonComponent } from './Product-Scoring/product-common/product-common.component';
import { ProductParametersComponent } from './Product-Scoring/product-parameters/product-parameters.component';
import { ScoringCommonComponent } from './Product-Scoring/scoring-common/scoring-common.component';
import { ProductScoringViewComponent } from './Product-Scoring/product-scoring-view/product-scoring-view.component';
import { ScoringParametersComponent } from './Product-Scoring/scoring-parameters/scoring-parameters.component';
import { SharedModule } from '../Component/shared/shared.module';
import { UnsavePopupComponent } from './unsave-popup/unsave-popup.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { ConfimScoringConfigurationComponent } from './Product-Scoring/confim-scoring-configuration/confim-scoring-configuration.component';
import { BMFIOSSendForApprovedComponent } from './BM-FIO/bmfios-send-for-approved/bmfios-send-for-approved.component';
import { BmfiosGiveRecommedationComponent } from './BM-FIO/bmfios-give-recommedation/bmfios-give-recommedation.component';
import { ProposalBifurcationPopupComponent } from './proposal-bifurcation-popup/proposal-bifurcation-popup.component';
import { ProposalBifurcationCommonPopupComponent } from './proposal-bifurcation-common-popup/proposal-bifurcation-common-popup.component';
import { CommitteBranchTransferPopupComponent } from './BM-FIO/committe-branch-transfer-popup/committe-branch-transfer-popup.component';
import { BMFIOSSanctionProposalComponent } from './BM-FIO/bmfios-sanction-proposal/bmfios-sanction-proposal.component';
import { BMFIOSDisburseProposalComponent } from './BM-FIO/bmfios-disburse-proposal/bmfios-disburse-proposal.component';
import { SendSuccessfullyLinkPopupComponent } from './send-successfully-link-popup/send-successfully-link-popup.component';
import { AppCustomerRecordEligiblityViewPopupComponent } from './app-customer-record-eligiblity-view-popup/app-customer-record-eligiblity-view-popup.component';
import { AppCustomerRecordParameterPopupComponent } from './app-customer-record-parameter-popup/app-customer-record-parameter-popup.component';
import { AppCustomerRecordScoringViewPopupComponent } from './app-customer-record-scoring-view-popup/app-customer-record-scoring-view-popup.component';




@NgModule({
  declarations: [UploadSucessFullyPopupComponent,

    // Teaser View popup
    DownloadTsvPopupComponent, HoldTsvPopupComponent, RejectTsvPopupComponent, SanctionTsvPopupComponent, TransferTsvPopupComponent, BOApplicationSubmitPopupComponent, BMFIORejectComponent, BMFIOApproveComponent, BMFIOTransferProposalComponent, BMFIOReasonComponent, BMFIOCommonProposalComponent, BMFIONegativeComponent, BMFIOPositiveComponent, BUUserOfficeReadInstructionComponent, CommonLockUserComponent, CommonResetPasswordComponent,
    // PRODUCT& SCORING
    ComConfimConfigurationComponent,
    ComDeletePopupComponent,
    ComIndustrySectorPopupComponent,
    ComREPOMCLRComponent,
    ComViewProductConfigurationComponent,
    ComViewScoringConfigurationComponent,
    GeographicalAreasPopupComponent,
    ProductCommonComponent,
    ProductParametersComponent,
    ScoringCommonComponent,
    ProductScoringViewComponent,
    ScoringParametersComponent,
    UnsavePopupComponent,
    ConfimScoringConfigurationComponent,
    BMFIOSSendForApprovedComponent,
    BmfiosGiveRecommedationComponent,
    ProposalBifurcationPopupComponent,
    ProposalBifurcationCommonPopupComponent,
    CommitteBranchTransferPopupComponent,
    BMFIOSSanctionProposalComponent,
    BMFIOSDisburseProposalComponent,
    SendSuccessfullyLinkPopupComponent,
    AppCustomerRecordEligiblityViewPopupComponent,
    AppCustomerRecordParameterPopupComponent,
    AppCustomerRecordScoringViewPopupComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbProgressbarModule,
    NgOtpInputModule,
    SharedModule,
    NgxMaterialTimepickerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopupModule { }
