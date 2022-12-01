import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { LoaderService } from './CommoUtils/common-services/LoaderService';
import { TnService } from './services/tn.service';
import { CommonService } from './CommoUtils/common-services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[TranslateService]
})
export class AppComponent {
  title = 'TamilNadu';
  validationsobj: any;
  constructor(private router: Router, private loaderService: LoaderService, private titleService: Title,private service: TnService,
    private activatedRoute: ActivatedRoute, private translate: TranslateService,public npConfig: NgbModalConfig) {
    npConfig.backdrop = 'static';
    translate.setDefaultLang('en');
    translate.use('en');
    
    // For state change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loaderService.show(); // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        this.loaderService.hide(); // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        this.loaderService.hide(); // Hide loading indicator on error
      }
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const rt = this.getChildTitle(this.activatedRoute);
      rt.data.subscribe(data => this.titleService.setTitle(data.title));
    });
    
    this.getAllValidations();
  }

  getChildTitle(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChildTitle(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  getAllValidations() {
    this.service.getValidations(1).subscribe(res => {
      if (res.status === 200) {
        this.validationsobj = JSON.parse(res.data);
        CommonService.setStorage('validations', JSON.stringify(this.validationsobj));
      }
    });
  }
  
}
