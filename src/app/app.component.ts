import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items$: Observable<any[]>;
  constructor(private firestore: AngularFirestore) {
    this.items$ = firestore.collection('restaurants').valueChanges();
  }
}
