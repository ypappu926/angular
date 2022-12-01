import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ScoringService } from 'src/app/services/scoring.service';

@Component({
  selector: 'app-scoring-parameters',
  templateUrl: './scoring-parameters.component.html',
  styleUrls: ['./scoring-parameters.component.scss']
})
export class ScoringParametersComponent implements OnInit {


  selectValue!: string[];
  @Input() popUpObj: any;
  selectedCount: number = 0;
  selectAll: boolean = false;
  mainList!: any[];
  searchText: any = "";
  scoringModelData: any = {};
  tabId: any;
  constructor(public activeModal: NgbActiveModal, private autoRenewal: ScoringService, private commonService: CommonService) { }

  ngOnInit(): void {
    setTimeout(() => {
    this.getScoringModel();
    }, 0);
  }

  getScoringModel() {

    let scoringId = this.popUpObj.scoringId;
    let tab = this.popUpObj.tabId;
    this.tabId = tab;
    // alert(tabId);
    this.autoRenewal.getScoringModelPopUp(scoringId,tab).subscribe(success => {
      if (success.status === 200) {
        this.scoringModelData = success.dataObject;
        // this.mainList = this.scoringModelData.fieldsList;
        this.scoringModelData.fieldsList.forEach(element => {
          if(element.isConsider){
            element.isDisable = true;
          }
          // element.tabId = tab;
          
        });
        this.countSelected();
        // console.log(this.mainList);
      }

    }, function (error) {
      if (error.status == 401) {
        // this.commonMethod.logoutUser();
      }
    });
  }

  saveData() {
    if (this.selectedCount == 0) {
      this.commonService.warningSnackBar("Please select atleast 1 Field")
      return;
    }
    console.log(this.scoringModelData)
    this.scoringModelData.riskMapId = this.popUpObj.riskMapId;
    this.scoringModelData.tabId = this.tabId;
    this.autoRenewal.saveScoringParameters(this.scoringModelData).subscribe(success => {
      if (success.status === 200) {
        this.activeModal.close('Ok');
      }
    }, function (error) {
      if (error.status == 401) {
        // this.commonMethod.logoutUser();
      }
    });


  }

  closeModal() {
    this.activeModal.close('Close');
  }

  selectAllFields() {
    let dataCount = 0;
    if (this.selectAll) {
      this.scoringModelData.fieldsList.forEach(item => {
        if(item.isDisable == null || item.isDisable == false){
          item.isConsider = true;
        }
        // item.isConsider = true;
        dataCount++;
      });
    } else {
      dataCount = 0;
      this.scoringModelData.fieldsList.forEach(item => {
        if(item.isDisable == null || item.isDisable == false){
          item.isConsider = false;
        }
        // item.isConsider = false;
      });
    }
    this.selectedCount = dataCount;

  }

  countSelected() {
    let dataCount = 0;
    this.scoringModelData.fieldsList.forEach(item => {
      if (item.isConsider == true) {
        dataCount++;
      }
    });
    this.selectedCount = dataCount;
  }

  filterText(searchText: any) {
    if (this.commonService.isObjectNullOrEmpty(searchText)) {
      this.mainList = this.scoringModelData.fieldsList;
      return;
    }
    this.mainList =this.scoringModelData.fieldsList.filter((item) => (item.fieldName.toLowerCase().includes(searchText.toLowerCase())))
  }

}
