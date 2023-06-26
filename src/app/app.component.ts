import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { BehaviorSubject, filter, Observable, Subscription } from 'rxjs';
import { PageLoaderService } from './shared/services/page-loader.service';
import { PersonalMetaTagsService } from './shared/services/personal-meta-tags.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnDestroy {
  routerSub: Subscription | undefined;
  showLoader = true;
	firstStart = true;
	
	showNavBar$: Observable<boolean>;
	$loader: Observable<{ show: boolean }>;
	
  private showNavbarSubject = new BehaviorSubject<boolean>(false);
	
	constructor(
		private meta: PersonalMetaTagsService,
    private router: Router,
		private pageLoader: PageLoaderService,
	) {
		this.meta.init({
			description: 'Esplora le meraviglie del mondo subacqueo con LungaBros: corsi PADI, istruttori qualificati e passione per la sicurezza e la preservazione degli oceani.'
		});

		this.showNavBar$ = this.showNavbarSubject.asObservable();
		this.$loader = this.pageLoader.get();
		
    this.routerSub = this.router.events
			.pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof RouteConfigLoadStart ||
            event instanceof RouteConfigLoadEnd
				),
      )
			.subscribe((e) => {
				if (
					e instanceof NavigationStart ||
					e instanceof NavigationEnd
				) {
					this.pageLoader.show(true);
          if (e.url.includes('admin') || e.url.includes('login')) {
            this.showNavbarSubject.next(false);
          } else {
            this.showNavbarSubject.next(true);
          }
        }
      });
	}

	ngOnDestroy(): void {
		this.showNavbarSubject.complete();
		this.routerSub?.unsubscribe();
	}

}
