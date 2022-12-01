import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';

@Component({
  selector: 'app-bmfios-disbursment-certificate',
  templateUrl: './bmfios-disbursment-certificate.component.html',
  styleUrls: ['./bmfios-disbursment-certificate.component.scss']
})
export class BMFIOSDisbursmentCertificateComponent implements OnInit {

  disbursementDetails : any;

  proposalId: number;
  applicationId: number;

  borrowerProposalId: any;
	statusId;
	jobId: any;
	proposalMappingId: any;
	districtId: number;


  imgURL: any;
  fileReader: FileReader;

  constructor(private tnService: TnService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private commonServices: CommonService
    ) { }

  ngOnInit(): void{
    this.applicationId = +this.commonServices.getURLData('applicationId');
    this.proposalId = +this.commonServices.getURLData('proposalId');

    this.borrowerProposalId = +this.commonServices.getURLData('borrowerProposalId');
    this.statusId = +this.commonServices.getURLData('statusId');
    this.jobId = +this.commonServices.getURLData('jobId');
    this.proposalMappingId = +this.commonServices.getURLData('proposalMappingId');
    this.districtId = +this.commonServices.getURLData('districtId');

    this.getDisbursalDetails();
    this.downLoadPartnerPhoto();
  }

  getDisbursalDetails(){
    this.tnService.getDisbursementDetails(this.applicationId, this.proposalId).subscribe(response=>{
      if(response != null){
        this.disbursementDetails = response;
        console.log(this.disbursementDetails);
      }else{
        this.commonServices.warningSnackBar('Failed to get disbursal details');
      }
    },error=>{
      this.commonServices.warningSnackBar('Failed to get disbursal details');
    });
  }

    downLoadPartnerPhoto(){
    const data = {
      applicationId: this.applicationId,
      productDocumentMappingId: 784,
      productDocumentMappingIds: [784],
      proposalId: this.proposalId
    }
    this.tnService.downloadFileByProductDocumentMappingId(data).subscribe(success => {
      console.log("success  ::{}",success);  
        this.fileReader = new FileReader();
        this.fileReader.readAsDataURL(new Blob([success], { type: success.type }));
        this.fileReader.onload = (_event) => {
            this.imgURL = this.fileReader.result;
        } 
    }, error => {
        this.commonServices.errorSnackBar("Something Went Wrong");
    });
  }
      downloadDisbursalNotReport() {
      this.tnService.getDisbursementNoteReport(this.applicationId,this.proposalId).subscribe(success => {
      if(success.status === 200 && success.data != null) {
        if (success.data) {
          const blobPdf = 'data:application/pdf;base64,' + success.data;
          const linkPdf = document.createElement('a');
          linkPdf.id = 'fio-report-pdf';
          linkPdf.href = blobPdf;
          linkPdf.download = 'DISBURSEMENT_NOTE' + '.pdf';
          linkPdf.click();
        }  
      } else {
        this.commonServices.errorSnackBar("Something Went Wrong");
      }
    });
  }

  navigateToLoanApplicatoinViewPage(){
    this.router.navigate([Constants.ROUTE_URL.BMFIOS_LOAN_APPLICATION_VIEW], {
      queryParams: {
        applicationId: this.commonServices.setURLData(this.applicationId.toString()),
        proposalId: this.commonServices.setURLData(this.proposalId.toString()),
        borrowerProposalId: this.commonServices.setURLData(this.borrowerProposalId),
        statusId: this.commonServices.setURLData(this.statusId),
        jobId: this.commonServices.setURLData(this.jobId),
        proposalMappingId: this.commonServices.setURLData(this.proposalMappingId),
        districtId: this.commonServices.setURLData(this.districtId.toString())
        
      }
    });
  }

}
