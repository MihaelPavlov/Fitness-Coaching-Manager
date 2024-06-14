import { Routes } from '@angular/router';
import { LoginComponent } from '../../pages/login/component/login.component';
import { LandingComponent } from '../../pages/landing/component/landing.component';
import { AppLayoutComponent } from '../app-layout/app-layout.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('../../pages/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'exercise',
        loadChildren: () =>
          import('../../pages/exercise-library/exercise-library.module').then(
            (m) => m.ExerciseLibraryModule
          ),
      },
      {
        path: 'register/:registrationType',
        loadChildren: () =>
          import('../../pages/register/register.module').then(
            (m) => m.RegisterModule
          )
      }
    ],
  },
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];
