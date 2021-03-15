import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getProductByCategory(category: string) {
    return this.db.collection('products',(ref) => ref.where('category','==',category)).valueChanges()
  }
}
