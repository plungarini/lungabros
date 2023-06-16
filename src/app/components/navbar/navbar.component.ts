import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
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
export class NavbarComponent {
  menuOpen = false;
  menuAnimationOpen = false;

  navigation = [
    { name: 'Home', url: '' },
    { name: 'Corsi', url: 'courses' },
    { name: 'About Us', url: 'about' },
    { name: 'Contatti', url: 'contact' },
  ];

  userSub: Subscription | undefined;
	isUserAdmin$: Observable<boolean>;

  constructor(
		private cdRef: ChangeDetectorRef,
    private userService: UsersService,
	) {
		this.isUserAdmin$ = this.userService.getCurrentUserDb().pipe(
			map((u) => u?.roles?.admin || false)
		)
	}

  toggleMenu(state?: boolean): void {
    this.menuOpen = state !== undefined ? state : !this.menuOpen;
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.menuAnimationOpen = state !== undefined ? state : !this.menuOpen;
    }, 300);
  }

}
