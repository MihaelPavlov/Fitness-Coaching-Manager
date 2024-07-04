import { Routes } from '@angular/router';
import { LandingComponent } from '../../pages/landing/component/landing.component';
import { LoginComponent } from '../../pages/login/component/login.component';
import { AppLayoutComponent } from '../app-layout/app-layout.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { // Private profile
        path: 'profile',
        loadChildren: () =>
          import('../../pages/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      { // Public profile
        path: 'profile/:userId',
        loadChildren: () =>
          import('../../pages/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'workout',
        loadChildren: () =>
          import('../../pages/workout-library/workout-library.module').then(
            (m) => m.WorkoutLibraryModule
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
          ),
      },
    ],
  },
  {
    path: 'register',
    component: LandingComponent
  },
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'login',
    loadChildren: () =>
      import('../../pages/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
];
