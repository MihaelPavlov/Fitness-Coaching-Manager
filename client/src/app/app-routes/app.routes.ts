import { Routes } from '@angular/router';
import { LoginComponent } from '../../pages/login/component/login.component';
import { ProfileComponent } from '../../pages/profile/component/profile.component';

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
        path: 'profile',
        component: ProfileComponent,
    },
];
