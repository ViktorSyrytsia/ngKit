import { DeleteDialogComponent } from './../../shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from './../../services/categories.service';
import { ICategory } from './../../models/category.model';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-category-page',
  templateUrl: './admin-category-page.component.html',
  styleUrls: ['./admin-category-page.component.scss']
})
export class AdminCategoryPageComponent implements OnInit, OnDestroy {
  public form : FormGroup;
  public categories$: Observable<ICategory[]>;
  public categorySubscription: Subscription;

  public loading: boolean = false;
  private selectedCategory: ICategory;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.getAllCategories();
    this.form = this.fb.group({
      name:['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      description:['', [Validators.maxLength(150), Validators.minLength(6)]],
      image:['',[]],
      alt:['',[Validators.maxLength(25), Validators.minLength(3)]]
    })
  }

  ngOnDestroy():void {
    this.categorySubscription.unsubscribe();
  }

  get name() {
    return this.form.get('name')
  }
  get description() {
    return this.form.get('description')
  }
  get image() {
    return this.form.get('image')
  }
  get alt() {
    return this.form.get('alt')
  }


  public onCategorySelect(id: string): void {
    this.categorySubscription = this.categoriesService.getCategoryById(id).subscribe(category => {
      this.form.setValue({
        name: category.name,
        description: category.description,
        image: category.image?.link,
        alt: category.image?.alt
      });
      this.selectedCategory = category;
    })

  }

  public onSubmit(option: 'create' | 'update'): void {
    this.loading = true;
    const name = this.name.value;
    const description = this.description.value;
    const image = this.image.value;
    const alt = this.alt.value;

    if (option === 'create') {
      this.categoriesService.createCategory({name, description, image: {link: image, alt}}).then(res => {
        console.log(res);
        this.form.reset();
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      })
    }
    if (option === 'update') {
      console.log({id: this.selectedCategory.id, name, description, image: {link: image, alt}});

      this.categoriesService.updateCategory({id: this.selectedCategory.id, name, description, image: {link: image, alt}}).then(res => {
        console.log(res);
        this.form.reset();
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      })
    }
  }

  public onDelete(): void {
    this.loading = true;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {data: this.selectedCategory});
    dialogRef.afterClosed().subscribe(result => {
     if (result) {
      this.categoriesService.deleteCategory(this.selectedCategory.id).then(res => {
        console.log(res);
        this.form.reset();
      })
      .catch(err => {
        console.log(err);
      })
     }
     this.loading = false;
    });
  }
}