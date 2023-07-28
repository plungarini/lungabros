import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';
import { Course } from '../../../../shared/models/course.model';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styles: [],
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course | undefined;
  courseSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
		private cdRef: ChangeDetectorRef,
		private pageLoader: PageLoaderService,
		private meta: PersonalMetaTagsService,
  ) { }

  ngOnInit(): void {
    this.courseSub = this.route.data.subscribe(({ course }) => {
			if (!course) return;
      this.course = this.normCourse(course);
			this.headerService.setHeader({
				title: this.course.title,
				bgImg: this.course.bgImg,
				description: this.course.shortDesc,
			});
			this.meta.setCourse({
				title: this.course.title,
				description: this.course.shortDesc,
				img: 'https://lungabros.imgix.net/' + this.course.bgImg + '?auto=format%2Ccompress&w=1200',
				createdAt: this.course.createdAt?.toDate().toISOString() || new Date().toISOString(),
			});
      this.cdRef.detectChanges();
			this.pageLoader.show(false);
    });
  }

  ngOnDestroy(): void {
    this.courseSub?.unsubscribe();
  }

  private normCourse(course: Course): Course {
    const gallery = course.gallery.sort((a, b) => {
      const normA = parseFloat(a.replace(/(?:[^0-9]*)/g, ''));
      const normB = parseFloat(b.replace(/(?:[^0-9]*)/g, ''));
      return normB - normA;
    });
    return {
      ...course,
      gallery
    }
  }

}
