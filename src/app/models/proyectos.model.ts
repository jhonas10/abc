import { EmpresaModel } from './empresas.model';
import { TramosModel } from './tramos.model';
import { PersonalModel } from './personal.model';
export class ProyectoModel{
    key?:string;
    nombreProyecto: string;
    procesoContratacion:string;
    financiador:string;
    longitud:string;
    ordenProceder:firebase.firestore.Timestamp;
    inicioServicio:firebase.firestore.Timestamp;
    conclusionServicio:firebase.firestore.Timestamp;
    plazoContrato:string;
    montoVigente:number;
    montoPagado:number;
    montoCompletar:number;
    avanceFisico:number;
    avanceFinanciero:number;
    realizarAcciones:string;
    estadoServicio:string;
    activo:boolean;
    ingTramo:PersonalModel;
    tramo:TramosModel;
    empresa:EmpresaModel;
}