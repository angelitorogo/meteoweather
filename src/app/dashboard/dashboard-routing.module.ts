import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from '../guards/auth.guard';
import { ContactComponent } from './components/contact/contact.component';
import { TermsPrivacyComponent } from './components/terms-privacy/terms-privacy.component';
import { CookiesSettingsComponent } from './components/cookies-settings/cookies-settings.component';


const routes: Routes = [

  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },

      {
        path: 'contacto',
        component: ContactComponent
      },
      {
        path: 'terminos',
        component: TermsPrivacyComponent,
      },
      {
        path: 'cookies',
        component: CookiesSettingsComponent,
      },
      /*
      {
        path: 'home2',
        canActivate: [AuthGuard], // Protege la ruta con el AuthGuard
      },
      */
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
