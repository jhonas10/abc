import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectosSecreComponent } from '../secre-pages/proyectos-secre/proyectos-secre.component';
import { RouterModule } from '@angular/router';
import { SECRE_ROUTES } from './secre-layout.routing';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    ProyectosSecreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SECRE_ROUTES),
    HttpClientModule,
    NgbModule,
    FormsModule,
    //para el date module
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ]
})
export class SecreLayoutModule { }
