import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PersonalModel } from '../models/personal.model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { PersonalService } from '../services/personal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario:UsuarioModel = new UsuarioModel();
  personalRef: AngularFirestoreCollection<PersonalModel> = null;
  personales: PersonalModel[];
  recordarme=false;
  //contraseña
  mostrarTexto: boolean;
  constructor(private auth:AuthService,
    private persServ:PersonalService,
    private router:Router) {

     }

  ngOnInit(): void {
    if(localStorage.getItem('email')){
      this.usuario.email=localStorage.getItem('email');
      this.recordarme=true;
    }
  }
  //Inicio de Sesion
  login(form: NgForm){
    if(form.invalid){
      return;
    }
    Swal.fire({  allowOutsideClick: false, icon: 'info', text: 'Espera por favor..'}); 
    Swal.showLoading();
    this.getPersonalActivo(this.usuario);
  }
   //Mostrar la contraseña
   mostrarContrasena() {
    this.mostrarTexto = !this.mostrarTexto;
  }
  //obtiene al personal activo
  private getPersonalActivo(usuario:UsuarioModel){
    this.persServ.getPersonalState(usuario.email).snapshotChanges().pipe(
      map(changes =>
        //key obtiene el id del doc
        changes.map(c=>
          ({key:c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).subscribe(
      personales=>{
      this.personales=personales;
      if(this.personales.length==0){
        //si no se encontro al ningun usuario registrado
        Swal.fire({
          icon: 'error',
          title:'Error al autenticar',
          text: '¡Usuario Inexistente!'}); 
      }
      else{
        //el personal cual a sido encontrado
        console.log(this.personales[0]);
        var encontrado:PersonalModel=this.personales[0];
        if(encontrado.activo==false){
          Swal.fire({
           icon: 'error',
           title:'Error al autenticar',
           text: '¡El usuario esta deshabilitado!'}); 
        }
        else{
          //para iniciar sesión
          this.auth.login(usuario)
          .subscribe(resp=>{
              console.log(resp);
              Swal.close();
               if(this.recordarme){
                 localStorage.setItem('email',this.usuario.email);
               }
              //mantener el incio de sesion
              sessionStorage.setItem('key',encontrado.key);
              sessionStorage.setItem('nombre',encontrado.nombre);
              sessionStorage.setItem('apellido',encontrado.apellido);
              sessionStorage.setItem('cargo',encontrado.cargo);
              sessionStorage.setItem('email',encontrado.email);
              sessionStorage.setItem('activo',String(encontrado.activo));
              sessionStorage.setItem('telefono',encontrado.telefono);
              //redireccion depende el rol
              if(encontrado.cargo == 'Gerente Regional'){
                this.router.navigateByUrl('/admin',);
              }
              if(encontrado.cargo == 'Ingeniero de Tramo'){
                this.router.navigateByUrl('/ing');
              }
              if(encontrado.cargo == 'Secretaria'){
                this.router.navigateByUrl('/secre');
              }
            },(err)=>{
              var mensaje=err.error.error.message;
              if(err.error.error.message == 'INVALID_PASSWORD'){
                mensaje='¡Contraseña Invalida!';
              }
              console.log(mensaje);
              Swal.fire({
                icon: 'error',
                title:'Error al autenticar',
                text: mensaje}); 
            }); 
        }
      }
    },(err)=>{
      var mensaje=err.error.error.message;
            console.log(mensaje);
            Swal.fire({
              icon: 'error',
              title:'Error al autenticar',
              text: mensaje}); 
    }  
    );
  }
}
