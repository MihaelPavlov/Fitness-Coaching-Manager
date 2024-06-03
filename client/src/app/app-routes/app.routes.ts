import { Routes } from '@angular/router';

import { LandingComponent } from '../../pages/landing/component/landing.component';
import { LoginComponent } from '../../pages/login/component/login.component';
import { RegisterUserComponent } from '../../pages/register-user/component/register-user.component';


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
    path: 'register-user',
    component: RegisterUserComponent
  }
];

