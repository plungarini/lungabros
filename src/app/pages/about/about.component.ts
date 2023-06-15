import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {

	constructor(
		private pageLoader: PageLoaderService,
	) { }
	
	ngOnInit(): void {
		this.pageLoader.show(false);
	}

}
