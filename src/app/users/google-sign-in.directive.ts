import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Directive({
  selector: '[appGoogleSignIn]'
})
export class GoogleSignInDirective {

  constructor(private afAuth: AngularFireAuth) { }


  @HostListener('click')
  onclick() {
    this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider());
  }

}
