import { Routes } from '@angular/router';

import { NonLoggedHomeComponent } from './components/non-logged-home/non-logged-home.component';
import { LoggedHomeComponent } from './components/logged-home/logged-home.component';
import { ClaimComponent } from './components/claim/claim.component'
import { AdminHomeComponent } from './components/admin-home/admin-home.component'
import { PrivacyComponent } from './components/terms/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms/terms.component';
import { CookiesComponent } from './components/terms/cookies/cookies.component';
import { ContactComponent } from './components/contact/contact.component';
import { SharePromoComponent } from './components/share-promo/share-promo.component';
import { MyPromoComponent } from './components/logged-home/my-promo/my-promo.component';
import { SetPasswordComponent } from './components/login/set-password/set-password.component';
import { ConfirmLoginComponent } from './components/login/confirm-login/confirm-login.component';
import { ResendForgotPasswordComponent } from './components/login/resend-forgot-password/resend-forgot-password.component';
import { ResendRecoveryComponent } from './components/login/resend-recovery/resend-recovery.component';

//can activate service
import { EnsureLoggedInService } from './shared/services/ensureActivationService';
import { EnsureAdminService } from './shared/services/ensure-admin.service';

export const routes: Routes = [
    { path: 'home', component: NonLoggedHomeComponent,
    },
    { path: 'user', component: LoggedHomeComponent,
      canActivate: [EnsureLoggedInService]
    },
    { path: 'setPassword', component: SetPasswordComponent,
    },
    { path: 'confirmLogin', component: ConfirmLoginComponent,
    },
    { path: 'forgotPassword', component: ResendForgotPasswordComponent,
    },
    { path: 'resendPassword', component: ResendRecoveryComponent,
    },
    { path: 'promo', component: MyPromoComponent,
      canActivate: [EnsureLoggedInService]
    },
    { path: 'claim', component: ClaimComponent,
    },
    { path: 'privacy', component: PrivacyComponent,
    },
    { path: 'cookies', component: CookiesComponent,
    },
    { path: 'contact', component: ContactComponent,
    },
    { path: 'terms', component: TermsComponent,
    },
    { path: 'earnmoney', component: SharePromoComponent,
    },
    { path: 'admin', component: AdminHomeComponent,
    canActivate: [EnsureAdminService]
    },
  { path: '**', redirectTo: 'home' }
];
