import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tiic-application-status-list',
  templateUrl: './tiic-application-status-list.component.html',
  styleUrls: ['./tiic-application-status-list.component.scss']
})
export class TIICApplicationStatusListComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tab: number;

  constructor( private commonService: CommonService,) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/Status-list' },{ label: 'My Application', path: '/', active: true }];

    this.tab = 1;
    this.changeTab(this.tab);

    // this.OnloadJqueryMObile();
    (function ($) {
      $(window).resize(function () {
        // this.OnloadJqueryMObile();
        OnloadJqueryMObile_onInit();
      });
    })(jQuery);
    function OnloadJqueryMObile_onInit() {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width < 1024) {
        this.commonService.DropDownjquery();        
        return true;
      } else {
        return false;
      }
    }
  }
  // Windi scroll Function
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (window.pageYOffset > window.innerHeight) {
      let element: any = document.getElementById('stick-headerN');
      element.classList.add('fix-to-top');
      this.adjustWidth();
    } else {
      let element: any = document.getElementById('stick-headerN');
      element.classList.remove('fix-to-top');
      //this.adjustWidthRemove();]
      // Fix After Remove Css
      let stickN: any = document.getElementById("stick-headerN");
      stickN.style.width = "100%"
    }
  }

  adjustWidth() {
    var parentwidth = $(".parent").width();
    $(".fix-to-top").width(parentwidth);
    // console.log(parentwidth);
  }

  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number) {
    this.tab = tabId;
  }
}
