import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';

@Component({
  templateUrl: './torchbearer.component.html',
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TorchbearerComponent implements OnInit {

	constructor(
		private pageLoader: PageLoaderService,
		private meta: PersonalMetaTagsService,
	) {
		this.meta.setArticle({
			title: 'Proteggere gli oceani: 5 modi per fare la differenza',
			description: 'Scopri come fare la tua parte nella conservazione degli oceani. Da subacquei esperti, ti presentiamo cinque modi per proteggere gli oceani, incluso l\'utilizzo dei principi del Leave No Trace, la partecipazione a iniziative di pulizia dei fondali e molto altro.',
			createdAt: new Date('2023-06-15').toISOString(),
			tags: [
				'oceani',
				'conservazione',
				'subacqueo',
				'subacquea',
				'immersioni',
				'PADI',
				'Leave No Trace',
				'pulizia dei fondali',
				'educazione ambientale',
				'compagnie di immersione sostenibili',
				'sviluppo delle competenze subacquee'
			],
		});

	}

	ngOnInit(): void {
		this.pageLoader.show(false);
	}
	
}
