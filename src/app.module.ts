import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { JwtInterceptor } from './Component/core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './Component/core/helpers/error.interceptor';
import { FakeBackendProvider } from './Component/core/helpers/fake-backend';
import { LayoutsModule } from './Component/layout/layouts.module';
import { LoaderService } from './CommoUtils/common-services/LoaderService';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LoaderComponent } from './CommoUtils/Common-Component/loader/loader.component'
import { DragDropDirective } from './CommoUtils/common-services/directives/drag-drop.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';
import { PopupModule } from './Popup/popup.module';
import { NgbToastComponent } from './CommoUtils/Common-Component/ngb-toast/ngb-toast.component';
import { CustomAdapter, CustomDateParserFormatter } from './CommoUtils/common-services/datepicker-adapter';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    DragDropDirective,
    NgbToastComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutsModule,
    AppRoutingModule,
    PopupModule,
    NgOtpInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    NgbModule,
    TranslateModule.forChild({ loader: { 
      provide: TranslateLoader, 
      useFactory: (HttpLoaderFactory), 
      deps: [HttpClient] } })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },    
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: NgbDateAdapter, useClass: CustomAdapter  },
      // provider used to create fake backend
      FakeBackendProvider, LoaderService, Title, DecimalPipe,DatePipe,TranslateService,TranslateStore],
    schemas: [CUSTOM_ELEMENTS_SCHEMA,],
    bootstrap: [AppComponent],
    entryComponents: []
})
export class AppModule {
  constructor(private translate: TranslateService,public npConfig: NgbModalConfig) {
    npConfig.backdrop = 'static';
    const locale = CommonService.getStorage('locale', true);
    if (!CommonService.isObjectNullOrEmpty(locale) && (locale === 'en' || locale === 'hn')) {
      this.translate.use(locale);
      this.translate.setDefaultLang(locale);
      CommonService.setStorage('locale', locale);
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      CommonService.setStorage('locale', 'en');
    }
  }
 }


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  if(window.location.pathname.includes("/")){
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
  } else {
    // return new TranslateHttpLoader(http);
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
  }
}