import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

	constructor(
		private titleService: Title,
	) {
		this.titleService.setTitle(`LUNGABROS`);
	}

}
