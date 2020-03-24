import { Component, OnInit, HostListener } from '@angular/core';
import { SessionService } from "../shared/services/session.service"
import { HeaderObservablesService } from '../shared/services/header-observables.service';
import { TranslateService } from '../shared/services/translate.service';

declare global {
  interface Window {
    RequestFileSystem: any;
    webkitRequestFileSystem: any;
    TEMPORARY: any;
    chrome: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})

export class AppComponent implements OnInit {
  public cookies: boolean = false;
  public year: string = (new Date()).getFullYear().toString();
  public translatedText: string;
  public supportedLanguages: any[];

  constructor(
    private session: SessionService,
    private header: HeaderObservablesService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    if(!localStorage.getItem('acceptedTerms')) this.cookies = true
    this.session.handleGoogleClientLoad()
    //GOOGLE LOGIN
    this.session.isLoggedIn('/user');

    // set current language
    if(window.navigator.language !== 'es-ES') this.selectLang('en');
    else this.selectLang('es');
  }

  selectLang(lang: string) {
      // set current lang;
      this.translate.use(lang);
  }

  onActivate(): void {
    this.header.arrowBoolean(false)
  }

  @HostListener('window:click', [''])
  click(): void {
    localStorage.setItem('acceptedTerms', 'true')
    this.cookies = false
  }

}
