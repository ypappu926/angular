import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { CommonMethods } from './common-methods';
import { LoaderService } from './LoaderService';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private commonMethod: CommonMethods, private loaderService: LoaderService) { }

  /**
   * For Post service url with data
   */
  header = new HttpHeaders();
  post(url: string, data: any, ignoreLoader?: boolean) {
    if (ignoreLoader !== undefined && !ignoreLoader) {
      this.header = this.header.append('ignoreLoader', ignoreLoader.toString());
      return this.http.post(url, data, { headers: this.header }).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status == 401) {
            this.commonMethod.clearStorageAndMoveToLogin(true);
          } else {
            return this.commonMethod.errorHandle(err.error);
          } 
        }));
    } else {
      this.loaderService.show();
      return this.http.post(url, data).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status == 401) {
            this.commonMethod.clearStorageAndMoveToLogin(true);
          } else {
            return this.commonMethod.errorHandle(err.error);
          } 
        }));
    }
  }


  /**
   * for get method call
   */
  get(url: any, responseType: any, ignoreLoader?: boolean) {
    if (responseType === true) {
      if (ignoreLoader !== undefined && !ignoreLoader) {
        this.header = this.header.append('ignoreLoader', ignoreLoader.toString());
        return this.http.get(url, { responseType: 'arraybuffer', headers: this.header }).pipe(
          catchError((err: HttpErrorResponse) => {
            if(err.status == 401) {
              this.commonMethod.clearStorageAndMoveToLogin(true);
            } else {
              return this.commonMethod.errorHandle(err.error);
            } 
          }));
      } else {
        return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
          catchError((err: HttpErrorResponse) => {
            if(err.status == 401) {
              this.commonMethod.clearStorageAndMoveToLogin(true);
            } else {
              return this.commonMethod.errorHandle(err.error);
            } 
          }));
      }
    } else {
      if (ignoreLoader !== undefined && !ignoreLoader) {
        this.header = this.header.append('ignoreLoader', ignoreLoader.toString());
        return this.http.get(url, { headers: this.header }).pipe(
          catchError((err: HttpErrorResponse) => {
            if(err.status == 401) {
              this.commonMethod.clearStorageAndMoveToLogin(true);
            } else {
              return this.commonMethod.errorHandle(err.error);
            } 
          }));
      } else {
        this.loaderService.show();
        return this.http.get(url).pipe(
          catchError((err: HttpErrorResponse) => {
            if(err.status == 401) {
              this.commonMethod.clearStorageAndMoveToLogin(true);
            } else {
              return this.commonMethod.errorHandle(err.error);
            } 
          }));
      }
    }
  }

  /**
   * for delete method call
   */
  delete(url: any, ignoreLoader?: boolean) {
    if (ignoreLoader !== undefined && !ignoreLoader) {
      this.header = this.header.append('ignoreLoader', ignoreLoader.toString());
      return this.http.delete(url, { headers: this.header }).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status == 401) {
            this.commonMethod.clearStorageAndMoveToLogin(true);
          } else {
            return this.commonMethod.errorHandle(err.error);
          } 
        }));
    } else {
      this.loaderService.show();
      return this.http.delete(url).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status == 401) {
            this.commonMethod.clearStorageAndMoveToLogin(true);
          } else {
            return this.commonMethod.errorHandle(err.error);
          } 
        }));
    }
  }

  /**
   * For put method call
   */
  put(url: string, data: any, ignoreLoader?: boolean) {
    if (ignoreLoader !== undefined && !ignoreLoader) {
      this.header = this.header.append('ignoreLoader', ignoreLoader.toString());
      return this.http.put(url, data, { headers: this.header }).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status == 401) {
            this.commonMethod.clearStorageAndMoveToLogin(true);
          } else {
            return this.commonMethod.errorHandle(err.error);
          } 
        }));
    } else {
      this.loaderService.show();
      return this.http.put(url, data).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status == 401) {
            this.commonMethod.clearStorageAndMoveToLogin(true);
          } else {
            return this.commonMethod.errorHandle(err.error);
          } 
        }));
    }
  }

  upload(url: string, formData: any) {
    const headersData = new HttpHeaders({ 'Content-Type': 'multipart/form-data', enctype: 'multipart/form-data' });
    return this.http.post(url, formData, { reportProgress: true, observe: 'events', headers: headersData }).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status == 401) {
          this.commonMethod.clearStorageAndMoveToLogin(true);
        } else {
          return this.commonMethod.errorHandle(err.error);
        } 
      }));
  }


  downloadFilesGetMethod(url: string) {
    this.loaderService.show();
    return this.http.get(url,  {  responseType: 'blob', headers: new HttpHeaders().append('Content-Type', 'application/json') } ).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status == 401) {
          this.commonMethod.clearStorageAndMoveToLogin(true);
        } else {
          return this.commonMethod.errorHandle(err.error);
        } 
      }));;
  }

  downloadReport(url, data) {
    return this.http.post(url, data, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}