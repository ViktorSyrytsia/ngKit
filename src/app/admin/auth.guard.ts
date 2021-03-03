import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean> {
    return this.afAuth.authState.pipe(map(res => {
      if (res?.email === environment.firebase.adminEmail) {
        return true;
      } else {
        this.router.navigate(['/users']);
        return false;
      }
    })
    )
  }
}
