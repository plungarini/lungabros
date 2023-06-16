import { Component, OnInit } from '@angular/core';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styles: [],
})
export class CurriculumComponent implements OnInit {

	constructor(
		private pageLoader: PageLoaderService
	) { }

	ngOnInit(): void {
		this.pageLoader.show(false);
  }

}
