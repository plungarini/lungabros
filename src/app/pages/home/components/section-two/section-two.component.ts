import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';

@Component({
  selector: 'app-section-two',
  templateUrl: './section-two.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTwoComponent implements OnInit, OnDestroy {
  showSpec = false;
  courses: (Course | number)[] = [1, 2, 3, 4];
  courseSubs: Subscription[] = [];

  constructor(
    private db: FirebaseExtendedService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    ['open-water', 'advanced-open-water', 'rescue', 'divemaster'].forEach(
      (id, i) => {
        const sub = this.db.getDoc<Course>(`courses/${id}`).pipe(take(1)).subscribe((c) => {
          if (!c) return;
          this.courses[i] = c;
          this.cdRef.detectChanges();
        });
        this.courseSubs.push(sub);
      }
    );
  }

  ngOnDestroy(): void {
    this.courseSubs.forEach((sub) => sub.unsubscribe());
  }

  numberOrCourse(course: number | Course): Course | undefined {
    return typeof course === 'number' ? undefined : course;
  }
}
