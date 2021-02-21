import { CategoriesService } from './../../services/categories.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
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
  public opened: boolean;
  public categories$ : Observable<any>
  constructor(private breakPointObserver: BreakpointObserver, private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.getAllCategories();
  }

}
