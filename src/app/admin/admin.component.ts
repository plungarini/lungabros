import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
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
    private pageTitle: Title,
    private router: Router,
    private tasksService: TodoService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pageTitle.setTitle(`LUNGABROS | Admin Panel`);
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          if (e.url.includes('admin')) {
            this.pageTitle.setTitle(`LUNGABROS | Admin Panel`);
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
