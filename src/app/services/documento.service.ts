import { Injectable } from '@angular/core';
import { ProyectoModel } from '../models/proyectos.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';
import { DocumentoModel } from '../models/document.model';
@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private CARPETA_DOCUMENTOS ='docs';
  private dbPath='/proyecto';
  proyectosRef:AngularFirestoreCollection<ProyectoModel>=null;
  constructor(private db:AngularFirestore) {
    this.proyectosRef=db.collection(this.dbPath);
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
