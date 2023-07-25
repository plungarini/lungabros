import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';

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
		private meta: PersonalMetaTagsService,
	) { }
	
	ngOnInit(): void {
		this.pageLoader.show(false);
		this.meta.update({
			title: 'About us',
			description: 'Siamo due fratelli che hanno scoperto la subaquea nel 2018 durante una vacanza. Non avevamo idea prima di quella vacanza che ci si potesse immergere con così tanta facilità e negli anni abbiamo trasformato la subacquea in una passione e successivamente in un lavoro.'
		})
	}

}
