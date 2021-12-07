import { Injectable } from '@angular/core';
import { EmpresaModel } from '../models/empresas.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private dbPath = '/empresa';
  empresasRef: AngularFirestoreCollection<EmpresaModel> = null;

  constructor(private db: AngularFirestore) {
    this.empresasRef= db.collection(this.dbPath,ref=>ref.orderBy('nombre'));
  }
  createEmpresa(tramo:any){
    return this.empresasRef.add({...tramo});
  }
  updateEmpresa(empresa:EmpresaModel): Promise<void> {
    //Para elmiminar la key y no se duplique
    const empresaTemp ={
      ...empresa
    }
    delete empresaTemp.key;
    return this.empresasRef.doc(empresa.key).update(empresaTemp);
  }
 
  deleteEmpresa(key: string): Promise<void> {
    return this.empresasRef.doc(key).delete();
  }
 
  getEmpresasList(): AngularFirestoreCollection<EmpresaModel> {
    return this.empresasRef;
  }
  getEmpresasActivas(): AngularFirestoreCollection<EmpresaModel>{
    return this.db.collection(this.dbPath, ref => ref.where('activo', '==',true));
  }

}
