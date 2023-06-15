import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { Course } from '../../../../../../shared/models/course.model';

@Component({
  selector: 'app-course-suggestion',
  templateUrl: './course-suggestion.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseSuggestionComponent implements OnInit, OnDestroy {

  courseSub: Subscription[] = [];
  suggestions: {
    id: string;
    title: string;
    bgImg: string;
  }[] = [];

  @Input('course') set setCourse(value: Course | undefined) {
    if (!value) return;
    this.course = value;
    this.suggestions = [];

    if (!value.suggestedCourse || value.suggestedCourse.length <= 0) return;
    value.suggestedCourse.forEach(suggestion => {
      const sub = this.db.getDoc<Course>(`courses/${suggestion}`).subscribe(course => {
        if (!course) return;
        const obj = {
          id: course.id,
          title: course.title
            .replace('PADI®', '')
            .replace('EFR®', '')
            .trim(),
          bgImg: course.bgImg,
        };
        for (let [i, value] of this.suggestions.entries()) {
          if (value.id === obj.id) {
            this.suggestions.splice(i, 1);
          }
        }
        this.suggestions.push(obj);
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
