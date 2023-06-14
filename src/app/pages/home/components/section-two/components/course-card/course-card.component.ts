import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent implements OnInit {
  @Input('course') set setCourse(value: Course | undefined) {
    if (!value) return;
    this.course = value;
    this.cdRef.detectChanges();
  }

  course: Course | undefined;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  get isHighlighted(): boolean {
    return false;
  }
}
