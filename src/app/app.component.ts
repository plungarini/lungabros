import { ChangeDetectorRef, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  routerSub: Subscription | undefined;
  isAdminArea = false;
  showLoader = true;
	firstStart = true;
	
	constructor(
    private titleService: Title,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.titleService.setTitle(`LUNGABROS`);

    this.routerSub = this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof RouteConfigLoadStart ||
            event instanceof RouteConfigLoadEnd
        )
      )
      .subscribe((e) => {
        if (
          !this.firstStart &&
          (e instanceof RouteConfigLoadStart || e instanceof RouteConfigLoadEnd)
        ) {
          let asyncLoadCount = 0;
          if (e instanceof RouteConfigLoadStart) {
            asyncLoadCount++;
          } else if (e instanceof RouteConfigLoadEnd) {
            asyncLoadCount > 0 && asyncLoadCount--;
          }
          this.showLoader = !!asyncLoadCount;
          this.cdRef.detectChanges();
        }

        if (e instanceof NavigationStart) {
          if (e.url === '/') {
            this.titleService.setTitle(`LUNGABROS`);
          } else if (e.url.includes('about')) {
            this.titleService.setTitle(`LUNGABROS | About us`);
          } else if (e.url.includes('contact')) {
            this.titleService.setTitle(`LUNGABROS | Contattaci`);
          }

          if (e.url.includes('admin') || e.url.includes('login')) {
            this.isAdminArea = true;
            this.cdRef.detectChanges();
          } else {
            this.isAdminArea = false;
            this.cdRef.detectChanges();
          }
        }
      });
  }
}
