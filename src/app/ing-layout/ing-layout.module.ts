import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ING_ROUTES } from './ing-layout.routing';
import { ProyectosIngComponent } from '../ing-pages/proyectos-ing/proyectos-ing.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ING_ROUTES),
    HttpClientModule,
    NgbModule,
    FormsModule,
    //para el date module
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  declarations: [
    ProyectosIngComponent
  ],
})
export class IngLayoutModule { }
