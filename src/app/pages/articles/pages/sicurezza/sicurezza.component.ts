import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';

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
		private pageLoader: PageLoaderService,
		private meta: PersonalMetaTagsService,
	) {}

	ngOnInit(): void {
		this.pageLoader.show(false);
		this.meta.setArticle({
			title: 'L\'importanza della sicurezza',
			description: 'Scopri l\'importanza della sicurezza subacquea e perché la subacquea rimane una delle attività più divertenti in vacanza. Conosci le associazioni che hanno contribuito alla sicurezza subacquea e i 5 punti per essere un buon subacqueo.',
			publishedTime: new Date('2023-06-10').toISOString(),
			tags: [
				'sicurezza subacquea',
				'subacquea come attività divertente',
				'associazioni per la sicurezza subacquea',
				'PADI',
				'subacquea e cambiamento di prospettiva',
				'connessione con la natura subacquea',
				'importanza della formazione subacquea',
				'buone abitudini per i subacquei',
				'programmare immersioni subacquee',
				'immersioni in coppia',
				'continua formazione subacquea'
			],
		});
	}

}
