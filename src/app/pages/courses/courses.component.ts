import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Subscription } from 'rxjs';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
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
		private titleService: Title,
		private pageLoader: PageLoaderService,
  ) { }

	ngOnInit(): void {
		this.headerSub = this.headerService.header.subscribe((header) => {
			this.title = header.title;
      this.imgPath = header.bgImg;
      this.subtitle = header.subtitle || '';
      this.titleService.setTitle(`LUNGABROS | ${this.title}`);
      this.cdRef.detectChanges();
			this.pageLoader.show(false);
    });
  }

  ngOnDestroy(): void {
    this.headerSub?.unsubscribe();
  }

}
