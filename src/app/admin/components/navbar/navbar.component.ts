import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable, fromEvent, startWith, map } from 'rxjs';

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

  @Input() tasksCount: number = 0;

  nav = [
    { path: 'todo', name: 'Todo List' },
    { path: 'courses', name: 'Corsi' },
    { path: 'cv', name: 'Curriculum' },
  ];
  mediaSub: Subscription | undefined;
  isMobile = false;

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.mediaSub = this.media('(max-width: 768px)').subscribe((matches) => {
      this.isMobile = matches;
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.mediaSub?.unsubscribe();
  }

  media(query: string): Observable<boolean> {
    const mediaQuery = window.matchMedia(query);
    return fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
      startWith(mediaQuery),
      map((list: MediaQueryList) => list.matches)
    );
  }

  getCount(path: string): number {
    switch (path) {
      case 'todo':
        return this.tasksCount;
      case 'courses':
        return 0;
      case 'cv':
        return 0;
    
      default:
        return 0;
    }
  }

}
