import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';

@Component({
  templateUrl: './sicurezza.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      a {
        @apply cursor-pointer underline decoration-indigo-400 decoration-wavy;

        &:not(.text-zinc-200) {
          @apply text-indigo-400;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SicurezzaComponent implements OnInit {

  constructor(
		private pageLoader: PageLoaderService
	) {}

	ngOnInit(): void {
		this.pageLoader.show(false);
	}

}
