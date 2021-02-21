import { SharedModule } from './../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { EmailLoginComponent } from './email-login/email-login.component';
import { GoogleSignInDirective } from './google-sign-in.directive';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [LoginComponent, EmailLoginComponent, GoogleSignInDirective],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
