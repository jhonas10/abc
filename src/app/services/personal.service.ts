import { Injectable, ViewChild } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { PersonalModel } from '../models/personal.model';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private dbPath = '/personal';
  personalRef: AngularFirestoreCollection<PersonalModel> = null;
  constructor(private db: AngularFirestore,private afsAuth: AngularFireAuth) {
    this.personalRef=db.collection(this.dbPath);
   }

  createPersonal(usuario:UsuarioModel, personal: PersonalModel){
    return new Promise((resolve, reject) => {this.afsAuth.createUserWithEmailAndPassword(usuario.email,usuario.pasword)
      .then(userData=>{
        resolve(userData),
        personal.email=usuario.email
        return this.personalRef.doc(userData.user.uid).set({...personal});
      }).catch(err => reject(err))
    });
  }

  getPersonalList(): AngularFirestoreCollection<PersonalModel> {
    return this.personalRef;
  }
  updatePersonal(personal:PersonalModel): Promise<void> {
    const personalTemp ={
      ...personal
    }
    delete personalTemp.key;
    return this.personalRef.doc(personal.key).update(personalTemp);
  }
  deletePersonal(key: string): Promise<void> {
    return this.personalRef.doc(key).delete();
  }
  getPersonalState(email:string): AngularFirestoreCollection<PersonalModel>{
    return this.db.collection(this.dbPath, ref => ref.where('email', '==',email));
  }
  getPersonalIng(): AngularFirestoreCollection<PersonalModel>{
    return this.db.collection(this.dbPath, ref => ref.where('cargo', '==','Ingeniero de Tramo'));
  }
  getIngenierosActivos(): AngularFirestoreCollection<PersonalModel>{
    return this.db.collection(this.dbPath, ref => ref.where('activo', '==',true).where('cargo', '==','Ingeniero de Tramo'));
  }
}
