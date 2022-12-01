import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {

  constructor(@Inject(DOCUMENT) private dom: any) { }

  setCanonicalURL(url?: string) {

    const canURL = url == undefined ? this.dom.URL : url;
    const canonical: any = document.querySelector('link[rel="canonical"]');
    if (canonical == null) {
      const link: HTMLLinkElement = this.dom.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.dom.head.appendChild(link);
      link.setAttribute('href', canURL);
    } else{
      canonical.href = canURL;
    }
  }
  setCanonicalURLalternet(url?: string) {

    const canURL = url == undefined ? this.dom.URL : url;
    const alternate: any = document.querySelector('link[rel="alternate"]');
    if (alternate == null) {
      const link: HTMLLinkElement = this.dom.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', 'en-in');
      this.dom.head.appendChild(link);
      link.setAttribute('href', canURL);
    } else {
      alternate.href = canURL;
    }
  }
}
