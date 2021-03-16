import { DeleteDialogComponent } from './../../shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ISubcategory } from './../../models/subcategory.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategory } from './../../models/category.model';
import { Observable, Subscription } from 'rxjs';
import { SubcategoriesService } from './../../services/subcategory.service';
import { CategoriesService } from './../../services/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-subcategory-page',
  templateUrl: './admin-subcategory-page.component.html',
  styleUrls: ['./admin-subcategory-page.component.scss']
})
export class AdminSubcategoryPageComponent implements OnInit, OnDestroy {

  public categories$: Observable<ICategory[]>;
  public subcategories$: Observable<ISubcategory[]>;
  public form: FormGroup;
  public loading: boolean = false;
  private selectedSubcategory: ISubcategory;
  public subcategorySubscription: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.getAllCategories();
    this.subcategories$ = this.subcategoriesService.getAllSubcategories();
    this.form = this.fb.group({
      name:['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      category:['',[Validators.required]]
    })
  }

  ngOnDestroy(): void {
    if (this.subcategorySubscription) {
      this.subcategorySubscription.unsubscribe();
    }
  }

  get name() {
    return this.form.get('name');
  }
  get category() {
    return this.form.get('category');
  }

  public onSubcategorySelect(id: string): void {
    this.subcategorySubscription = this.subcategoriesService.getSubcategoryById(id).subscribe(subcategory => {
      this.form.setValue({
        name: subcategory.name,
        category: subcategory.category
      });
      this.selectedSubcategory = subcategory;
    })
  }

  public back(): void {
    this.router.navigateByUrl('/admin');
  }

  public onSubmit(option: string) {
    this.loading = true;
    const name = this.name.value;
    const category = this.category.value;

    if (option === 'create') {
      this.subcategoriesService.createSubcategory({name, category}).then(res => {
        this.snackBar.open(`Subcategory: "${name}" was created`,'Close', { duration: 2000});
        this.resetAll();
      })
    }
    if (option === 'update') {
      this.subcategoriesService.updateSubcategory({id: this.selectedSubcategory.id, name, category}).then(res => {
        this.snackBar.open(`Subcategory: "${this.selectedSubcategory.name}" was updated`,'Close', { duration: 2000});
        this.resetAll();
      })
      .catch(err => {
        this.snackBar.open(`Something went wrong!`,'Close', { duration: 2000});
        this.resetAll();
      })
    }
  }

  public onDelete(): void {
    this.loading = true;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {data: this.selectedSubcategory});
    dialogRef.afterClosed().subscribe(result => {
     if (result) {
      this.subcategoriesService.deleteSubcategory(this.selectedSubcategory.id).then(res => {
        this.snackBar.open(`Subcategory: "${this.selectedSubcategory.name}" was deleted`,'Close', { duration: 2000});
        this.resetAll();
      })
      .catch(err => {
        this.snackBar.open(`Something went wrong!`,'Close', { duration: 2000});
      })
     }
     this.resetAll();
    });
  }

  private resetAll(): void {
    this.loading = false;
    if (this.subcategorySubscription) {
      this.subcategorySubscription.unsubscribe();
      this.selectedSubcategory = null;
    }
    document.getElementById('reset').click();
  }

}
