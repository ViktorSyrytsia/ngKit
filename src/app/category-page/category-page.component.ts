import { ProductService } from './../services/product.service';
import { IProduct } from './../models/product.model';
import { CartServiceService } from './../services/cart-service.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { pluck, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {
  public products$ : Observable<any>
  public productInCart$: Observable<IProduct[]> = this.cartService.getCart().pipe(map(cart => cart.productsInCart
  ))
  public loading: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private productsService: ProductService,
              private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params
    .pipe(pluck('id')).subscribe(id => {
      this.products$ = this.productsService.getProductByCategory(id);
      this.loading = false;
    }
    );

  }
}
