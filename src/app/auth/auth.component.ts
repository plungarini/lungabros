import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PageLoaderService } from '../shared/services/page-loader.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: []
})
export class AuthComponent implements OnInit, OnDestroy {

  routerSub: Subscription | undefined;

  constructor(
    private pageTitle: Title,
    private router: Router,
		private route: ActivatedRoute,
		private pageLoader: PageLoaderService,
  ) { }

	ngOnInit(): void {
		this.pageLoader.show(false);
    this.pageTitle.setTitle(`LUNGABROS | Login`);
    this.routerSub = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
      ).subscribe(e => {
        if (e instanceof NavigationStart) {
          if (e.url.includes('login')) {
            this.pageTitle.setTitle(`LUNGABROS | Admin Login`);
          }
        }
      });
    const returnUrl = this.route.snapshot.paramMap.get('returnUrl');
    if (returnUrl) localStorage.setItem('returnUrl', returnUrl);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

}
