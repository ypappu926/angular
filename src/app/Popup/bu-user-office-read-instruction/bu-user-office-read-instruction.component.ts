import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bu-user-office-read-instruction',
  templateUrl: './bu-user-office-read-instruction.component.html',
  styleUrls: ['./bu-user-office-read-instruction.component.scss']
})
export class BUUserOfficeReadInstructionComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
