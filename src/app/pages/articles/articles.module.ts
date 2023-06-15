import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { SicurezzaComponent } from './pages/sicurezza/sicurezza.component';
import { HeaderComponent } from './components/header/header.component';
import { BannerComponent } from './components/banner/banner.component';
import { ImgixAngularModule } from '@imgix/angular';
import { TorchbearerComponent } from './pages/torchbearer/torchbearer.component';


@NgModule({
  declarations: [
    ArticlesComponent,
    SicurezzaComponent,
    HeaderComponent,
    BannerComponent,
    TorchbearerComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    ImgixAngularModule,
  ]
})
export class ArticlesModule { }
