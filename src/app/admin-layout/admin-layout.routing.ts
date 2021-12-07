import { Routes } from '@angular/router';
import { HomeComponent } from '../admin-pages/home/home.component';
import { ProyectosComponent } from '../admin-pages/proyectos/proyectos.component';
import { EmpresasComponent } from '../admin-pages/empresas/empresas.component';
import { PersonalComponent } from '../admin-pages/personal/personal.component';
import { TramosComponent } from '../admin-pages/tramos/tramos.component';
//Rutas de Administrador
export const ADMIN_ROUTES: Routes = [
    { path: 'inicio', component: HomeComponent },
    { path: 'proyectos', component :ProyectosComponent },
    { path: 'empresas', component :EmpresasComponent },
    { path: 'tramos', component :TramosComponent },
    { path: 'personal', component :PersonalComponent },
    { path: '**', redirectTo: 'inicio' }
];