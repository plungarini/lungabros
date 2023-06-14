import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImgixAngularModule } from '@imgix/angular';
import { BannerComponent } from './components/banner/banner.component';
import { BrandsComponent } from './components/brands/brands.component';
import { HeaderComponent } from './components/header/header.component';
import { ImageSlideshowComponent } from './components/image-slideshow/image-slideshow.component';
import { SectionFourComponent } from './components/section-four/section-four.component';
import { SectionOneComponent } from './components/section-one/section-one.component';
import { SectionThreeComponent } from './components/section-three/section-three.component';
import { CourseCardComponent } from './components/section-two/components/course-card/course-card.component';
import { SectionTwoComponent } from './components/section-two/section-two.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';



@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    SectionOneComponent,
    ImageSlideshowComponent,
    BrandsComponent,
    SectionTwoComponent,
    SectionThreeComponent,
    SectionFourComponent,
    BannerComponent,
    CourseCardComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
		ImgixAngularModule,
  ],
  providers: [
  ]
})
export class HomeModule { }
