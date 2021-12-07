import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AvanceFinacieroModel } from '../models/avance-finaciero.model';

@Injectable({
  providedIn: 'root'
})
export class AvanceFinancieroService {
  private dbPath = '/avanceFinaciero';
  private dbPathProyecto='/proyecto';
  constructor(private db: AngularFirestore) { }
  createAvanceFinaciero(docKey:string,avance:any){
    return this.db.collection(this.dbPathProyecto).doc(docKey).collection(this.dbPath).add({...avance});
  }
  getAvanceFinacieroList(docKey:string):AngularFirestoreCollection<AvanceFinacieroModel>{
    return this.db.collection(this.dbPathProyecto).doc(docKey).collection(this.dbPath);
  }
  getAvanceFinacieroNoCompletadosList(docKey:string):AngularFirestoreCollection<AvanceFinacieroModel>{
    return this.db.collection(this.dbPathProyecto).doc(docKey).collection(this.dbPath, ref => ref.orderBy('periodo'));
  }
  updateAvanceFinaciero(docKey:string,avance:AvanceFinacieroModel){
   //Para elmiminar la key y no se duplique
     const avanceTemp ={
      ...avance
    }
    delete avanceTemp.key;
    return this.db.collection(this.dbPathProyecto).doc(docKey).collection(this.dbPath).doc(avance.key).update(avanceTemp);
  }
}
