import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ICategory } from './../models/category.model';
import { Observable } from 'rxjs';
import { CategoriesService } from './../services/categories.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  public isHandset$: Observable<boolean> = this.breakPointObserver
  .observe([Breakpoints.Handset])
  .pipe(
    map(
      (result) =>
        result.breakpoints[
          '(max-width: 599.98px) and (orientation: portrait)'
        ]
    ),
    shareReplay()
  );
  categories$: Observable<ICategory[]>

  constructor(private categoriesService: CategoriesService, private breakPointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.getAllCategories();
  }

}
