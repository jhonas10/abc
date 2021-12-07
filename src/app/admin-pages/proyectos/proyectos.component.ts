import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { EmpresaModel } from '../../models/empresas.model';
import { EmpresasService } from '../../services/empresas.service';
import { map } from 'rxjs/operators';
import { TramosService } from '../../services/tramos.service';
import { TramosModel } from '../../models/tramos.model';
import { ProyectoModel } from '../../models/proyectos.model';
import { ProyectosService } from '../../services/proyectos.service';
import { PersonalModel } from '../../models/personal.model';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { PersonalService } from '../../services/personal.service';
import { FileItem } from '../../models/file-item';
import * as moment from 'moment';
import { AvanceFisicoModel } from '../../models/avance-fisico.model';
import { AvanceFisicoService } from '../../services/avance-fisico.service';
import { AvanceFinancieroService } from '../../services/avance-financiero.service';
import { MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import firebase from 'firebase';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ProyectosComponent implements OnInit {
  //graficos
  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;



  //fechas min and max
  minDate: Date;
  maxDate: Date;

  //listas
  empresas:EmpresaModel[];
  tramos:TramosModel[];
  ingenieros:PersonalModel[];
  proyectos:ProyectoModel[];
  avanceFisico:AvanceFisicoModel[];

  //Objetos
  tramo:TramosModel;
  empresa:EmpresaModel;
  ingTramo:PersonalModel
  //ingeniero:PersonalModel;
  proyecto:ProyectoModel=new ProyectoModel();
  personal:PersonalModel=new PersonalModel();
  proyectoEditar:ProyectoModel=new ProyectoModel();
  // activadores booleanos
  tramoSel:boolean=false;
  empresaSel:boolean=false;
  //Hasta que se encuntren registros
  cargando:boolean=false;
  
  //editar
  editar:boolean= false;
  
  //documentos
  estaSobreElemento = false;
  archivos: FileItem[] = [];



  constructor(private proyectoService:ProyectosService,
    private empresaService:EmpresasService,
    private tramosService:TramosService,
    private personalService: PersonalService,
    private avanceFisicoService:AvanceFisicoService,
    private avanceFinacieroService:AvanceFinancieroService) {

    this.cargarEmpresasActivas();
    this.cargarTramos();
    this.cargarIngenierosActivos();
    
    //fechas
    const currentDate = new Date()
    const currentYear = new Date().getFullYear();
    //Inicia desde el dia actual
    //this.minDate = new Date(currentDate);
    //Inicia en desde este año
    this.minDate = new Date(currentYear - 0, 0 ,1);
    //Finaliza dento de 2 años
    this.maxDate = new Date(currentYear + 2, 11, 31);
   }

  ngOnInit(){
    this.cargando=true;
    //Cargar los proyectos
    this.getProyectosList();
  }

  //registro del proyecto
  registrarProyecto(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    //Eliminar el key de los documentos que no se utilizaran
    const tramo={...this.tramo}; delete tramo.key; 
    const empresa={...this.empresa}; delete empresa.key,empresa.activo;
    //el key de ing de tramo ayudara a identificar los proyectos a su cargo
    const ingTramo={...this.ingTramo}; delete ingTramo.activo; 
    this.proyecto.tramo=tramo;
    this.proyecto.empresa=empresa;
    this.proyecto.ingTramo=ingTramo;
    this.proyecto.avanceFisico=0;
    this.proyecto.avanceFinanciero=0;
    this.proyecto.montoPagado=0;
    this.proyecto.montoCompletar=this.proyecto.montoVigente;
    //para sacar los meses de periodo
    var ini = new Date(this.proyecto.inicioServicio.valueOf());
    var fin = new Date(this.proyecto.conclusionServicio.valueOf());
    //PARCEAR LA FECHA
    const fechaOrdenParceada = firebase.firestore.Timestamp.fromDate(new Date(this.proyecto.ordenProceder.toDate()));
    this.proyecto.ordenProceder=fechaOrdenParceada;

    const fechaInicioParceada = firebase.firestore.Timestamp.fromDate(ini);
    const fechaFinParceada = firebase.firestore.Timestamp.fromDate(fin);
    this.proyecto.inicioServicio=fechaInicioParceada;
    this.proyecto.conclusionServicio=fechaFinParceada;
    Swal.fire({
      title:'Espere',
      text:'Registrando Proyecto',
      icon:'info',
      allowOutsideClick:false,
      showConfirmButton:false
    });
    Swal.showLoading();
 
    this.proyectoService.createproyecto(this.proyecto).then(
      resp=>{
        const key=resp.id;
        console.log(resp.id);
        console.log(resp);
        this.obtenerMesesEntre(ini,fin,resp.id);
        Swal.fire({
          title:this.proyecto.nombreProyecto,
          text:'Se registro correctamente',
          icon: 'success',
        }).then(
          resp=>{
            form.resetForm();
            this.proyecto=new ProyectoModel();
            this.tramo=new TramosModel();
            this.ingTramo=new PersonalModel();
            this.empresa=new EmpresaModel();
         }
        ) 
      });
      console.log(this.proyecto);
    
    
  }
  cancelarRegistro(form:NgForm){
    form.resetForm()
  }
  //actulizar
  actualizarProyecto(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    //actulizar el proyecto
    if(this.proyectoEditar.key){
      Swal.fire({
        title: '¿Está seguro?',
        text: `Está seguro que desea actualizar a ${ this.proyectoEditar.nombreProyecto }`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then( resp => {
        if ( resp.value ) {
          //para actulizar
          this.proyectoEditar.ingTramo=this.ingTramo;
          this.proyectoService.updateproyecto(this.proyectoEditar).then(
            resp=>{
              Swal.fire({
                title:'Proyecto Actualizado',
                text:'Se actualizo correctamente',
                icon:'success'
              });
            }
          )
          this.editar=false;
          form.resetForm();
          this.proyecto=new ProyectoModel();
          this.tramo=new TramosModel();
          this.ingTramo=new PersonalModel();
          this.empresa=new EmpresaModel();
        }
      });
    }
  }
  cancelarActualizar(){
    this.editar=false;
    this.getProyectosList();
  }
  //Para obtener los meses entre las fechas para el avance fisico y finaciero
  obtenerMesesEntre(inicio:Date,fin:Date, proyectoKey:string){
    //periodos de registro
    var periodos = [];
    var fechaInicio = moment(inicio);
    var fechaFin = moment(fin);
    console.log(fechaInicio);
    console.log(fechaFin);
    console.log(fechaFin.diff(fechaInicio, 'months'), ' meses de diferencia');
    if (fechaFin.isBefore(fechaInicio)) {
        throw "End date must be greated than start date."
    }      
    //YYY-MM-DD
    while (fechaInicio.isBefore(fechaFin)) {
        fechaInicio.add(1, 'month');
        periodos.push(fechaInicio.format("YYYY-MM"));
        const avance:AvanceFisicoModel=new AvanceFisicoModel;
        avance.periodo=fechaInicio.format("YYYY-MM");
        avance.completado=false;

        //crear el avance fisico y finaciero 
        this.avanceFisicoService.createAvanceFisico(proyectoKey,avance);
        this.avanceFinacieroService.createAvanceFinaciero(proyectoKey,avance);
        //avanceFisico.push({actividad:null,fechaRegistro:null,periodo:fechaInicio.format("MM-YYYY"),realizado:false,avance:0});
    }
    console.log(periodos);
  }
  //proyectos
  getProyectosList(){
    this.proyectoService.getProyectosList().snapshotChanges().pipe(
      map(changes =>
        //key obtiene el id del doc
        changes.map(c=>
          ({key:c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).subscribe(proyectos=>{
      this.proyectos=proyectos;
      this.cargando=false;
    })
  } 
  cargarIngenierosActivos(){
    this.personalService.getIngenierosActivos().snapshotChanges().pipe(
      map(changes=>
        //key obtiene el id del doc
        changes.map(c=>
          ({key:c.payload.doc.id, ...c.payload.doc.data()})
        )
        )
      ).subscribe(
        irts=>{
          this.ingenieros=irts;
        }
      )
    
  }
  cargarEmpresasActivas(){
    this.empresaService.getEmpresasActivas().snapshotChanges().pipe(
      map(changes=>
      //key obtiene el id del doc
      changes.map(c=>
        ({key:c.payload.doc.id, ...c.payload.doc.data()})
      )
      )
    ).subscribe(
      empresas=>{
        this.empresas=empresas;
      }
    )
    
  }
  cargarTramos(){
    this.tramosService.getTramosList().snapshotChanges().pipe(
      map(changes=>
        //key obtiene el id del doc
        changes.map(c=>
          ({key:c.payload.doc.id, ...c.payload.doc.data()})
        )
        )
      ).subscribe(
        tramos=>{
          this.tramos=tramos;
          console.log(this.tramos);
          
        }
    )
  }
  //tramo seleccionado
  selectedTramo(tramo:TramosModel){
    this.proyecto.longitud=tramo.longitud;
    console.log(this.tramo);
    this.tramoSel=true;
  }
  //empresa seleccionado
  selectedEmpresa(){
    console.log(this.empresa);
    this.empresaSel=true;
  }
  //empresa seleccionado
  selectedIngeniero(){
    console.log(this.ingTramo);
  }
  deleteProyecto(proyectoElegido:ProyectoModel){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ proyectoElegido.nombreProyecto }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.proyectoService.deleteProyecto(proyectoElegido.key).then(
        resp=>{
          Swal.fire({
            title:'Proyecto Eliminado',
            text:'Se elimino correctamente',
            icon:'success'
          });
        });
      }
    });
  }
  updateProyecto(proyectoElegido:ProyectoModel){
    this.editar=true;
    var orden=new Date(proyectoElegido.ordenProceder.seconds*1000);
    console.log(proyectoElegido);
    console.log(orden);
    console.log(this.proyecto);
    this.proyectoEditar=proyectoElegido;
   
  }
}
