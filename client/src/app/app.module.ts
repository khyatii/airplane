//facebook login
import { HttpModule, Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

//rest
import { BrowserModule } from '@angular/platform-browser';
import { LoadingModule } from 'ngx-loading';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { FileUploadModule } from "ng2-file-upload";
import { ReactiveFormsModule } from '@angular/forms';



import { routes } from './routes';

//services
import { SessionService } from './shared/services/session.service'
import { EnsureLoggedInService } from './shared/services/ensureActivationService';
import { EnsureAdminService } from './shared/services/ensure-admin.service';
import { ClaimFormService } from './shared/services/claim-form.service'
import { AdminFnService } from './shared/services/admin-fn.service'
import { ModalService } from './shared/services/modal.service'
import { AirportAutocompleteService } from './shared/services/airport-autocomplete.service'
import { AirlineAutocompleteService } from './shared/services/airline-autocomplete.service'
import { PicUploadService } from './shared/services/pic-upload.service'
import { HeaderObservablesService } from './shared/services/header-observables.service'
import { ScrollEventService } from './shared/services/scroll-event.service'
import { PromoCodeService } from './shared/services/promo-code.service'
import { TranslateService } from './shared/services/translate.service'

//pipes
import { SafeUrlPipe } from './shared/pipes/safe-url.pipe'
import { SpanishDatePipe } from './shared/pipes/spanish-date.pipe';
import { ClaimStatusPipe } from './shared/pipes/claim-status.pipe';
import { TranslatePipe } from './shared/pipes/translate.pipe';

//components
import { AppComponent } from './components/app.component';
import { NonLoggedHomeComponent } from './components/non-logged-home/non-logged-home.component';
import { LoginComponent } from './components/login/login.component';
import { LoggedHomeComponent } from './components/logged-home/logged-home.component';
import { RegisterComponent } from './components/login/register/register.component';
import { ClaimComponent } from './components/claim/claim.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { FirstPartClaimComponent } from './components/claim/first-part-claim/first-part-claim.component';
import { SecondPartClaimComponent } from './components/claim/second-part-claim/second-part-claim.component';
import { IdFrontComponent } from './components/claim/second-part-claim/pic-uploads/id-front/id-front.component';
import { IdBackComponent } from './components/claim/second-part-claim/pic-uploads/id-back/id-back.component';
import { BoardingPassComponent } from './components/claim/second-part-claim/pic-uploads/boarding-pass/boarding-pass.component';
import { CompanyClaimComponent } from './components/claim/second-part-claim/pic-uploads/company-claim/company-claim.component';
import { FlightTicketOrReservationComponent } from './components/claim/second-part-claim/pic-uploads/flight-ticket-or-reservation/flight-ticket-or-reservation.component';
import { ModalComponent } from './components/shared-components/modal/modal.component';
import { RedDivComponent } from './components/claim/second-part-claim/red-div/red-div.component';
import { PrivacyComponent } from './components/terms/privacy/privacy.component';
import { AdminProcessComponent } from './components/admin-home/admin-process/admin-process.component';
import { TermsComponent } from './components/terms/terms/terms.component';
import { CheckboxComponent } from './components/shared-components/checkbox/checkbox.component';
import { ContactComponent } from './components/contact/contact.component';
import { CookiesComponent } from './components/terms/cookies/cookies.component';
import { NoCompensationComponent } from './components/claim/no-compensation/no-compensation.component';
import { SharePromoComponent } from './components/share-promo/share-promo.component';
import { MyPromoComponent } from './components/logged-home/my-promo/my-promo.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './components/login/set-password/set-password.component';
import { ConfirmLoginComponent } from './components/login/confirm-login/confirm-login.component';
import { ResendForgotPasswordComponent } from './components/login/resend-forgot-password/resend-forgot-password.component';

//TRANSLATIONS
import { TRANSLATION_PROVIDERS }   from './shared/translate/translation';

//Directives
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { ResendRecoveryComponent } from './components/login/resend-recovery/resend-recovery.component';


//facebook login necessary
export function getAuthHttp(http: Http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'x-auth-token',
    noTokenScheme: true,
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => localStorage.getItem('id_token')),
  }), http);
}

@NgModule({
  declarations: [
    AppComponent,
    NonLoggedHomeComponent,
    LoginComponent,
    LoggedHomeComponent,
    RegisterComponent,
    ClaimComponent,
    AdminHomeComponent,
    ModalComponent,
    NavHeaderComponent,
    FirstPartClaimComponent,
    SecondPartClaimComponent,
    IdFrontComponent,
    IdBackComponent,
    BoardingPassComponent,
    CompanyClaimComponent,
    FlightTicketOrReservationComponent,
    RedDivComponent,
    PrivacyComponent,
    AdminProcessComponent,
    SafeUrlPipe,
    TermsComponent,
    CheckboxComponent,
    ContactComponent,
    CookiesComponent,
    NoCompensationComponent,
    SharePromoComponent,
    MyPromoComponent,
    SpanishDatePipe,
    ClaimStatusPipe,
    ForgotPasswordComponent,
    TranslatePipe,
    SetPasswordComponent,
    EqualValidator,
    ConfirmLoginComponent,
    ResendForgotPasswordComponent,
    ResendRecoveryComponent
  ],
  imports: [
    LoadingModule,
    BrowserAnimationsModule,
    FileUploadModule,
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    ModalService,
    SessionService,
    EnsureLoggedInService,
    EnsureAdminService,
    ClaimFormService,
    AdminFnService,
    AirportAutocompleteService,
    AirlineAutocompleteService,
    PicUploadService,
    HeaderObservablesService,
    ScrollEventService,
    PromoCodeService,
    TranslateService,
    TRANSLATION_PROVIDERS,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
