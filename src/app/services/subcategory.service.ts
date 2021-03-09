import { ISubcategory } from './../models/subcategory.model';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  private collection: string = 'subcategories';

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  public getAllSubcategories(): Observable<ISubcategory[]> {
    return this.db
      .collection<ISubcategory>(this.collection)
      .valueChanges({ idField: 'id' });
  }

  public getSubcategoryById(id: string): Observable<ISubcategory> {
    return this.db
      .collection<ISubcategory>(this.collection)
      .doc(id)
      .valueChanges({ idField: 'id' });
  }

  public createSubcategory(
    subcategory: ISubcategory
  ): Promise<DocumentReference<ISubcategory>> {
    return this.db.collection<ISubcategory>(this.collection).add(subcategory);
  }

  public updateSubcategory(subcategory: ISubcategory): Promise<void> {
    return this.db
      .collection(this.collection)
      .doc(subcategory.id)
      .update(subcategory);
  }

  public deleteSubcategory(subcategoryId: string): Promise<void> {
    return this.db.collection(this.collection).doc(subcategoryId).delete();
  }
}
