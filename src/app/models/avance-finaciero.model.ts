export class AvanceFinacieroModel{
    key?:string;
    montoPago?:number;
    descripcion?:string;
    fechaRegistro?:firebase.firestore.Timestamp;
    periodo:string;
    completado?:boolean;
    avance?:number;
}