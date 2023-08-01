import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

	constructor(
		private meta: PersonalMetaTagsService,
	) {
		this.meta.update({
			title: 'Lunga BROS | Your diving experience.',
		})
	}

}
