import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  menuAnimationOpen = false;

  navigation = [
    { name: 'Home', url: '' },
    { name: 'Corsi', url: 'courses' },
    { name: 'About Us', url: 'about' },
    { name: 'Contatti', url: 'contact' },
  ];

  userSub: Subscription | undefined;
  isUserAdmin = false;

  constructor(
		private cdRef: ChangeDetectorRef,
		// TODO
    /* private userService: UsersService, */
  ) { }

	ngOnInit(): void {
		// TODO
    /* this.userSub = this.userService.getCurrentUserDb()
      .subscribe(u => {
        this.isUserAdmin = u?.roles?.admin || false;
        this.cdRef.detectChanges();
      }); */
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
