import { Routes } from '@angular/router';

import { LandingComponent } from '../../pages/landing/component/landing.component';


export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
   
  }
];

