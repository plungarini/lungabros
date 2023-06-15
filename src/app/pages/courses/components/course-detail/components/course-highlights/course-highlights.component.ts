import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Course } from '../../../../../../shared/models/course.model';

@Component({
  selector: 'app-course-highlights',
  templateUrl: './course-highlights.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseHighlightsComponent implements OnInit {
  @Input() course: Course | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
