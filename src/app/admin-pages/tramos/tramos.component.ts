import { Component, OnInit } from '@angular/core';
import { TramosService } from '../../services/tramos.service';

import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { TramosModel } from '../../models/tramos.model';
import * as firebase from 'firebase';
import { ThemePalette } from '@angular/material/core/common-behaviors/color';
import Swal from 'sweetalert2';
declare var google: any;
// Imports up here..
@Component({
  selector: 'app-tramos',
  templateUrl: './tramos.component.html',
  styleUrls: ['./tramos.component.css']
})
export class TramosComponent implements OnInit {

  //lista de tramos 
  tramos:any;
  tramo:TramosModel=new TramosModel();
  tramoEditar:TramosModel=new TramosModel();
  editar=false;
  //inicio y fin de la Red vial Fundamental
  origin:any;
  destination:any;
  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  mapEle: HTMLElement;
  infoWindow:any;
  //Colores
  public color: ThemePalette = 'primary';
  public touchUi = false;
  //Activadores
  busquedaLatLong=false;
  tramoVerificado=false;
  registraTramo=false;

  inicioBusqueda=false;
  finBusqeda=false;

  //LATITUDE
  inicioRvfLatitude:number;
  inicioRvfLongitude:number;

  finRvfLatitude:number;
  finRvfLongitude:number;
  //marcaodres
  markerInicio: any;
  markerFin:any;

  constructor(private tramoService: TramosService) { }

  ngOnInit(): void {
    this.getTramosList();
    // create a new map by passing HTMLElement
    this.mapEle = document.getElementById('mapTramos');
    this.map = new google.maps.Map(this.mapEle, {
      center: {lat:-16.5,lng: -68.15},
      zoom: 7
    });
    // Configure the click listener. para mostrar en el mapa
    this.map.addListener("click", (mapsMouseEvent) => {
      //Buscar el inicio del Tramo
      if(this.inicioBusqueda){
        //cerrar la info window;
        this.infoWindow.close();
        //enviar los datos
        this.inicioRvfLatitude=mapsMouseEvent.latLng.lat();
        this.inicioRvfLongitude=mapsMouseEvent.latLng.lng();
        //inicio del tramo
        this.markerInicio=new google.maps.Marker({
          position:  mapsMouseEvent.latLng,
          map:this.map,
          title: "Locacion 2",
        });
        this.inicioBusqueda=false;
      }
      //Buscar el fin del Tramo
      if(this.finBusqeda){
        //cerrar la info window;
        this.infoWindow.close();
        this.finRvfLatitude=mapsMouseEvent.latLng.lat();
        this.finRvfLongitude=mapsMouseEvent.latLng.lng();
        this.markerFin = new google.maps.Marker({
          position:  mapsMouseEvent.latLng,
          map: this.map,
          title: "Locacion 2",
        });
        this.finBusqeda=false;
      }
    });
  }
  //Buscar el inicio del tramo en el mapa
  buscarInicioTramo(){
    //Mostrar el mansaje de busqueda
    this.inicioBusqueda=true;
    const myLatlng = { lat:-16.5,lng: -68.15 };
    //  InfoWindow.
    this.infoWindow = new google.maps.InfoWindow({
      content: "Click para obtener la locacion ",
      position: myLatlng,
    });
    this.infoWindow.open(this.map);
  }
  quitarMarcadorInicio(){
    if(this.markerInicio){
      //Eliminar el marcador 
      this.markerInicio.setMap(null);
      this.inicioRvfLatitude=null;
      this.inicioRvfLongitude=null;
    }
  }
  //Buscar el fin del tramo
  buscarFinTramo(){
    //Mostrar el mansaje de busqueda
    this.finBusqeda=true;
    const myLatlng = { lat:-16.5,lng: -68.15 };
    //  InfoWindow.
    this.infoWindow = new google.maps.InfoWindow({
      content: "Click para obtener la locacion ",
      position: myLatlng,
    });
    this.infoWindow.open(this.map);
  }
  quitarMarcadorFin(){
    if(this.markerFin){
      this.markerFin.setMap(null);
      this.finRvfLatitude=null;
      this.finRvfLongitude=null;
    }
  }
  getTramosList(){
    this.tramoService.getTramosList().snapshotChanges().pipe(
      map(changes =>
       changes.map(c=>
         ({key:c.payload.doc.id, ...c.payload.doc.data()})
       )
      )
    ).subscribe(tramos=>{
      this.tramos=tramos;
      console.log(tramos);
      
    });
  }
  //Guardar la informacion del tramo
  guardarTramo(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    this.tramo.color=this.tramo.color.toString();
    console.log(this.tramo);
    this.tramoService.createTramo(this.tramo).then((result) => {
      Swal.fire({
        title:this.tramo.nombre,
        text:'Se registro correctamente',
        icon:'success'
      })
      this.tramoVerificado=false;
      this.registraTramo=false;
      //Quitar el mapa del sistema
      
      this.directionsDisplay.set('directions', null);
      form.resetForm();
      this.tramo=new TramosModel();
    }).catch((err) => {
      Swal.fire({
        title:this.tramo.nombre,
        text:'Error '+err,
        icon:'error'
      })
    });
  }
  editarTramo(tramoElegido:TramosModel){
    this.editar=true;
    this.tramoEditar=tramoElegido;
    this.inicioRvfLatitude=this.tramoEditar.inicioRvf.latitude;
    this.inicioRvfLongitude=this.tramoEditar.inicioRvf.longitude;
    this.finRvfLatitude=this.tramoEditar.finRvf.latitude;
    this.finRvfLongitude=this.tramoEditar.finRvf.longitude;
  }
  guardarTramoEditado(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    this.tramoEditar.color=this.tramoEditar.color.toString();
    console.log(this.tramoEditar);
    this.tramoService.updateTramo(this.tramo).then((result) => {
      Swal.fire({
        title:this.tramoEditar.nombre,
        text:'Se registro correctamente',
        icon:'success'
      })
    }).catch((err) => {
      Swal.fire({
        title:this.tramoEditar.nombre,
        text:'Error '+err,
        icon:'error'
      })
    });
  }
  verificarTramoEditado(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    //enviar el valor del tramo
    this.tramoEditar.inicioRvf=new firebase.firestore.GeoPoint(this.inicioRvfLatitude,this.inicioRvfLongitude);
    this.tramoEditar.finRvf=new firebase.firestore.GeoPoint(this.finRvfLatitude,this.finRvfLongitude);
    this.origin={lat:this.tramoEditar.inicioRvf.latitude, lng:this.tramoEditar.inicioRvf.longitude };
    this.destination={lat:this.tramoEditar.finRvf.latitude, lng:this.tramoEditar.finRvf.longitude };
    //Quitar el mapa del sistema
    //this.markerFin.setMap(null);
    //this.markerInicio.setMap(null);
    this.calculateRoute(this.tramoEditar.color);
  }
  cancelarEditar(form:NgForm){
    this.editar=false;
    form.resetForm();
    this.getTramosList();
    this.cancelarPosicion();
    this.directionsDisplay.set('directions', null);
  }
  //cancelar registro
  cancelarRegistro(form:NgForm){
    this.tramoVerificado=false;
    this.registraTramo=false;
    //Quitar el mapa del sistema
    this.markerFin.setMap(null);
    this.markerInicio.setMap(null);
    form.resetForm();
    this.cancelarPosicion()
    this.directionsDisplay.set('directions', null);
  }
  //eliminar tramo
  eliminarTramo(tramoElegido:TramosModel){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ tramoElegido.nombre }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.tramoService.deleteTramo(tramoElegido).then(
          resp=>{
            Swal.fire({
              title:tramoElegido.nombre,
              text:'Se elimino correctamente',
              icon:'success'
            })
          }
        )
      }
    });
  }
  //VALIDAR LA INFROMACION DEKL TRAMO
  validarTramo(form:NgForm){
    if(form.invalid){
      console.log('Formulario no valido');
      return;
    }
    //enviar el valor del tramo
    this.tramo.inicioRvf=new firebase.firestore.GeoPoint(this.inicioRvfLatitude,this.inicioRvfLongitude);
    this.tramo.finRvf=new firebase.firestore.GeoPoint(this.finRvfLatitude,this.finRvfLongitude);
    this.origin={lat:this.tramo.inicioRvf.latitude, lng:this.tramo.inicioRvf.longitude };
    this.destination={lat:this.tramo.finRvf.latitude, lng:this.tramo.finRvf.longitude };
    this.calculateRoute(this.tramo.color);
  }
  //cancelar la posicion
  cancelarPosicion(){
    this.busquedaLatLong=false;
    if(this.infoWindow){
      this.infoWindow.close();
    }
    
  }
  //habilitar el registro
  habilitarRegistro(){
    this.registraTramo=true;
  }
   //Tramo seleccionado
  verTramo(tramo:TramosModel){
    this.tramo=tramo;
    //tramo.inicioRvf.latitude
    //Cambiar el incio y el fin del tramo
    this.origin={lat:this.tramo.inicioRvf.latitude, lng:this.tramo.inicioRvf.longitude };
    this.destination={lat:this.tramo.finRvf.latitude, lng:this.tramo.finRvf.longitude };
    //CAMBIAR EL COLOR DE LA RUTA SELECCIONADA
    this.calculateRoute(this.tramo.color);
  }
  loadMap() {
    // create map
    this.map = new google.maps.Map(this.mapEle, {
      center: this.origin,
      zoom: 7
    });
    this.directionsDisplay.setMap(this.map);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      //this.mapEle.classList.add('show-map');
      this.calculateRoute(this.tramo.color);
    });
  }
  private calculateRoute(color:string) {
    //cambiar la direccion del mapa
    this.directionsDisplay.setMap(this.map);
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
        this.tramoVerificado=true;
      } else {
        console.log('no se pudo conectar!');
        Swal.fire({
          title:'No se pudo conectar',
          text:'No existe un red vial fundamental en la sección indicada',
          icon:'error',
          allowOutsideClick:false,
          showConfirmButton:true
        });
      }
    });
  }

  tramosInfo(){
      //Ubicaciones de las carreteras
      //LP01
      const lp01=new firebase.firestore.GeoPoint(-16.516416072648976,-68.16724777221681);
      const autopista=new firebase.firestore.GeoPoint(-16.502930464437483,-68.16251635551454);
      const autopista_A_C_LP01=new firebase.firestore.GeoPoint(-16.48255111389834,-68.14600467681886);
      const lacumbre_A_C_LP01=new firebase.firestore.GeoPoint(-16.338183297641848,-68.04018616676332);
      const lacumbre_C_U_LP01=new firebase.firestore.GeoPoint(-16.338064898383248,-68.04020226001741);
      const unduavi_C_U_LP01=new firebase.firestore.GeoPoint(-16.310913540721547,-67.90958404541017);
      const santabarbara_CU_LP01 =new firebase.firestore.GeoPoint(-16.19392513413699,-67.74244487285615);

      //LP02 
      const escoma_E_CH=new firebase.firestore.GeoPoint(-15.662069115334399,-69.12891626358034);
      const charazani_E_CH=new firebase.firestore.GeoPoint(-15.17831555501856,-68.99303555488588);
      const tumupasa = new firebase.firestore.GeoPoint( -14.149180461019963, -67.88876145857843);
      const sanbuenaaventura=new firebase.firestore.GeoPoint(  -14.438382529681226, -67.53496908141625);
      const ixiamas = new firebase.firestore.GeoPoint( -13.7676196,-68.1258503);
      //LP03
      const achacachi = new firebase.firestore.GeoPoint( -16.053943394023182,-68.68061721324922);
      const tiquina_LP03 = new firebase.firestore.GeoPoint( -16.22207133316536,-68.85303497314455);
      const kasani = new firebase.firestore.GeoPoint( -16.22550176262692,-69.09572660923006);
      const quiquimbeyIP=new firebase.firestore.GeoPoint(  -15.388286555341972, -67.11663865832247);
      const yucumbo=new firebase.firestore.GeoPoint(  -15.150925948786577, -67.03479766845705 );
      const rurrenabaque=new firebase.firestore.GeoPoint(  -14.43929684606175, -67.5298085112716 );

      //LP04
      const elalto_lp04_I= new firebase.firestore.GeoPoint(-16.50394886128032,-68.16205501556398);
      const rioseco_lp04_F= new firebase.firestore.GeoPoint(-16.489948006588584,-68.20785641670228);
      const tiquina_LP04 = new firebase.firestore.GeoPoint( -16.21540603361612,-68.84846448898317);
      const huarina = new firebase.firestore.GeoPoint( -16.18961837008835,-68.60672235488893);

      const rioSeco_R_C=new firebase.firestore.GeoPoint(-16.49412470851699,-68.19398403167726);
      const lacumbre_R_C=new firebase.firestore.GeoPoint(-16.338095785153268,-68.04043292999269);
      
      const altomadidi=new firebase.firestore.GeoPoint(-13.568988828944216,-68.59159469604494); 
      
      //LP05
      const apolo=new firebase.firestore.GeoPoint(-14.799841132629489,-68.4220576286316); 
      const tumupasa_LP05=new firebase.firestore.GeoPoint(-14.581091480859854,-68.45224857330324); 
      //LP06
      const caranavi=new firebase.firestore.GeoPoint(  -15.83918046020486, -67.54979252815248);
      const santabarbara=new firebase.firestore.GeoPoint(-16.193744828915097,-67.74243950843812);
      //LP07
      const coroico=new firebase.firestore.GeoPoint(-16.1886022,-67.7274645);
      const puenteVilla=new firebase.firestore.GeoPoint(-16.40303985149322,-67.64284372329713);
      //LP08
      const puenteSacambaya=new firebase.firestore.GeoPoint(-16.930376656137312,-66.99220418930055);
      //LP09
      const lapaz=new firebase.firestore.GeoPoint(-16.504072302957425,-68.16289186477663);
      const oruro1=new firebase.firestore.GeoPoint(-17.653346193863058,-67.21238136291505);
      const oruro2=new firebase.firestore.GeoPoint(-17.9263126514935,-67.11878299713136);

      //LP10
      const viacha= new firebase.firestore.GeoPoint(-16.65313215391816,-68.30247402191164);
      const charaña= new firebase.firestore.GeoPoint(-17.591135068524324,-69.44335699081422);

      //LP11
      const nazacara = new firebase.firestore.GeoPoint(-16.93650406949794,-68.76307368278505);
      const hitoIV = new firebase.firestore.GeoPoint(-17.290085679535647,-69.5952343940735);
      //LP12
      const caquiaviri = new firebase.firestore.GeoPoint(-17.02137435688719,-68.61245155334474);
      const patacamaya = new firebase.firestore.GeoPoint(-17.241809514667512,-67.92872428894044);
      //LP13
      const desaguadero = new firebase.firestore.GeoPoint(-16.58054982233336,-69.03533935546876);

      //llevar al arreglo
      //LP01
      // this.tramoService.createTramo({codigo:'LP01',nombre:'(Sin Nombre)',longitud:88.4 Km"inicioRvf: lp01,finRvf:nazacara,color:'#778041'});
      //this.tramoService.createTramo({codigo:'LP01',nombre:'Autopista - La Cumbre',longitud:"24.8" Km"inicioRvf: autopista_A_C_LP01,finRvf:lacumbre_A_C_LP01,color:'#CA3F73'});
      //this.tramoService.createTramo({codigo:'LP01',nombre:'La Cumbre - Unduavi',longitud:"61.3 Km",inicioRvf: lacumbre_C_U_LP01,finRvf:unduavi_C_U_LP01,color:'#3949CE'});
      //this.tramoService.createTramo({codigo:'LP01',nombre:'Unduavi - Santa Barbara',longitud:"51.6 Km" ,inicioRvf: unduavi_C_U_LP01,finRvf:santabarbara_CU_LP01,color:'#A4A9D9'});
      //LP02 LP02R
      //this.tramoService.createTramo({codigo:'LP02',nombre:'Escoma - Chazani',longitud:"86.49 Km" ,inicioRvf: escoma_E_CH,finRvf:charazani_E_CH,color:'#9E5FD2'});
      //this.tramoService.createTramo({codigo:'LP02R',nombre:'San Buenaventura - Tumupasa',longitud:"53.5 Km" ,inicioRvf: sanbuenaaventura,finRvf:tumupasa,color:'#205434'});
      //this.tramoService.createTramo({codigo:'LP02R',nombre:'Tumupasa - Ixiamas',longitud:"61.3 km" ,inicioRvf: ixiamas,finRvf:tumupasa,color:'#742598'});

      // //LP03
      //({codigo:'LP03',"Achacachi - Escoma","72.38 , achacachi,escoma_E_CH,'#5A641B'});
      //this.tramoService.createTramo({"LP03","Tiquina - Kasani","47.91 Km","#41DB6E", tiquina_LP03,kasani});
     // var =({"LP03R","Quiquimbey - Yucumbo","47.91  Km","#733D9B", quiquimbeyIP,yucumbo,});
      //var =({"LP03R","Yucumbo - Rurrenabaque","47.91  Km","#BBDD82", yucumbo,rurrenabaque,);
    
      //LP04
      //const a =({"LP04","El Alto","5.5 Km","#3D088B", elalto_lp04_I, rioseco_lp04_F);
      //var =({"LP04","Huarina - Achacachi","18.1 Km","#A0301C", huarina,achacachi});
      //var =({"LP04","Rio Seco - La Cumbre","30.5 Km","#CAAB2D", rioSeco_R_C,lacumbre_R_C});
      //var =({"LP04","Huarina - Tiquina","36.7 Km","#24DA10", huarina,tiquina_LP04});
      //var =({"LP04","Rio Seco - Huarina","57.7 Km","#0F38B8", rioseco_lp04_F,huarina});
      //var =({"LP04R","Iximas - Alto Madidi - Chive","80 Km","#E4F2AE", ixiamas,altomadidi});
    
      //LP05
      //var =({"LP05","Apolo - Tumupasa","72.38 Km","#D1DAAC", apolo,tumupasa_LP05});
      //var =({"LP05","Chazani - Cruce Apolo","72.38 Km","#427E51", charazani_E_CH,apolo});
      //LP06
      //var =({"LP06","Caranavi - Quiquibey"," 115 Km","#7CEC98", caranavi,quiquimbeyIP});
     // var =({"LP06","Santa Barbara - Caranavi","66.2 Km","#5A3CC4", santabarbara,caranavi});
//
     // //LP07
     // var =({"LP07","Caranavi - Cruce Apolo","266 Km","#B23012", caranavi,apolo});
     // //LP08
     // var =({"LP08","Coroico - Puente Villa","25.8 Km","#35821B", coroico,puenteVilla});
     // var =({"LP08","Puente Villa - Puente Sacambaya","223 Km","#535B95", puenteVilla,puenteSacambaya});
     // var =({"LP08","Unduavi - Puente Villa","48.6 Km","#F09062", unduavi_C_U_LP01,puenteVilla});
//
     // //LP09
     // var =({"LP09","La Paz - Oruro","181 Km","#28B3B0", lapaz,oruro1});
     // var =({"LP09:","La Paz - Oruro","32 Km","#B35728", oruro1,oruro2});
     // //LP10
     // var =({"LP10","Viacha - Charaña","185 Km","#7F52BF", viacha,charaña});
     // //LP11
     // var =({"LP011","Nazacara - Hito IV","110 Km","#58D96E", nazacara,hitoIV});
     // //LP12
     // var =({"LP12","Caquiaviri - Nazacara","56.8 Km","#AC7B29", caquiaviri,nazacara});
     // var =({"LP12","Patacamaya - Caquiaviri","143 Km","#79D9D9", patacamaya,caquiaviri});
     // //LP13
     // var =({"LP13","Río Seco - Desaguadero","97 Km","#984AEA", rioseco_lp04_F,desaguadero});
      
  }
}
