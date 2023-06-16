import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CvDetailRoutingModule } from './cv-detail-routing.module';
import { CvDetailComponent } from './cv-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImgixAngularModule } from '@imgix/angular';
import { FormErrorModalComponent } from './components/form-error-modal/form-error-modal.component';


@NgModule({
  declarations: [
    CvDetailComponent,
    FormErrorModalComponent
  ],
  imports: [
    CommonModule,
    CvDetailRoutingModule,
    ReactiveFormsModule,
    ImgixAngularModule
  ]
})
export class CvDetailModule { }
