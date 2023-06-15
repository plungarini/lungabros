import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Course } from '../../../../../../shared/models/course.model';

@Component({
  selector: 'app-course-gallery',
  templateUrl: './course-gallery.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseGalleryComponent implements OnInit {

  @Input('course') set setCourse(value: Course | undefined) {
    if (!value) return;
    this.course = {
      ...value,
      gallery: value.gallery.sort((a, b) => {
        const normA = parseFloat(a.replace(/(?:[^0-9]*)/g, ''));
        const normB = parseFloat(b.replace(/(?:[^0-9]*)/g, ''));
        return normA - normB;
      })
    };
    this.normGallery = this.course.gallery.map((p) => ({
      src: p,
      loaded: false,
    }));
  }

  course: Course | undefined;
  normGallery: any[] = [];
  selectedImg = 0;

  constructor() { }

  ngOnInit(): void {
  }

  previousImg(): void {
    const newIndex = this.selectedImg - 1;
    if (this.course?.gallery[newIndex]) {
      this.selectedImg = newIndex;
    } else {
      const len = this.course?.gallery.length;
      this.selectedImg = len ? len - 1 : 0;
    }
  }

  nextImg(index?: number, el?: HTMLElement): void {
    const newIndex = index !== undefined ? index + 1 : this.selectedImg + 1;
    if (this.course?.gallery[newIndex]) {
      this.selectedImg = newIndex;
    } else {
      this.selectedImg = 0;
    }
  }

  imgLoaded(i: number): void {
    this.normGallery[i].loaded = true
  }

}
