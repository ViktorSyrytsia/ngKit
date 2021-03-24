import { ICategory } from './../models/category.model';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private collection: string = 'categories';

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  public getAllCategories(): Observable<ICategory[]> {
    return this.db
      .collection<ICategory>(this.collection)
      .valueChanges({ idField: 'id' });
  }

  public getCategoryById(id: string): Observable<ICategory> {
    return this.db
      .collection<ICategory>(this.collection)
      .doc(id)
      .valueChanges();
  }

  public createCategory(
    category: ICategory
  ): Promise<DocumentReference<ICategory>> {
    return this.db.collection<ICategory>(this.collection).add(category);
  }

  public updateCategory(category: ICategory): Promise<void> {
    return this.db
      .collection(this.collection)
      .doc(category.id)
      .update(category);
  }

  public deleteCategory(categoryId: string): Promise<void> {
    return this.db.collection(this.collection).doc(categoryId).delete();
  }
}
