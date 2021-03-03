import { IProduct } from './../models/product.model';
import { CartServiceService } from './../services/cart-service.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product : IProduct
  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
  }
  public addToCart() {
    this.cartService.addProductToCart(this.product)
  }
  public removeFromCart() {
    this.cartService.removeProductFromCart(this.product.name)
  }
}
