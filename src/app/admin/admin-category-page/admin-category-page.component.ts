import { StorageService } from './../../services/storage.service';
import { DeleteDialogComponent } from './../../shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from './../../services/categories.service';
import { ICategory } from './../../models/category.model';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private file: any;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private storageService: StorageService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.getAllCategories();
    this.form = this.fb.group({
      name:['', [Validators.required ,Validators.maxLength(20), Validators.minLength(3)]],
      description:['', [Validators.maxLength(150), Validators.minLength(6)]],
      image:['',[]],
      alt:['',[Validators.maxLength(25), Validators.minLength(3)]]
    })
  }

  ngOnDestroy():void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
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

  public async onSubmit(option: 'create' | 'update'): Promise<void> {
    this.loading = true;
    const name = this.name.value;
    const description = this.description.value;
    let image = this.image.value;
    const alt = this.alt.value;

    if (this.file) {
      image = await this.storageService.onUpload('categories',this.file.name, this.file);
    }

    if (option === 'create') {
      this.categoriesService.createCategory({name, description, image: {link: image, alt}}).then(res => {
        this.snackBar.open(`Category: "${name}" was created`,'Close', { duration: 2000});
        this.form.reset();
        this.loading = false;
      })
      .catch(err => {
        this.snackBar.open(`Something went wrong!`,'Close', { duration: 2000});
        this.loading = false;
      })
    }
    if (option === 'update') {
      this.categoriesService.updateCategory({id: this.selectedCategory.id, name, description, image: {link: image, alt}}).then(res => {
        this.snackBar.open(`Category: "${this.selectedCategory.name}" was updated`,'Close', { duration: 2000});
        this.form.reset();
        this.loading = false;
      })
      .catch(err => {
        this.snackBar.open(`Something went wrong!`,'Close', { duration: 2000});
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
        this.snackBar.open(`Category: "${this.selectedCategory.name}" was deleted`,'Close', { duration: 2000});
        this.form.reset();
      })
      .catch(err => {
        this.snackBar.open(`Something went wrong!`,'Close', { duration: 2000});
      })
     }
     this.loading = false;
    });
  }

  public back(): void {
    this.router.navigateByUrl('/admin');
  }

  public onImageAdd(event: any) {
    this.file = event.target.files[0];
    this.form.setValue({
      name: this.name.value,
      description: this.description.value,
      image: 'File was added',
      alt: this.alt.value
    });
  }
}
