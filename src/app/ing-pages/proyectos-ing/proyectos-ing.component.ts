import { Component, OnInit } from '@angular/core';
import { ProyectoModel } from '../../models/proyectos.model';
import { ProyectosService } from '../../services/proyectos.service';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { DocumentoModel } from '../../models/document.model';
import { FileItem } from '../../models/file-item';
import Swal from 'sweetalert2';
import { AvanceFisicoService } from '../../services/avance-fisico.service';
import { AvanceFinancieroService } from '../../services/avance-financiero.service';
import { AvanceFisicoModel } from '../../models/avance-fisico.model';
import { AvanceFinacieroModel } from '../../models/avance-finaciero.model';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import firebase from 'firebase';
//mapa de google
declare var google: any;
import { PersonalModel } from '../../models/personal.model';
//Formatear la decha
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
  selector: 'app-proyectos-ing',
  templateUrl: './proyectos-ing.component.html',
  styleUrls: ['./proyectos-ing.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ProyectosIngComponent implements OnInit {
  personalLogeado:PersonalModel=new PersonalModel;

  //Proyectos
  proyectos:ProyectoModel[];
  proyecto:ProyectoModel;
  //activadores 
  cargando=false;
  //inicio y fin de la Red vial Fundamental
  origin:any;
  destination:any;
  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  mapEle: HTMLElement;


  //documentos
  docs:DocumentoModel[] = [];
  estaSobreElemento = false;
  archivos: FileItem[] = [];
  docsAgregar = false;

  //Avance Fisico
  avanceFisicoList:AvanceFisicoModel[];
  avanceFisico:AvanceFisicoModel;
  avanceFisicoElegido:AvanceFisicoModel;
  avanceFisicoSelecionado:boolean=false;
  //completado avacne
  avanceFisicoSeleCompletado:boolean=false;


  //Charts 
  //graficos
  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;

  //min an max date
  minDateFisico: Date;
  minDateFinanciero: Date;

  //Global
  globalFisico:number;
  globalFinanciero:number;
 constructor(
   private proyectoService:ProyectosService,
   private avanceFisicoService:AvanceFisicoService,
   private avanceFinacieroService:AvanceFinancieroService,
   ) 
   {}

 ngOnInit(): void {
   this.recuperarSesion();
   //cargando los proyectos
   this.cargando=true;
   this.getProyectosList();
   // create a new map by passing HTMLElement
   this.mapEle = document.getElementById('mapHome');
   //Crear mapa en el departamento de La Paz
   this.map = new google.maps.Map(this.mapEle, {
     center: {lat:-16.5,lng: -68.15},
     zoom: 7
   });
 }
 recuperarSesion()  {
   this.personalLogeado.key=sessionStorage.getItem('key');
   this.personalLogeado.nombre=sessionStorage.getItem('nombre');
   this.personalLogeado.apellido=sessionStorage.getItem('apellido');
   this.personalLogeado.cargo=sessionStorage.getItem('cargo');
   this.personalLogeado.email=sessionStorage.getItem('email');
   this.personalLogeado.activo=Boolean(sessionStorage.getItem('activo'));
   this.personalLogeado.telefono=sessionStorage.getItem('telefono');

 }

  //----------------------------PROYECTOS-------------------
 //proyectos
 getProyectosList(){
   this.proyectoService.getproyectosActivasIngeniero(this.personalLogeado.key).snapshotChanges().pipe(
     map(changes =>
       //key obtiene el id del doc
       changes.map(c=>
         ({key:c.payload.doc.id, ...c.payload.doc.data()})
       )
     )
   ).subscribe(proyectos=>{
     this.proyectos=proyectos;
     console.log(this.proyectos);
     
     this.cargando=false;
     //Obtener el avance fisico y finaciero y global
     let avanceFisicoGlobal: number = 0;
     this.proyectos.forEach(p => { avanceFisicoGlobal += p.avanceFisico });
     this.globalFisico=avanceFisicoGlobal/proyectos.length;   
     console.log('global fisico',this.globalFisico);
   })
 }
 //proyecto seleccionado
 verProyecto(proyecto:ProyectoModel){
   this.proyecto=proyecto;
   //direcciones de los tramos
   this.origin={lat:this.proyecto.tramo.inicioRvf.latitude, lng:this.proyecto.tramo.inicioRvf.longitude };
   this.destination={lat:this.proyecto.tramo.finRvf.latitude, lng:this.proyecto.tramo.finRvf.longitude };
   this.calculateRoute(this.proyecto.tramo.color);
   //avance Fisico
   this.cargarAvanceFisico(this.proyecto);
 }
   //----------------------------AVANCE FISICO-------------------
 //Cargar el documenos de avance fisico
 registrarAvanceFisico(form:NgForm){
   //Verificar que el avance no sea mayor al total 
   var vefificarAvance:number=this.proyecto.avanceFisico+this.avanceFisico.avance;
   if(vefificarAvance > 100){
     console.log('Avance exedido');
     Swal.fire({
       icon: 'error',
       title:'Formulario no valido',
       text: '¡El avance fisico sobrepasa el valor permitido!'}); 
     return;
   }
   //formulario Invalido
   if(form.invalid){
     console.log('Formulario no valido');
     Swal.fire({
       icon: 'error',
       title:'Formulario no valido',
       text: '¡Llene los campos correctamente!'}); 
     return;
   }
   Swal.fire({
     title:'Espere',
     text:'Registrando Proyecto',
     icon:'info',
     allowOutsideClick:false,
     showConfirmButton:false
   });
   Swal.showLoading();
   //--actulizar
   //Cambio de tipo moment a Firestore timestramp
   const fechaRegistroParceada = firebase.firestore.Timestamp.fromDate(new Date(this.avanceFisico.fechaRegistro.toDate()));
   this.avanceFisico.fechaRegistro=fechaRegistroParceada;
   console.log(this.proyecto);
   console.log('avance fisico:'+this.avanceFisico);
   //Registro y actualizacion del avance Fisico
   this.avanceFisicoService.updateAvanceFisico(this.proyecto.key,this.avanceFisico).then(
     resp=>{
       Swal.fire({
         title:'Avance fisico del periodo '+ this.avanceFisico.periodo +' de '+ this.avanceFisico.avance + ' %',
         text: 'Actividad:'+ this.avanceFisico.actividad +'. Se registro correctamente.',
         icon: 'success',
         allowOutsideClick:false,
       }).then(
         resp=>{
           //Si el avance fisico de peridodo no fue completado
           if(!this.avanceFisico.completado){
             Swal.fire({
               title:'¡Actividad sin completar!',
               text:'El avance fisico actual general sigue siendo el mismo. Puede teminar de completar el periodo '+ this.avanceFisico.periodo +' mas tarde.',
               icon: 'info',
               allowOutsideClick:false,
               showConfirmButton:false
             });
           }
           //Si el avance fisico del perido fue completado se actualiza el avance fisico general
           else{
             //Registrar el nuevo avance fisico
             let nuevoAvanceFisico: number = 0;
             this.avanceFisicoList.forEach(a => { if(a.completado) nuevoAvanceFisico += a.avance});
             console.log(nuevoAvanceFisico );
             this.proyectoService.actualizarAvanceFisicoProyecto(this.proyecto,nuevoAvanceFisico).then(
               proyecto=>{
                 //cargar el avace fisico actualizado
                 this.proyecto.avanceFisico=nuevoAvanceFisico;
                 //this.cargarAvanceFisico(this.proyecto);
                 
                 Swal.fire({
                   title:this.proyecto.nombreProyecto,
                   text:'El nuevo avance fisico general del proyecto es de '+nuevoAvanceFisico+' %',
                   icon: 'success',
                   allowOutsideClick:false,
                 });
               }
             );
           }
           form.resetForm();
           this.avanceFisico=new AvanceFisicoModel();
           this.avanceFisicoSelecionado=false;
        }
       ) 
     });
 
 }
 //cancelar el avance fisico a registrar
 cancelarAvanceFisico(form:NgForm){
   form.resetForm();
   this.avanceFisico=new AvanceFisicoModel();
   //camiar el estado afalso
   this.ocultarAvanceFisico;
 }
 //cargar  el avance Fisico del proyecto selecionado
 cargarAvanceFisico(proyecto:ProyectoModel){
   this.avanceFisicoService.getAvanceFisicoNoCompletadosList(proyecto.key).snapshotChanges().pipe(
     map(changes=>
       //key obtiene el id del doc
       changes.map(c=>
         ({key:c.payload.doc.id, ...c.payload.doc.data()})
       )
     )
   ).subscribe(
     avances=>{
       this.avanceFisicoList=avances;
       console.log(this.avanceFisicoList);
       //CARGAR LOS CHARS CON LOS DATOS OBTENIDOS
       var ini = new Date(proyecto.inicioServicio.toDate());
       var fechaInicio = moment(ini);   
       //enviando la fecha inicial del contrato en la cual inicara el proyecto
       
       this.datosChartAvanceFisico(this.avanceFisicoList,fechaInicio.format("YYYY-MM"));
     }
   );
 }
 //selecionar avance Fisico
 selectedAvanceFisico(avance:AvanceFisicoModel){
   if(avance.completado){this.avanceFisicoSeleCompletado = true}
   else{this.avanceFisicoSeleCompletado = false}
   this.avanceFisico=avance;
   console.log('Selecionado',this.avanceFisicoElegido);
   console.log('ENVIADO',avance);
   //Definir la fecha del peridod del avacne
   const periodoAvance = new Date(Date.parse(avance.periodo+'-02'));
   console.log(periodoAvance);
   //mindate es la fecha minima aingresar el avance fisico dependiendo a su periodo
   this.minDateFisico = new Date(periodoAvance);
 }
 //Agregar el avance fisico ACTIVADOR
 agregarAvanceFisico(){
   this.avanceFisicoSelecionado=true;
 }
 ocultarAvanceFisico(){
   this.avanceFisicoSelecionado=false;
 }
  

 //calcular la ruta
 private calculateRoute(color:string) {
   this.directionsDisplay.setMap(this.map);
   //cambiar la direccion del mapa
   this.directionsDisplay.setOptions({
     polylineOptions:{
       strokeColor: color
     }
   });
   this.directionsService.route({
     origin: this.origin,
     destination: this.destination,
     travelMode: google.maps.TravelMode.DRIVING,
   }, (response, status)  => {
     if (status === google.maps.DirectionsStatus.OK) {
       this.directionsDisplay.setDirections(response);
      console.log( this.directionsDisplay.directions.routes[0].legs[0].distance.text);
     } else {
       console.log('no se pudo conectar!');
     }
   });
 }
 datosChartAvanceFisico(avanceFisicoList:AvanceFisicoModel[],fechaInicio:string){
   console.log('a fisico list',avanceFisicoList);
   const avance=[];
   const avanceObtenido=[];
   const periodos=[];
   //Obtener el avance fisico
   let avanceFisico: number = 0;
   //Fecha Inicio del contrato con valor 0 y el avance de 0
   avance.push(0);
   avanceObtenido.push(0);
   periodos.push(fechaInicio);
   //RECORRER LOS DOCUMENTOS 
   avanceFisicoList.forEach(element => {
     if(element.completado){
       //sumar el porcentaje de avance
       avanceFisico+=element.avance;
       avanceObtenido.push(avanceFisico);
       avance.push(element.avance);  
     }periodos.push(element.periodo);
   });
   //para dibuar el grafico
   this.avanceFisicoCharts(avance,avanceObtenido,periodos);
 }
 //Dibujar el grafico de los charts
 avanceFisicoCharts(avance:any,avanceObtenido:any,periodos:any){
   //eliminar y crear otro chart para evitar la sobre posicion
   document.getElementById("chartAvanceFisico").remove();
   var canvas = document.createElement("canvas");
   canvas.id = "chartAvanceFisico";
   canvas.width=400;
   canvas.height=100;
   document.getElementById("contenedorAvanceFisico").appendChild(canvas);
   var speedCanvasFisico = document.getElementById("chartAvanceFisico");
   if(avance.length == 0){
     console.log('no se registro ningun avance');
   }
   else{
     console.log(avance);
     console.log(periodos);
     var dataFirst = {
       data: avanceObtenido,
       fill: false,
       borderColor: '#fbc658',
       backgroundColor: 'transparent',
       pointBorderColor: '#fbc658',
       pointRadius: 4,
       pointHoverRadius: 4,
       pointBorderWidth: 10,
     };
     var speedData = {
       labels: periodos,
       //datasets: [dataFirst, dataSecond]
       datasets: [dataFirst]
     };
     var chartOptions = {
       legend: {
         display: false,
         position: 'top'
       }
     };
     var lineChartAvanceFisico = new Chart(speedCanvasFisico, {
       type: 'line',
       hover: false,
       data: speedData,
       options: chartOptions
     });
     
   }
 }


}
