import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseDetailRoutingModule } from './course-detail-routing.module';
import { CourseDetailComponent } from './course-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { DragNdropDirective } from './pipes/drag-ndrop.directive';
import { ImgixAngularModule } from '@imgix/angular';
import { FormErrorModalComponent } from './components/form-error-modal/form-error-modal.component';


@NgModule({
  declarations: [
    CourseDetailComponent,
    DragNdropDirective,
    FormErrorModalComponent
  ],
  imports: [
    CommonModule,
    CourseDetailRoutingModule,
    ReactiveFormsModule,
    ImgixAngularModule,
    provideStorage(() => getStorage()),
  ]
})
export class CourseDetailModule { }
