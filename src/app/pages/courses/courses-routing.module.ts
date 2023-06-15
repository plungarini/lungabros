import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { CoursesResolver } from './resolvers/courses.resolver';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./components/courses-list/courses-list.module').then(m => m.CoursesListModule),
      },
      {
        path: 'info/:id',
        loadChildren: () => import('./components/course-detail/course-detail.module').then(m => m.CourseDetailModule),
        resolve: {
          course: CoursesResolver,
        }
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
