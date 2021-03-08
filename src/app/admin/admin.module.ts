import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminCategoryPageComponent } from './admin-category-page/admin-category-page.component';



@NgModule({
  declarations: [AdminPageComponent, AdminCategoryPageComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],

})
export class AdminModule { }
