import { Routes } from '@angular/router';
import { ProyectosIngComponent } from '../ing-pages/proyectos-ing/proyectos-ing.component';
export const ING_ROUTES: Routes = [
    { path: 'proyectos', component :ProyectosIngComponent },
    { path: '**', redirectTo: 'proyectos' }
];