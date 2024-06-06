import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/component/login.component';
import { ExerciseLibraryComponent } from '../../pages/exercise-library/component/exercise-library.component';
import { LandingComponent } from '../../pages/landing/component/landing.component';

export const ROUTES: Routes = [
    /* {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'patient',
                loadChildren: () =>
                    import('../../pages/patients/patients.module').then(
                        (m) => m.PatientsModule
                    ),
            },
        ],
    }, */
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        component: LandingComponent, 
        pathMatch: 'full',
      },
    // We still do not have a layout component as it's set up above, so that's why I am creating a new set up of the lazy loading module here;
    {   
        path: 'exercise-library',
        component: ExerciseLibraryComponent,
        children: [
            {path: 'exercise-library', loadChildren: () =>
                import('../../pages/exercise-library/exercise-library.module').then((m) => m.ExerciseLibraryModule)},
        ]  
    },
]




