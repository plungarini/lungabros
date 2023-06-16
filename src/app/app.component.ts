import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, filter } from 'rxjs';
import { PageLoaderService } from './shared/services/page-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  routerSub: Subscription | undefined;
  showLoader = true;
	firstStart = true;
	
	showNavBar$: Observable<boolean>;
	$loader: Observable<{ show: boolean }>;
	
  private showNavbarSubject = new BehaviorSubject<boolean>(false);
	
	constructor(
    private titleService: Title,
    private router: Router,
		private pageLoader: PageLoaderService,
	) {
		this.showNavBar$ = this.showNavbarSubject.asObservable();
		this.$loader = this.pageLoader.get();
		this.titleService.setTitle(`LUNGABROS`);
		
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
}
