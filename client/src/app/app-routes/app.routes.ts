import { Routes } from '@angular/router';
import { LandingComponent } from '../../pages/landing/component/landing.component';
import { LoginComponent } from '../../pages/login/component/login.component';
import { ExerciseDetailsComponent } from '../../features/exercise-details/component/exercise-library-details/exercise-details.component';
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
        path: 'workout',
        loadChildren: () =>
          import('../../pages/workout-library/workout-library.module').then(
            (m) => m.WorkoutLibraryModule
          ),
      },
      {
        path: 'exercise',
        loadChildren: () =>
          import('../../pages/exercise-library/exercise-library.module').then((m) => m.ExerciseLibraryModule),
      },
      // We do not have a working backend yet to retrieve exerciseId from. Setting this for development purposes
      {
        path: 'exercise/list/1',
        component: ExerciseDetailsComponent
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
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
