import { IProduct } from './../models/product.model';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private collection: string = 'products';
  private limit: number = 9;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  public getCollectionLength() {
     this.db.collection(this.collection).get().toPromise().then(snap => {
       console.log(snap);

     })
  }

  public getProductByQuery(
    category: string
    ): Observable<IProduct[]> {
    return this.db.collection<IProduct>(this.collection,(ref) => ref
    .where('category','==',category)
    .orderBy('updatedAt','desc')
    .limit(3))
    .valueChanges()
  }

  public getProductByQueryNext(
    category: string, last: IProduct, field: string
    ): Observable<IProduct[]> {
    return this.db.collection<IProduct>(this.collection,(ref) => ref
    .where('category','==',category)
    .orderBy(field ,'desc')
    .startAfter(last[field])
    .limit(3))
    .valueChanges()
  }

  public getProductByQueryPrev(
    category: string, first: IProduct, field: string
    ): Observable<IProduct[]> {
    return this.db.collection<IProduct>(this.collection,(ref) => ref
    .where('category','==',category)
    .orderBy(field ,'desc')
    .endBefore(first[field])
    .limitToLast(3))
    .valueChanges()
  }

  public getAllProducts(): Observable<IProduct[]> {
    return this.db
      .collection<IProduct>(this.collection)
      .valueChanges({ idField: 'id' });
  }

  public getProductById(id: string): Observable<IProduct> {
    return this.db
      .collection<IProduct>(this.collection)
      .doc(id)
      .valueChanges({ idField: 'id' });
  }

  public createProduct(
    product: IProduct
  ): Promise<DocumentReference<IProduct>> {
    return this.db.collection<IProduct>(this.collection).add(product);
  }

  public updateProduct(product: IProduct): Promise<void> {
    return this.db
      .collection(this.collection)
      .doc(product.id)
      .update(product);
  }

  public deleteProduct(productId: string): Promise<void> {
    return this.db.collection(this.collection).doc(productId).delete();
  }


}
