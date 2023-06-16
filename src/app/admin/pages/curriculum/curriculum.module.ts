import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurriculumRoutingModule } from './curriculum-routing.module';
import { CurriculumComponent } from './curriculum.component';
import { ImgixAngularModule } from '@imgix/angular';


@NgModule({
  declarations: [
    CurriculumComponent
  ],
  imports: [
    CommonModule,
    CurriculumRoutingModule,
    ImgixAngularModule
  ]
})
export class CurriculumModule { }
