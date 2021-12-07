import { Component, OnInit } from '@angular/core';
import { EmpresasService } from '../../services/empresas.service';
import { NgForm } from '@angular/forms';
import { EmpresaModel } from 'src/app/models/empresas.model';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  
  empresa: EmpresaModel=new EmpresaModel();
  empresaEditar: EmpresaModel;
  //lista
  empresas: EmpresaModel[];
  //mientras no muestre nada
  cargando=false;
  editar=false;
  constructor( private empresaService: EmpresasService) {
   }

  ngOnInit() {
    this.cargando=true;
    this.getEmpresas();
  }
 
  guardarEmpresa(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    //icon = type
    Swal.fire({
      title:'Espere',
      text:'Registrando Empresa o Asociación',
      icon:'info',
      allowOutsideClick:false,
      showConfirmButton:false
    });
    Swal.showLoading();
    //Para actualizar tiene que tener una key
    //registrar empresa
    this.empresaService.createEmpresa(this.empresa).then(
      resp=>{
        Swal.fire({
          title:this.empresa.nombre,
          text:'Se registro correctamente',
          icon:'success'
        }).then(
          resp=>{
            form.resetForm();
            this.empresa=new EmpresaModel();
          }
        );
      }).catch((err) => {
        Swal.fire({
          title:this.empresaEditar.nombre,
          text:'Error '+err,
          icon:'error'
        })
      });
    
  }
  //cargar las empresas
  getEmpresas(){
    this.empresaService.getEmpresasList().snapshotChanges().pipe(
      map(changes =>
       changes.map(c=>
         ({key:c.payload.doc.id, ...c.payload.doc.data()})
       )
      )
      //empresas de la base de datos
    ).subscribe(empresas=>{
      this.empresas=empresas;
      this.cargando=false;
    })
  }

  updateEmpresa(empresaSelecionada:EmpresaModel){
    this.editar=true;
    this.empresaEditar=empresaSelecionada;
  }
  //eliminar la empresa
  eliminarEmpresa(empresaSelec: EmpresaModel){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ empresaSelec.nombre }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.empresaService.deleteEmpresa(empresaSelec.key).then(
          resp=>{
            Swal.fire({
              title:'Eliminado',
              text:'Se elimino correctamente a la empresa',
              icon:'success'
            })
          }
        )
      }
    });
  }

  //empresa editada
  guardarEmpresaEditada(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    if (this.empresaEditar.key){
      Swal.fire({
        title: '¿Está seguro?',
        text: `Está seguro que desea actualizar a ${ this.empresaEditar.nombre }`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then( resp => {
        if ( resp.value ) {
          //para actulizar
          this.empresaService.updateEmpresa(this.empresaEditar).then(
            resp=>{
              Swal.fire({
                title:this.empresa.nombre,
                text:'Se actulizo correctamente',
                icon:'success'
              })
              this.editar=false;
              form.resetForm();
              this.empresaEditar=new EmpresaModel();
            }).catch((err) => {
              Swal.fire({
                title:this.empresaEditar.nombre,
                text:'Error '+err,
                icon:'error'
              })
            });
        }
      });
    }
  }
  //cancelar registro
  cancelarRegistro(form:NgForm){
    form.resetForm();
  }
  //cancelar registro
  cancelarEditar(form:NgForm){
    this.editar=false;
    this.empresaEditar=new EmpresaModel();
    this.getEmpresas();
  }
}
