import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer-tsv-popup',
  templateUrl: './transfer-tsv-popup.component.html',
  styleUrls: ['./transfer-tsv-popup.component.scss']
})
export class TransferTsvPopupComponent implements OnInit {

  selectValue: string[];
  constructor() { }

  ngOnInit(): void {
    this.selectValue = ['Alaska , hello , helo" ', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];
  }


}
