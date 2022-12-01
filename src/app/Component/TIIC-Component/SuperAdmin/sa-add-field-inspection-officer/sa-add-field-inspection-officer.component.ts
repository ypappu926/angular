import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-sa-add-field-inspection-officer',
  templateUrl: './sa-add-field-inspection-officer.component.html',
  styleUrls: ['./sa-add-field-inspection-officer.component.scss']
})
export class SAAddFieldInspectionOfficerComponent implements OnInit {

   // bread crumb items
   breadCrumbItems: Array<{}>;
   selectValue: string[];
 
   fileToUpload: File = null;
   constructor(private modalService: NgbModal) { }
 
   ngOnInit(): void {
     this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'form', path: '/', active: true }];
     this.selectValue = ['Data Enter', 'Data Enter', 'Data Enter'];
 
   }
 
 
   // handle file input selected file put in formdata
   handleFileInput(files: FileList) {
     this.fileToUpload = files.item(0);
     if (this.fileToUpload == null) {
       return;
     }
   }
 }
 