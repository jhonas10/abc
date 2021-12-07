import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Nuestras Importaciones
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { ToastrModule } from "ngx-toastr";
import { ComponetsModule } from './componets/componets.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { FirestoreSettingsToken } from 'angularfire2/firestore';
import { IngLayoutComponent } from './ing-layout/ing-layout.component';
import { IngLayoutModule } from './ing-layout/ing-layout.module';
import { AdminLayoutModule } from './admin-layout/admin-layout.module';

import { SecreLayoutComponent } from './secre-layout/secre-layout.component';

import { SecreLayoutModule } from './secre-layout/secre-layout.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    IngLayoutComponent,
    SecreLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    ComponetsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    //module para admin,ingeniero y secretaria
    AdminLayoutModule,
    IngLayoutModule,
    SecreLayoutModule,
    NoopAnimationsModule,
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
