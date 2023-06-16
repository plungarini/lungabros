import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { TodoComponent } from './pages/todo/todo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'todo',
        data: { preload: true },
        loadChildren: () => import('./pages/todo/todo.module').then(m => m.TodoModule),
      },
      {
        path: 'courses',
        data: { preload: true },
        loadChildren: () => import('./pages/courses/courses.module').then(m => m.CoursesModule),
      },
      {
        path: 'cv',
        data: { preload: true },
        loadChildren: () => import('./pages/curriculum/curriculum.module').then(m => m.CurriculumModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
