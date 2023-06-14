import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  loaded = false;

	constructor(
		private cdRef: ChangeDetectorRef,
		private pageLoader: PageLoaderService,
	) { }
	
	loadedImg(): void {
		this.loaded = true;
		this.pageLoader.show(false);
		this.cdRef.detectChanges();
	}

}
