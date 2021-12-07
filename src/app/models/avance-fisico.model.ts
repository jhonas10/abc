export class AvanceFisicoModel{
    key?:string;
    actividad?:string;
    fechaRegistro?:firebase.firestore.Timestamp;
    periodo:string;
    completado?:boolean;
    avance?:number;
}