import { StorageService } from './../../services/storage.service';
import { DeleteDialogComponent } from './../../shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from './../../services/categories.service';
import { ICategory } from './../../models/category.model';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.getAllCategories();
    this.form = this.fb.group({
      name:['', [Validators.maxLength(20), Validators.minLength(3)]],
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
    const image = await this.storageService.onUpload(this.id(), this.file);
    const alt = this.alt.value;

    if (option === 'create') {
      this.categoriesService.createCategory({name, description, image: {link: image, alt}}).then(res => {
        this.form.reset();
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      })
    }
    if (option === 'update') {
      this.categoriesService.updateCategory({id: this.selectedCategory.id, name, description, image: {link: image, alt}}).then(res => {
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
        this.form.reset();
      })
      .catch(err => {
        console.log(err);
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

  private id(): string {
    return Math.random().toString(36).substring(2);
  }

}
