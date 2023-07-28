import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesComponent } from './articles.component';
import { SicurezzaComponent } from './pages/sicurezza/sicurezza.component';
import { TorchbearerComponent } from './pages/torchbearer/torchbearer.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesComponent,
    children: [
      {
        path: 'importanza-della-sicurezza',
        component: SicurezzaComponent,
      },
      {
        path: 'torchbearers',
        component: TorchbearerComponent,
			},
			{
				path: '**',
				redirectTo: 'importanza-della-sicurezza',
				pathMatch: 'full',
			}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
