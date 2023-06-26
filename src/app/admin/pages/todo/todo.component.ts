import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	QueryList,
	ViewChildren
} from '@angular/core';
import { Subscription, switchMap, take } from 'rxjs';
import { UsersService } from 'src/app/auth/services/users.service';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { TodoTask } from './models/todo.model';
import { TodoService } from './services/todo.service';

@Component({
  templateUrl: './todo.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit, OnDestroy {
  @ViewChildren('tasks') tasksElList: QueryList<ElementRef<HTMLDivElement>> =
    new QueryList<ElementRef>();

  tasks: TodoTask[] = [];

  dbConnection: Subscription | undefined;
  userId: string = '';

  constructor(
    private db: FirebaseExtendedService,
    private usersService: UsersService,
    private todoService: TodoService,
		private cdRef: ChangeDetectorRef,
		private pageLoader: PageLoaderService
  ) {}

	ngOnInit(): void {
		this.pageLoader.show(false);
    this.dbConnection = this.usersService
      .getCurrentUserDb()
			.pipe(
				take(1),
        switchMap((user) => {
          this.userId = user?.id || '';
          return this.db.getCol<TodoTask>('tasks').pipe(take(1));
				}),
      )
      .subscribe((t) => {
        this.tasks = t;
        this.sortTasks();
        this.cdRef.detectChanges();
        this.todoService.readNewTasks(t, this.userId);
      });
  }

  ngOnDestroy(): void {
    this.dbConnection?.unsubscribe();
  }

  trackBy(i: number, item: TodoTask): string {
    return item.id;
  }

  addEmptyTask(): void {
    const taskEl1 = this.tasksElList.get(0);
    taskEl1?.nativeElement.querySelector('input')?.blur();
    const id = this.db.generateId();
    this.tasks.push({
      id: id,
      value: '',
      completed: false,
      priority: 1,
      readBy: [this.userId],
    });
    this.sortTasks();
    this.cdRef.detectChanges();
    const taskEl2 = this.tasksElList.get(0);
    taskEl2?.nativeElement.querySelector('input')?.focus();
  }

  taskKeyPress(e: KeyboardEvent, id: string, elIndex: HTMLInputElement): void {
    if (e.shiftKey && e.key === 'Backspace') {
      this.deleteTask(id);
    } else if (e.key === 'Enter') {
      elIndex.blur();
    } else if (e.key === 'Escape') {
      elIndex.blur();
    }
  }

  saveTask(task: TodoTask, newValue: string): void {
    if (!newValue) {
      this.todoService.deleteTask(task.id);
      const i = this.tasks.findIndex((t) => t.id === task.id);
      this.tasks.splice(i, 1);
      return;
    }
    this.todoService.saveTask({ ...task, value: newValue });
  }

  completeTask(id: string): void {
    const item = this.tasks.find((t) => t.id === id);
    if (!item) return;
    this.todoService.completeTask(id, !item.completed);
  }

  deleteTask(id: string, event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.todoService.deleteTask(id);
  }

  isNewTask(task: TodoTask): boolean {
    return !task.readBy.includes(this.userId);
  }

  get nonCompletedTasks(): TodoTask[] {
    return this.tasks.filter((t) => !t.completed);
  }
  get completedTasks(): TodoTask[] {
    return this.tasks.filter((t) => t.completed);
  }

  private sortTasks(): void {
    this.tasks = this.tasks.sort(
      (a, b) =>
        (b.createdAt?.toDate() || new Date()).getTime() -
        (a.createdAt?.toDate() || new Date()).getTime()
    );
  }
}
