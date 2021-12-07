import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TramosModel } from '../models/tramos.model';

@Injectable({
  providedIn: 'root'
})
export class TramosService {
  private dbPath = '/tramo';
  tramosRef: AngularFirestoreCollection<TramosModel> = null;

  constructor(private db: AngularFirestore) {
    this.tramosRef=db.collection(this.dbPath,ref=>ref.orderBy('codigo'));
    
  }
  createTramo(tramo:TramosModel){
    return this.tramosRef.add({...tramo});
  }

  updateTramo(tramo:TramosModel): Promise<void> {
    //Para elmiminar la key y no se duplique
    const tramoTemp={
      ...tramo
    }
    delete tramoTemp.key;
    return this.tramosRef.doc(tramo.key).update(tramoTemp);
  }
 
  deleteTramo(tramo:TramosModel): Promise<void> {
    return this.tramosRef.doc(tramo.key).delete();
  }
 
  getTramosList(): AngularFirestoreCollection<TramosModel> {
    return this.tramosRef;
  }
}
