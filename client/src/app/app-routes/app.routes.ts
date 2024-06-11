import { Routes } from '@angular/router';

import { LandingComponent } from '../../pages/landing/component/landing.component';
import { LoginComponent } from '../../pages/login/component/login.component';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register/:registrationType',
    loadChildren: () =>
      import('../../pages/register/register.module').then(
        (m) => m.RegisterModule
      )
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../../pages/profile/profile.module').then(
        (m) => m.ProfileModule
      ),
  },
];
