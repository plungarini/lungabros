import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesListRoutingModule } from './courses-list-routing.module';
import { CoursesListComponent } from './courses-list.component';
import { ImgixAngularModule } from '@imgix/angular';
import { FiltersComponent } from './components/filters/filters.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginatePipe } from './pipes/paginate.pipe';



@NgModule({
  declarations: [
    CoursesListComponent,
    FiltersComponent,
    CourseCardComponent,
    PaginationComponent,
    PaginatePipe,
  ],
  imports: [
    CommonModule,
    CoursesListRoutingModule,
    ImgixAngularModule,
    ReactiveFormsModule,
  ]
})
export class CoursesListModule { }
