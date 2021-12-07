import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export var ROUTES: RouteInfo[] = [];


@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
})


export class SidebarComponent implements OnInit {
    public menuItems: any[];
    constructor(){
        const cargo = String (sessionStorage.getItem('cargo'));
        //para limpiar las direcciones si se inica sesion con otra cuenta
        ROUTES = [];
        if(cargo=='Gerente Regional'){
            
            ROUTES.push(
                { path: 'inicio',     title: 'INICIO',         icon:'nc-bank',       class: '' },
                { path: 'proyectos',         title: 'PROYECTOS',        icon:'nc-tile-56',    class: '' },
                { path: 'empresas',          title: 'EMPRESAS',      icon:'nc-briefcase-24',  class: '' },
                { path: 'tramos',          title: 'TRAMOS',      icon:'nc-map-big',  class: '' },
                { path: 'personal',          title: 'PERSONAL',      icon:'nc-single-02',  class: '' },);
        }
        if(cargo == 'Ingeniero de Tramo'){
            ROUTES.push(
                { path: 'proyectos',         title: 'PROYECTOS',        icon:'nc-tile-56',    class: '' }
            );
        }
        if(cargo == 'Secretaria'){
            ROUTES.push(
                { path: 'proyectos',         title: 'PROYECTOS',        icon:'nc-tile-56',    class: '' }
            );
        }
    }
    ngOnInit() {
        
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        
    }
}
