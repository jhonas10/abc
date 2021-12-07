import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { PersonalModel } from '../../models/personal.model';
import { UsuarioModel } from '../../models/usuario.model';
import { PersonalService } from '../../services/personal.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  personales: PersonalModel[];
  personal:PersonalModel=new PersonalModel();
  personalEditar:PersonalModel= new PersonalModel();
  usuario: UsuarioModel= new UsuarioModel();
  editar=false;
  //compara las contraseñas
  passwordUno:string;
  passwordDos:string;
  //para ver la contraseña
  mostrarTexto: boolean;
  mostrarTexto2: boolean;
  constructor(private personalService:PersonalService) { }

  ngOnInit(): void {
    this.getPersonalList();
  }
  registrarPersonal(form: NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    if(this.passwordUno != this.passwordDos){
      console.log('Formulario no valido');
      
      Swal.fire({
        title: 'Error',
        text: '¡Las contraseñas proporcionadas no son iguales!',
        icon: 'info',
      })
      return;
    }
    
    Swal.fire({
      title:'Espere',
      text:'Registrando Personal',
      icon:'info',
      allowOutsideClick:false,
      showConfirmButton:false
    });
    Swal.showLoading();
    this.usuario.email=this.personal.email
    this.usuario.pasword=this.passwordUno;
    this.personalService.createPersonal(this.usuario,this.personal).then(
      resp=>{
        Swal.fire({
          title:this.personal.nombre+" "+this.personal.apellido,
          text:'Se registro correctamente',
          icon:'success'
        }).then(
          resp=>{
            form.resetForm();
            this.personal=new PersonalModel();
          }
        )
      });
    
  }
  //Mostrar la contraseña
  mostrarContrasena() {
    this.mostrarTexto = !this.mostrarTexto;
  }
  mostrarContrasena2() {
    this.mostrarTexto2 = !this.mostrarTexto2;
  }
  cancelarRegistro(form: NgForm){
    form.resetForm();
  }
  editarPersonal(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea actualizar a ${ this.personalEditar.nombre }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        //para actulizar
        this.personalService.updatePersonal(this.personalEditar);
        this.editar=false;
        form.resetForm();
        this.personal=new PersonalModel();
      }
    });
  }
  //cancelar la subida
  cancelarActualizar(form: NgForm){
    //form.resetForm();
    this.editar=false;
    this.getPersonalList();
  }

  getPersonalList(){
    this.personalService.getPersonalList().snapshotChanges().pipe(
      map(changes =>
        //key obtiene el id del doc
        changes.map(c=>
          ({key:c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).subscribe(personales=>{
      this.personales=personales;
    })
  }
  updatePersonal(personalElegido:PersonalModel){
    //this.personalService.updatePersonal(this.personal.Key,personal)
    this.editar=true;
    this.personalEditar=personalElegido;
    console.log(personalElegido);
  }
  deletePersonal(personalElegido:PersonalModel){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ personalElegido.nombre }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.personalService.deletePersonal(personalElegido.key);
      }
    });
  }

}
