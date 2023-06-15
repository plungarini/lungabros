import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImgixAngularModule } from '@imgix/angular';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { BannerComponent } from './components/banner/banner.component';
import { HeaderComponent } from './components/header/header.component';
import { HighlightsComponent } from './components/highlights/highlights.component';


@NgModule({
  declarations: [
    AboutComponent,
    HeaderComponent,
    BannerComponent,
    HighlightsComponent,
  ],
  imports: [
    CommonModule,
		AboutRoutingModule,
		ImgixAngularModule
  ]
})
export class AboutModule { }
