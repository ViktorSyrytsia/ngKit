import { IProduct } from './../models/product.model';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private cart = new BehaviorSubject<ICart>({productsInCart:[]});
  private key: 'cart';

  constructor() {
   }

  public getCart(): Observable<ICart> {
     const cartJSON = this._localStorageGet();
     if (cartJSON) {
      this._setState(JSON.parse(cartJSON));
     }
     return this.cart.asObservable();
  }

  public addProductToCart(product: IProduct): void {
    this._setState({
      productsInCart:[...this.cart.getValue().productsInCart, product]
    })
    this._localStorageSet();
  }

  public removeProductFromCart(productName: string) {
      const cart = this.cart.getValue();
      const removeIndex = cart.productsInCart.map(product => product.name).indexOf(productName);
      if (removeIndex >= 0) {
      cart.productsInCart.splice(removeIndex,1);
      this._setState({
        productsInCart:[...cart.productsInCart]
      })
      this._localStorageSet();
      }

  }

  private _setState(cart:ICart): void {
    this.cart.next(cart);
  }
  private _localStorageSet(): void {
    localStorage.setItem(this.key,JSON.stringify(this.cart.getValue()));
  }
  private _localStorageGet(): string | undefined {
    return localStorage.getItem(this.key);
  }

}
