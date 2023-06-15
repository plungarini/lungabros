import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about.component';

const routes: Routes = [
	{ path: '', component: AboutComponent },
	{
    path: 'pietro-lungarini',
    loadChildren: () => import('./pages/curriculum/curriculum.module').then(m => m.CurriculumModule),
    data: { id: 'pietro-lungarini' }
  },
  {
    path: 'samuele-lungarini',
    loadChildren: () => import('./pages/curriculum/curriculum.module').then(m => m.CurriculumModule),
    data: { id: 'samuele-lungarini' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
