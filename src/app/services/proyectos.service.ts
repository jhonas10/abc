import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ProyectoModel } from '../models/proyectos.model';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';
import { DocumentoModel } from '../models/document.model';
@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private dbPath='/proyecto';
  //carpeta de documentos
  private CARPETA_DOCUMENTOS ='docs';
  proyectosRef:AngularFirestoreCollection<ProyectoModel>=null;
  constructor(private db:AngularFirestore) {
    this.proyectosRef=db.collection(this.dbPath);
  }
  createproyecto(proyecto:any){
    return this.proyectosRef.add({...proyecto});
  }
  updateproyecto(proyecto:ProyectoModel): Promise<void> {
    //Para elmiminar la key y no se duplique
    const proyectoTemp ={
      ...proyecto
    }
    delete proyectoTemp.key;
    return this.proyectosRef.doc(proyecto.key).update(proyectoTemp);
  }
  deleteProyecto(key: string): Promise<void> {
    return this.proyectosRef.doc(key).delete();
  }
 
  getProyectosList(): AngularFirestoreCollection<ProyectoModel> {
    return this.proyectosRef;
  }
  //Actualizar el avance fisico de los proyectos 
  actualizarAvanceFisicoProyecto(proyecto:ProyectoModel,avanceFisicoNuevo:number){
    return this.proyectosRef.doc(proyecto.key).update({'avanceFisico': avanceFisicoNuevo});
  }
  //Actualizar el avance financiero de los proyectos 
  actualizarAvanceFinacieroProyecto(proyecto:ProyectoModel,avanceFinacieroNuevo:number,montoCompletarNuevo:number,montoPagadoNuevo:number){
    return this.proyectosRef.doc(proyecto.key).update({'avanceFinanciero': avanceFinacieroNuevo,'montoCompletar':montoCompletarNuevo,'montoPagado':montoPagadoNuevo});
  }

  //Obtener los proyectos activos 
  getproyectosActivas(): AngularFirestoreCollection<ProyectoModel>{
    return this.db.collection(this.dbPath, ref => ref.where('activo', '==',true));
  }
  //Obtener los proyectos activos 
  getproyectosActivasIngeniero(ingKey:string): AngularFirestoreCollection<ProyectoModel>{
    return this.db.collection(this.dbPath, ref => ref.where('activo', '==',true).where('ingTramo.key','==',ingKey));
  }
  
  private guardarDoc(documento:{nombre:string, url:string}){
    this.db.collection(`/${ this.CARPETA_DOCUMENTOS }`).add(documento);
  }
  //DOCUMENTOS
  
  cargarDocumentosFirebase(proyectoKey:string,carpeta:string, documentos: FileItem[] ) {
    const storageRef = firebase.storage().ref();
    for ( const item of documentos ) {
      item.estaSubiendo = true;
      if ( item.progreso >= 100 ) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask =
                  storageRef.child(`${ this.CARPETA_DOCUMENTOS }/${ carpeta }/${ item.nombreArchivo }`)
                            .put( item.archivo );
      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ( snapshot: firebase.storage.UploadTaskSnapshot ) =>
                    item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
        ( error ) => console.error('Error al subir', error ),
        async () => {
          //Registrar en firestore
          console.log('Documentos guardados correctamente');
          item.url = await  uploadTask.snapshot.ref.getDownloadURL();
          item.estaSubiendo = false;
          //guardar la direccion en la base de datos
          this.db.collection(this.dbPath).doc(proyectoKey).collection(this.CARPETA_DOCUMENTOS).add({
            nombre: item.nombreArchivo,
            url: item.url
          });
        });
    }
  }
  getDocumentosGuardados(proyectoKey:string): AngularFirestoreCollection<DocumentoModel>{
    return this.db.collection(this.dbPath).doc(proyectoKey).collection(this.CARPETA_DOCUMENTOS);
  }
}
