import { Routes } from '@angular/router';
import { AppComponent } from '../app-component/app.component';
import { RegisterComponent } from '../pages/register/register.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AppComponent,
   
  },
  {
    path: 'register',
    component: RegisterComponent
  },
];
