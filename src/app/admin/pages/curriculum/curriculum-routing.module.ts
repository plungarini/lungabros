import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurriculumComponent } from './curriculum.component';
import { CurriculumResolver } from './pages/cv-detail/resolvers/curriculum.resolver';

const routes: Routes = [
  {
    path: '',
    component: CurriculumComponent
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./pages/cv-detail/cv-detail.module').then(m => m.CvDetailModule),
    resolve: {
      cv: CurriculumResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurriculumRoutingModule { }
