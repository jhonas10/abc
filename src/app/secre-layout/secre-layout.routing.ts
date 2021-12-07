import { Routes } from '@angular/router';
import { ProyectosSecreComponent } from '../secre-pages/proyectos-secre/proyectos-secre.component';

export const SECRE_ROUTES: Routes = [
    { path: 'proyectos', component :ProyectosSecreComponent },
    { path: '**', redirectTo: 'proyectos' }
];