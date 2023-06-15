import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Course } from '../../../../../../shared/models/course.model';

@Component({
  selector: 'app-course-specs',
  templateUrl: './course-specs.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseSpecsComponent implements OnInit {
  @Input() course: Course | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
