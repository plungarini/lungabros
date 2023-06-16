import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { CustomPreloadingStrategyService } from './shared/services/custom-preloading-strategy.service';

const routes: Routes = [
	{
    path: '',
    data: { preload: true },
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
	},
	{
    path: 'courses',
    data: { preload: true },
    loadChildren: () =>
      import('./pages/courses/courses.module').then((m) => m.CoursesModule),
  },
	{
    path: 'about',
    data: { preload: true },
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutModule),
  },
	{
    path: 'contact',
    data: { preload: true },
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactModule),
	},
	{
    path: 'articles',
    loadChildren: () =>
      import('./pages/articles/articles.module').then((m) => m.ArticlesModule),
	},
	{
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
	{
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
		initialNavigation: 'enabledBlocking',
		anchorScrolling: 'enabled',
		scrollPositionRestoration: 'enabled',
		preloadingStrategy: CustomPreloadingStrategyService,
	})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
