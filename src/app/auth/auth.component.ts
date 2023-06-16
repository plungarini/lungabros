import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PageLoaderService } from '../shared/services/page-loader.service';
import { PersonalMetaTagsService } from '../shared/services/personal-meta-tags.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: []
})
export class AuthComponent implements OnInit, OnDestroy {

  routerSub: Subscription | undefined;

  constructor(
    private router: Router,
		private route: ActivatedRoute,
		private pageLoader: PageLoaderService,
		private meta: PersonalMetaTagsService,
  ) { }

	ngOnInit(): void {
		this.pageLoader.show(false);
		this.meta.update({
			title: 'Login',
		})
    this.routerSub = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd),
      ).subscribe(e => {
        if (e instanceof NavigationStart || e instanceof NavigationEnd) {
          if (e.url.includes('login')) {
						this.meta.update({
							title: 'Login',
						})
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
