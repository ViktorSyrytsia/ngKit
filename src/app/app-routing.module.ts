import { AuthGuard } from './admin/auth.guard';
import { CategoryPageComponent } from './category-page/category-page.component';
import { InfoComponent } from './info/info.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {path:'', component: HomePageComponent},
  {path:'info', component: InfoComponent},
  { path: 'category/:id', component: CategoryPageComponent },
  {path:'users', loadChildren:() => import('./users/users.module').then(m => m.UsersModule)},
  {path:'admin', loadChildren:() => import('./admin/admin.module').then(m => m.AdminModule),
   canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
