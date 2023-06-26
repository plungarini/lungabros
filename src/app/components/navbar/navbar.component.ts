import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UsersService } from 'src/app/auth/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnDestroy {
  menuOpen = false;
  menuAnimationOpen = false;

  navigation = [
    { name: 'Home', url: '' },
    { name: 'Corsi', url: 'courses' },
    { name: 'About Us', url: 'about' },
    { name: 'Contatti', url: 'contact' },
  ];

	private isUserAdmin$ = new BehaviorSubject<boolean>(false);
	isUserAdmin: Observable<boolean> = this.isUserAdmin$.asObservable();

	private userSub: Subscription;

  constructor(
		private cdRef: ChangeDetectorRef,
    private userService: UsersService,
	) {
		this.userSub = this.userService.getCurrentUserDb().subscribe(u => {
			this.isUserAdmin$.next(u?.roles?.admin || false);
		})
	}

	ngOnDestroy(): void {
		this.userSub?.unsubscribe();
	}

  toggleMenu(state?: boolean): void {
    this.menuOpen = state !== undefined ? state : !this.menuOpen;
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.menuAnimationOpen = state !== undefined ? state : !this.menuOpen;
    }, 300);
  }

}
