import { IImage } from './../../models/image.model';
import { ProductService } from './../../services/product.service';
import { StorageService } from './../../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { SubcategoriesService } from './../../services/subcategory.service';
import { CategoriesService } from './../../services/categories.service';
import { IProduct } from './../../models/product.model';
import { ISubcategory } from './../../models/subcategory.model';
import { Observable, Subscription } from 'rxjs';
import { ICategory } from './../../models/category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as uuid from 'uuid';

interface IFile {
  data: any;
  id: number;
}

interface IUrl {
  src: any;
  id: number;
}

@Component({
  selector: 'app-admin-product-page',
  templateUrl: './admin-product-page.component.html',
  styleUrls: ['./admin-product-page.component.scss']
})
export class AdminProductPageComponent implements OnInit, OnDestroy {

  public form : FormGroup;
  public categories$: Observable<ICategory[]>;
  public subcategories$: Observable<ISubcategory[]>;
  public products$: Observable<IProduct[]>;

  public loading: boolean = false;
  public selectedProduct: IProduct;
  public productSubscription: Subscription;
  public files: IFile[] = [];
  public urls: IUrl[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private productsService: ProductService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private storageService: StorageService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.getAllCategories();
    this.subcategories$ = this.subcategoriesService.getAllSubcategories();
    this.products$ = this.productsService.getAllProducts();
    this.form = this.fb.group({
      name:['', [Validators.required ,Validators.maxLength(50), Validators.minLength(3)]],
      description:['', [Validators.maxLength(150), Validators.minLength(6)]],
      price:['',[Validators.required, Validators.maxLength(5), Validators.minLength(1)]],
      category:['',[Validators.required]],
      subcategory:['',[Validators.required]],
      images:['',[]],
      sizes: this.fb.group({
        xs: [0],
        s: [0],
        m: [0],
        l: [0],
        xl: [0],
        xxl: [0],
        oneSize: [0],
      }),
    })
  }

  ngOnDestroy(): void {
  }

  get name() {
    return this.form.get('name')
  }
  get description() {
    return this.form.get('description')
  }
  get price() {
    return this.form.get('price')
  }
  get category() {
    return this.form.get('category')
  }
  get subcategory() {
    return this.form.get('subcategory')
  }
  get images() {
    return this.form.get('images')
  }
  get sizes() {
    return this.form.get('sizes')
  }

  public async onSubmit(option: 'create' | 'update'): Promise<void> {
    this.loading = true;
    const name = this.name.value;
    const description = this.description.value;
    const price = this.price.value;
    const category = this.category.value;
    const subcategory = this.subcategory.value;
    const sizes = this.sizes.value;

    if (option === 'create') {
      const images: IImage[] = await Promise.all(this.files.map(async (file): Promise<IImage> => {
        return {
          id: file.id,
          link:  await this.storageService.onUpload(`products/${name}`,file.data.name,file.data),
          alt: 'Product Image'
        };
      }))
      this.productsService.createProduct({name, description, price, category, subcategory, sizes, images })
      .then(res => {
        this.snackBar.open(`Product: "${name}" was created`,'Close', { duration: 2000});
        this.resetAll();
      })
      .catch(err => {
        this.snackBar.open(`Something went wrong!`,'Close', { duration: 2000});
        this.resetAll();
      })
    }
    if (option === 'update') {

      const images = this.selectedProduct.images;
      const newImages: IImage[] = await Promise.all(this.files.map(async (file): Promise<IImage> => {
        return {
          id: file.id,
          link:  await this.storageService.onUpload(`products/${name}`,file.data.name,file.data),
          alt: 'Product Image'
        };
      }))
      const concatenated = [...images,...newImages];

      this.productsService.updateProduct({name, description, price, category, subcategory, sizes, images: concatenated,
      id: this.selectedProduct.id })
       .then(res => {
        this.snackBar.open(`Product: "${name}" was updated`,'Close', { duration: 2000});
        this.resetAll();
      })
      .catch(err => {
        console.log(err);
        this.snackBar.open(`Something went wrong!`,'Close', { duration: 2000});
        this.resetAll();
      })
    }
  }

  public onFileAndUrlAdd(event: any) {
    const reader = new FileReader();
    const id = uuid.v4();
    this.files.push({data: event.target.files[0], id}); // Add to files array
    reader.onload = (event: any) => {
      this.urls.push({src: event.target.result, id}); // Add to urls array
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  public onFileAndUrlDelete(event, urlId) {
    this.files = this.files.filter(file => file.id !== urlId);
    this.urls = this.urls.filter(url => url.id !== urlId);
  }

  public onProductSelect(id: string): void {
    this.productSubscription = this.productsService.getProductById(id).subscribe(product => {
      this.form.setValue({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        images: product.images,
        sizes: product.sizes
      });
      this.selectedProduct = product;
    })
  }

  public onImageDelete(event, image: IImage) {
    const filteredArray =  this.selectedProduct.images.filter(img => img.id !== image.id);
    this.selectedProduct.images = filteredArray;
  }

  public back(): void {
    this.router.navigateByUrl('/admin');
  }

  private resetAll(): void {
    this.files = [];
    this.urls = [];
    this.loading = false;
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
      this.selectedProduct = null;
    }
    document.getElementById('reset').click();
  }
}
