import { Routes } from '@angular/router';

import { LandingComponent } from '../../pages/landing/component/landing.component';
import { LoginComponent } from '../../pages/login/component/login.component';


export const ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: LandingComponent
    },
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
        path: 'profile',
        loadChildren: () =>
            import('../../pages/profile/profile.module').then(
                (m) => m.ProfileModule
            ),
    },
];

