import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UsuarioModel } from '../models/usuario.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { PersonalModel } from '../models/personal.model';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //autenticar con la Api Key
  private url='https://identitytoolkit.googleapis.com/v1';
  private apikey='AIzaSyAQWN_uYw1iK8VRc03wgapFZdBQEdRoQ78';
  userToken:string;

  //usuarios
  private dbPath = '/usuarios';
  personalRef: AngularFirestoreCollection<PersonalModel> = null;

  constructor(private http:HttpClient,private db: AngularFirestore,private afsAuth: AngularFireAuth) {
    this.leerToken();
   }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
    localStorage.removeItem('rol');
    sessionStorage.clear();
  }
  login(usuario:UsuarioModel){
    //verificar a fireabase
    const authData={
      email:usuario.email,
      password:usuario.pasword,
      returnSecureToken:true
    };
    return this.http.post(
      `${this.url}/accounts:signInWithPassword?key=${this.apikey}`,
      authData
    ).pipe(
      map(resp=>{
        //Guardar el token de acceso
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }
  //Buscar si el usuario esta activo
  findUserActive(email:string){
    return this.db.collection('personal', ref => ref.where('email', '==', email));  
  }

  //registrar
  createUsuario(usuario:UsuarioModel){
    //enviar a fireabase
    const authData={
      email:usuario.email,
      password:usuario.pasword,
      returnSecureToken:true
    };
    return this.http.post(
      `${this.url}/accounts:signUp?key=${this.apikey}`,
      authData
    ).pipe(
        map(resp=>{
          console.log('entro en el mapa de RJXS');
          this.guardarToken(resp['idToken']);
          return resp;
        })
    );

  }
  //Guardar el token de los usuarios
  private guardarToken(idToken:string){
    this.userToken=idToken;
    localStorage.setItem('token',idToken);
    //validar token hora
    let hoy= new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira',hoy.getTime().toString());
  }
  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken=localStorage.getItem('token');
    }else{
      this.userToken='';
    }
    return this.userToken;
  }
  //Autenticación de Gerente
  isAuth():boolean{
    if(this.userToken.length<2){
      return false;
    }
    const rol=String (sessionStorage.getItem('cargo'));
    const expira=Number (localStorage.getItem('expira'));
    console.log(rol);
    
    const expiraDate=new Date();
    expiraDate.setTime(expira);
    if(expiraDate>new Date()&& rol == 'Gerente Regional'){
      return true; 
    }else{
      return false;
    }
  }
  //Autenticación de Ing Tramo
  isAuthIng():boolean{
    if(this.userToken.length<2){
      return false;
    }
    const rol=String (sessionStorage.getItem('cargo'));
    const expira=Number (localStorage.getItem('expira'));
    console.log(rol);
    
    const expiraDate=new Date();
    expiraDate.setTime(expira);
    if(expiraDate>new Date()&& rol == 'Ingeniero de Tramo'){
      return true; 
    }else{
      return false;
    }
  }
  //Autenticación de Secretaria
  isAuthSecre():boolean{
    if(this.userToken.length<2){
      return false;
    }
    const rol=String (sessionStorage.getItem('cargo'));
    const expira=Number (localStorage.getItem('expira'));
    console.log(rol);
    const expiraDate=new Date();
    expiraDate.setTime(expira);
    if(expiraDate>new Date()&& rol == 'Secretaria'){
      return true; 
    }else{
      return false;
    }
  }
}
