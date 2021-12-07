import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ADMIN_ROUTES } from './admin-layout/admin-layout.routing';
import { AuthGuardAdmin } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AuthIngGuard } from './guards/auth-ing.guard';
import { IngLayoutComponent } from './ing-layout/ing-layout.component';
import { ING_ROUTES } from './ing-layout/ing-layout.routing';
import { SecreLayoutComponent } from './secre-layout/secre-layout.component';
import { AuthSecreGuard } from './guards/auth-secre.guard';
import { SECRE_ROUTES } from './secre-layout/secre-layout.routing';

const routes: Routes = [
  { path: 'login'   , component: LoginComponent },
  { path: 'admin', component: AdminLayoutComponent ,
      canActivate:[
        AuthGuardAdmin,
      ], 
      children: ADMIN_ROUTES
  },
  { path: 'ing', component: IngLayoutComponent,
      canActivate:[
        AuthIngGuard
      ],
      children: ING_ROUTES
  },
  { path: 'secre', component: SecreLayoutComponent,
      canActivate:[
        AuthSecreGuard
      ],
      children: SECRE_ROUTES
  },
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
