import { Injectable } from '@angular/core';
import { where } from '@firebase/firestore';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { UsersService } from 'src/app/auth/services/users.service';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { TodoTask } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(
    private db: FirebaseExtendedService,
    private usersService: UsersService
  ) {}

  getUnreadedTasksCount(): Observable<number> {
		return this.usersService.getCurrentFire().pipe(
			take(1),
      switchMap((user) => {
        if (!user) return of(0);
        return this.db
          .getCol<TodoTask>(
            'tasks',
            'id',
            where('readBy', 'not-in', [[user.uid]])
          )
					.pipe(
						take(1),
						map((t) => t.length),
					);
      })
    );
  }

  saveTask(task: TodoTask): void {
    if (!task) return;
    this.db.upsert<TodoTask>(`tasks/${task.id}`, task);
  }

  completeTask(id: string, value: boolean): void {
    this.db.upsert<TodoTask>(`tasks/${id}`, { completed: value });
  }

  deleteTask(id: string): Promise<void> {
    return this.db.delete(`tasks/${id}`);
  }

  readNewTasks(tasks: TodoTask[], uid: string): void {
    tasks.forEach((t) => {
      const isNew = !t.readBy.includes(uid);
      if (!isNew) return;
      setTimeout(() => {
        t.readBy.push(uid);
        this.db.upsert<TodoTask>(`tasks/${t.id}`, t);
        console.log('All new tasks readed');
      }, 3000);
    });
  }
}
