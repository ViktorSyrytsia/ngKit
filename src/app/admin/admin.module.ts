import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminCategoryPageComponent } from './admin-category-page/admin-category-page.component';
import { AdminSubcategoryPageComponent } from './admin-subcategory-page/admin-subcategory-page.component';



@NgModule({
  declarations: [AdminPageComponent, AdminCategoryPageComponent, AdminSubcategoryPageComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],

})
export class AdminModule { }
