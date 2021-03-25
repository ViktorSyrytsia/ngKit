import { SortOptions } from './../models/sort-options.model';
import { ICategory } from './../models/category.model';
import { SubcategoriesService } from './../services/subcategory.service';
import { CategoriesService } from './../services/categories.service';
import { ProductService } from './../services/product.service';
import { IProduct } from './../models/product.model';
import { CartServiceService } from './../services/cart-service.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';
import { pluck, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ISubcategory } from '../models/subcategory.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {
  public products$: Observable<IProduct[]>;
  public productsToShow: IProduct[];
  public subcategories$ : Observable<ISubcategory[]>;
  public category: string;
  public selectedSubcategory: string;
  public selectedSort: string;
  public length = 100;
  public pageSize = 2;
  public pageSizeOptions: number[] = [];
  public pageEvent: PageEvent;
  public currentPageIndex = 0;
  // public productInCart$: Observable<IProduct[]> = this.cartService.getCart().pipe(map(cart => cart.productsInCart
  // ))
  public loading: boolean = true;
  public cols: number;
  public options: SortOptions[] = [
    {value: 'updatedAt', direction:'desc', viewValue: 'Newest'},
    {value: 'price', direction: 'asc', viewValue: 'Price ascending'},
    {value: 'price', direction: 'desc', viewValue: 'Price descending'}
  ];
  public sortOption: SortOptions = this.options[0];

  @HostListener('window:resize', ['$event'])
    onResize() {
    this.onColumnsChange(window.innerWidth);
  }

  constructor(private activatedRoute: ActivatedRoute,
              private productsService: ProductService,
              private cartService: CartServiceService,
              private categorySevice: CategoriesService,
              private subcategoryService: SubcategoriesService) { }

  ngOnInit(): void {
    this.productsService.getCollectionLength().then(res => {
      this.length = res;
    })
    this.onColumnsChange(window.innerWidth);
    this.loading = true;
    this.activatedRoute.params
    .pipe(pluck('id')).subscribe(id => {
      this.products$ = this.productsService.getInitialProducts(id, this.pageSize, this.sortOption)
      this.category = id;
      this.subcategories$ = this.subcategoryService.getSubcategoriesByCategory(id);
      this.loading = false;
    }
    );
  }

  public onSubcategorySelect(value: string): void {
  //  if (value) {
  //    this.productsToShow = this.products.filter(product => product.subcategory === value);
  //  } else {
  //   this.productsToShow = this.products;
  //  }
  }

  public onSortSelect(sortOption: SortOptions): void {
    // if (sortOption.value === 'price-asc') {
    //   this.productsToShow.sort((a, b) => a.price - b.price)
    // } else if (sortOption.value === 'price-desc') {
    //   this.productsToShow.sort((a, b) => b.price - a.price)
    // } else {
    //   this.productsToShow.sort((a, b) => b.updatedAt - a.updatedAt)
    // }

  }

  public onPageChange(event) {
    this.products$.subscribe((res: IProduct[]) => {

      if (event.pageIndex > this.currentPageIndex) {

        this.currentPageIndex = event.pageIndex;
        this.products$ = this.productsService.getNextProducts(
          this.category,
          this.pageSize,
          res[this.pageSize - 1],
          this.sortOption )

      } else if (event.pageIndex < this.currentPageIndex) {

        this.currentPageIndex = event.pageIndex;
        this.products$ = this.productsService.getPrevProducts(
          this.category,
          this.pageSize,
          res[0],
          this.sortOption )
      }
    })
  }

  private onColumnsChange(width: number): void {
    if (width < 1440 && width > 1000) {
      this.cols = 3;
    } else if (width < 1100 && width > 680) {
      this.cols = 2;
    } else if (width < 680) {
      this.cols = 1;
    } else if (width > 1440) {
      this.cols = 4;
    }
  }
}
