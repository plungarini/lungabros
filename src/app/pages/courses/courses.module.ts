import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { HeaderComponent } from './components/header/header.component';
import { ImgixAngularModule } from '@imgix/angular';
import { BannerComponent } from './components/banner/banner.component';


@NgModule({
  declarations: [
    CoursesComponent,
    HeaderComponent,
    BannerComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    ImgixAngularModule
  ]
})
export class CoursesModule { }
