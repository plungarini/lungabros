import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { Course } from '../../../../../../shared/models/course.model';

@Component({
  selector: 'app-course-advice',
  templateUrl: './course-advice.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseAdviceComponent implements OnInit, OnDestroy {
  courseSub: Subscription[] = [];
  advices: {
    id: string;
    title: string;
    bgImg: string;
  }[] = [];

  @Input('course') set setCourse(value: Course | undefined) {
    if (!value) return;
    this.course = value;

    if (!value.courseAdvice || value.courseAdvice.length <= 0) return;
    value.courseAdvice.forEach(advice => {
      const sub = this.db.getDoc<Course>(`courses/${advice}`).subscribe(course => {
        if (!course) return;
        const obj = {
          id: course.id,
          title: course.title
            .replace('PADI®', '')
            .replace('EFR®', '')
            .trim(),
          bgImg: course.bgImg,
        };
        for (let [i, value] of this.advices.entries()) {
          if (value.id === obj.id) {
            this.advices.splice(i, 1);
          }
        }
        this.advices.push(obj);
        this.cdRef.detectChanges();
      });
      this.courseSub.push(sub);
    });
  };

  course: Course | undefined;

  constructor(
    private db: FirebaseExtendedService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.courseSub.forEach(sub => sub.unsubscribe());
  }

}
