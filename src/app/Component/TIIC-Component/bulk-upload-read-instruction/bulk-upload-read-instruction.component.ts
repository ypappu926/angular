import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/CommoUtils/constants';

@Component({
  selector: 'app-bulk-upload-read-instruction',
  templateUrl: './bulk-upload-read-instruction.component.html',
  styleUrls: ['./bulk-upload-read-instruction.component.scss']
})
export class BulkUploadReadInstructionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  close(){
    this.router.navigate([Constants.ROUTE_URL.BULK_UPLOAD]);
  }

}
