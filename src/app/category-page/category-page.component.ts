import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {
  category$ : Observable<string>
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.category$ = this.activatedRoute.params
    .pipe(pluck('id'));
  }

}
