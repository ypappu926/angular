import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bm-fio-positive',
  templateUrl: './bm-fio-positive.component.html',
  styleUrls: ['./bm-fio-positive.component.scss']
})
export class BMFIOPositiveComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
}
