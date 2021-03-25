import { SortOptions } from './../models/sort-options.model';
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

  public getCollectionLength(): Promise<number> {
     return this.db.collection(this.collection).get().toPromise()
     .then(snap => {
       return snap.size;
     })
     .catch(err => {
       return 0
     })
  }

  public getInitialProducts(
    category: string,
    limit: number,
    defaultSortOption: SortOptions
    ): Observable<IProduct[]> {
    return this.db.collection<IProduct>(this.collection,(ref) => ref
    .where('category','==',category)
    .orderBy(defaultSortOption.value, defaultSortOption.direction)
    .limit(limit))
    .valueChanges()
  }

  public getNextProducts(
    category: string, limit:number, lastInRes: IProduct, sortOption: SortOptions
    ): Observable<IProduct[]> {
    return this.db.collection<IProduct>(this.collection,(ref) => ref
    .where('category','==',category)
    .orderBy(sortOption.value ,sortOption.direction)
    .startAfter(lastInRes[sortOption.value])
    .limit(limit))
    .valueChanges()
  }

  public getPrevProducts(
    category: string, limit: number, firstInRes: IProduct, sortOption: SortOptions
    ): Observable<IProduct[]> {
    return this.db.collection<IProduct>(this.collection,(ref) => ref
    .where('category','==',category)
    .orderBy(sortOption.value ,sortOption.direction)
    .endBefore(firstInRes[sortOption.value])
    .limitToLast(limit))
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
