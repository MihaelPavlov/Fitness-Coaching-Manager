import { Routes } from '@angular/router';
import { LandingComponent } from '../../pages/landing/component/landing.component';
import { AppLayoutComponent } from '../app-layout/app-layout.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { CoachOnlyGuard } from '../../shared/guards/coach-only.guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../../pages/home/home.module').then((m) => m.HomeModule),
      },
      {
        // Private profile
        path: 'profile',
        loadChildren: () =>
          import('../../pages/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        // Public profile
        path: 'profile/:userId',
        loadChildren: () =>
          import('../../pages/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'workout',
        loadChildren: () =>
          import('../../pages/workout/workout.module').then(
            (m) => m.WorkoutModule
          ),
      },
      {
        path: 'exercise',
        loadChildren: () =>
          import('../../pages/exercise/exercise.module').then(
            (m) => m.ExerciseModule
          ),
      },
      {
        path: 'contributor',
        loadChildren: () =>
          import('../../pages/contributor/contributor.module').then(
            (m) => m.ContributorModule
          ),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('../../pages/chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'builders',
        canActivate: [CoachOnlyGuard],
        loadChildren: () =>
          import('../../pages/builder/builder.module').then(
            (m) => m.BuilderModule
          ),
      },
    ],
  },
  {
    path: 'register',
    component: LandingComponent,
  },
  {
    path: 'home',
    component: LandingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('../../pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register/:registrationType',
    loadChildren: () =>
      import('../../pages/register/register.module').then(
        (m) => m.RegisterModule
      ),
  },
];
