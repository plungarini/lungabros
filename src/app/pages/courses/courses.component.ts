import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';
import { HeaderService } from './services/header.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styles: [''],
})
export class CoursesComponent implements OnInit, OnDestroy {
  title = '';
  subtitle = '';
  imgPath = '';
  
  headerSub: Subscription | undefined;

  constructor(
    private cdRef: ChangeDetectorRef,
    private headerService: HeaderService,
		private pageLoader: PageLoaderService,
		private meta: PersonalMetaTagsService,
  ) { }

	ngOnInit(): void {
		this.headerSub = this.headerService.header.subscribe((header) => {
			this.title = header.title;
      this.imgPath = header.bgImg;
			this.subtitle = header.subtitle || '';
			this.meta.update({
				title: this.title,
				description: header.description,
				img: 'https://lungabros.imgix.net/' + header.bgImg + '?auto=format%2Ccompress&w=1200'
			})
      this.cdRef.detectChanges();
			this.pageLoader.show(false);
    });
  }

  ngOnDestroy(): void {
    this.headerSub?.unsubscribe();
  }

}
