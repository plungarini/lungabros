import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurriculumRoutingModule } from './curriculum-routing.module';
import { CurriculumComponent } from './curriculum.component';
import { ImgixAngularModule } from '@imgix/angular';
import { HeaderComponent } from './components/header/header.component';
import { ShortDescComponent } from './components/short-desc/short-desc.component';
import { BannerComponent } from './components/banner/banner.component';
import { CertificationsComponent } from './components/certifications/certifications.component';
import { MyStoryComponent } from './components/my-story/my-story.component';
import { PdfComponent } from './components/pdf/pdf.component';


@NgModule({
  declarations: [
    CurriculumComponent,
    HeaderComponent,
    ShortDescComponent,
    BannerComponent,
    CertificationsComponent,
    MyStoryComponent,
    PdfComponent
  ],
  imports: [
    CommonModule,
    CurriculumRoutingModule,
    ImgixAngularModule,
  ]
})
export class CurriculumModule { }
