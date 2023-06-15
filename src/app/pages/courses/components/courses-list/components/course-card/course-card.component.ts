import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { Course } from '../../../../../../shared/models/course.model';

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
    this.course = {
      ...value,
      bgImg: value.bgImg || 'stock/header.jpeg',
      gallery: value.gallery.map((i) => i || 'stock/header.jpeg'),
    };
    this.cdRef.detectChanges();
  }

  course: Course | undefined;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  get isHighlighted(): boolean {
    return this.course?.category.includes('main') ? true : false;
  }
}
