import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AboutComponent } from 'src/app/pages/about/about.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'overview',  component: DashboardComponent },
    { path: 'about',      component: AboutComponent },
];
