import { Injectable } from '@angular/core';
import { AvanceFisicoModel } from '../models/avance-fisico.model';
import { AngularFirestoreCollection , AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AvanceFisicoService {
  private dbPath = '/avanceFisico';
  private dbPathProyecto='/proyecto';
  avanceFisicoRef: AngularFirestoreCollection<AvanceFisicoModel> = null;
  constructor(private db: AngularFirestore) {
    
  }
  createAvanceFisico(docKey:string,avance:any){
    return this.db.collection(this.dbPathProyecto).doc(docKey).collection(this.dbPath).add({...avance});
  }
  getAvanceFisicoList(docKey:string):AngularFirestoreCollection<AvanceFisicoModel>{
    return this.db.collection(this.dbPathProyecto).doc(docKey).collection(this.dbPath);
  }
  getAvanceFisicoNoCompletadosList(docKey:string):AngularFirestoreCollection<AvanceFisicoModel>{
    this.avanceFisicoRef=this.db.collection(this.dbPathProyecto).doc(docKey).collection(this.dbPath, ref => ref.orderBy('periodo'));
    return this.avanceFisicoRef;
  }
  updateAvanceFisico(docKey:string,avance:AvanceFisicoModel){
   //Para elmiminar la key y no se duplique
     const avanceTemp ={
      ...avance
    }
    delete avanceTemp.key;
    return this.db.collection(this.dbPathProyecto).doc(docKey).collection(this.dbPath).doc(avance.key).update(avanceTemp);
  }
}
