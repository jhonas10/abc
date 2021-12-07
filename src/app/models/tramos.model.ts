export class TramosModel {
    key?:string; 
    codigo: string;
    nombre: string;
    inicioRvf: firebase.firestore.GeoPoint;
    finRvf: firebase.firestore.GeoPoint;
    longitud: string;
    color:string;
}