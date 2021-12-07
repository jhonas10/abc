import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ADMIN_ROUTES } from './admin-layout.routing';
import { HomeComponent } from '../admin-pages/home/home.component';
import { ProyectosComponent } from '../admin-pages/proyectos/proyectos.component';
import { EmpresasComponent } from '../admin-pages/empresas/empresas.component';
import { PersonalComponent } from '../admin-pages/personal/personal.component';
import { TramosComponent } from '../admin-pages/tramos/tramos.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgDropFilesDirective } from '../directives/ng-drop-files.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ADMIN_ROUTES),
        HttpClientModule,
        NgbModule,
        FormsModule,
        //para el date module
        MatNativeDateModule,
        MatDatepickerModule,
        MatFormFieldModule,
        //paleta de colores
        NgxMatColorPickerModule,
        ReactiveFormsModule,
    ],
    providers: [
        { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
    ],
    //Side Bar AÑADIDO
    declarations: [
        HomeComponent,
        ProyectosComponent,
        EmpresasComponent,
        PersonalComponent,
        TramosComponent,
        //Para subir archivos
        NgDropFilesDirective,
    ]
  })
export class AdminLayoutModule{}