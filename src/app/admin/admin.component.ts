import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PersonalMetaTagsService } from '../shared/services/personal-meta-tags.service';
import { TodoService } from './pages/todo/services/todo.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: [],
})
export class AdminComponent implements OnInit, OnDestroy {
  tasksCount = 0;

  routerSub: Subscription | undefined;
  dbConnection: Subscription | undefined;

  constructor(
    private router: Router,
    private tasksService: TodoService,
		private cdRef: ChangeDetectorRef,
		private meta: PersonalMetaTagsService,
  ) {}

  ngOnInit(): void {
    this.meta.update({
			title: 'Admin panel'
		})
    this.routerSub = this.router.events
      .pipe(filter((event) => (event instanceof NavigationStart || event instanceof NavigationEnd)))
      .subscribe((e) => {
        if (e instanceof NavigationStart || e instanceof NavigationEnd) {
          if (e.url.includes('admin')) {
            this.meta.update({
							title: 'Admin panel'
						})
          }
        }
      });

    this.dbConnection = this.tasksService
      .getUnreadedTasksCount()
      .subscribe((tasksCount) => {
        this.tasksCount = tasksCount;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.dbConnection?.unsubscribe();
  }
}
