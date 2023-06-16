import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesResolver } from 'src/app/pages/courses/resolvers/courses.resolver';
import { CoursesComponent } from './courses.component';
import { CourseAdminResolver } from './pages/course-detail/resolvers/course-admin.resolver';

const routes: Routes = [
  { path: '', component: CoursesComponent },
  {
    path: 'edit/:id',
    loadChildren: () => import('./pages/course-detail/course-detail.module').then(m => m.CourseDetailModule),
    resolve: {
      course: CourseAdminResolver
    }
  },
  {
    path: 'new',
    loadChildren: () => import('./pages/course-detail/course-detail.module').then(m => m.CourseDetailModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
