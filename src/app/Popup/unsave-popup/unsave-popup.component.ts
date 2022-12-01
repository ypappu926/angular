import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-unsave-popup',
  templateUrl: './unsave-popup.component.html',
  styleUrls: ['./unsave-popup.component.scss']
})
export class UnsavePopupComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}