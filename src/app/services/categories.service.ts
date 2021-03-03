import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  public getAllCategories() {
    return this.db.collection('categories').valueChanges()
  }
}
