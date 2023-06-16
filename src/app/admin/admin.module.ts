import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { ImgixAngularModule } from '@imgix/angular';


@NgModule({
  declarations: [
    AdminComponent,
    NavbarComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ImgixAngularModule
  ]
})
export class AdminModule { }
