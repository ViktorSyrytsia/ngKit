import { AdminSubcategoryPageComponent } from './admin-subcategory-page/admin-subcategory-page.component';
import { AdminCategoryPageComponent } from './admin-category-page/admin-category-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: AdminPageComponent },
  {path:'categories', component: AdminCategoryPageComponent},
  {path:'subcategories', component: AdminSubcategoryPageComponent}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
