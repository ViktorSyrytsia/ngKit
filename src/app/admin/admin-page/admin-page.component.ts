import { ICategory } from './../../models/category.model';
import { Observable } from 'rxjs';
import { CategoriesService } from './../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  public categories$: Observable<ICategory[]>;
  public category$: Observable<ICategory>;
  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.getAllCategories();
  }

  onSelect(id: string) {
    this.category$ = this.categoriesService.getCategoryById(id);
  }

}
