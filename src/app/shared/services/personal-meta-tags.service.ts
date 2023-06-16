import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';


type UpdateMetaTagsArgs = {
	title: string;
	description?: string;
	img?: string;
}
type UpdateArticleMetaTagsArgs = {
	title: string;
	description: string;
	tags: string[];
	publishedTime: string;
}
type InitMetaTagsArgs = {
	description: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalMetaTagsService {

	private siteName = 'LungaBros';
	private defaultDesc = '';
	private defaultOgImg = 'https://lungabros.it/assets/meta/lungabros-og_image.png';

	constructor(
		private title: Title,
		private meta: Meta,
		private router: Router,
	) { }
	
	/**
	 * Initializes meta tags for the webpage, including Open Graph and Twitter metadata.
	 *
	 * @param {InitMetaTagsArgs} opt - Object containing a meta tags of the page.
	 */
	init(opt: InitMetaTagsArgs) {
		this.defaultDesc = opt.description;

		this.title.setTitle(this.siteName + ' | Your diving experience.');
		this.meta.addTags([
			{ name: 'og:title', content: this.siteName + ' | Your diving experience.' },
			{ name: 'description', content: opt.description },
			{ name: 'og:description', content: opt.description },
			{ name: 'og:site_name', content: this.siteName },
			{ name: 'og:url', content: 'https://lungabros.it/' },
			{ name: 'og:type', content: 'website' },
			{ name: 'og:locale', content: 'it_IT' },
			{ name: 'author', content: this.siteName },
			{ name: 'keywords', content: 'immersione subacquea, mondo sommerso, subacqueo professionista, certificazione subacquea, corsi PADI, istruttori PADI, avventure subacquee, sicurezza subacquea, preservazione degli oceani, passione per l\'immersione, standard di sicurezza, PADI AWARE' },
			{ name: 'og:image', content: this.defaultOgImg },
			{ name: 'og:image:width', content: '1179' },
			{ name: 'og:image:height', content: '630' },
			{ name: 'twitter:card', content: 'summary' },
			{ name: 'twitter:title', content: this.siteName + ' | Your diving experience.' },
			{ name: 'twitter:description', content: opt.description },
		]);
	}

	private removeArticleTags(): void {
		this.meta.removeTag('name="article:published_time"');
		this.meta.removeTag('name="article:tag"');
	}

	/**
	 * Sets the article with new meta tags. Removes previous meta tags if present.
	 *
	 * @param {UpdateArticleMetaTagsArgs} opt - An object containing article meta tag options.
	 */
	setArticle(opt: UpdateArticleMetaTagsArgs) {
		// Remove tags if present
		this.removeArticleTags();

		// Update meta tags
		this.title.setTitle(this.siteName + ' | ' + opt.title);
		this.meta.addTags([
			{ name: 'article:published_time', content: '' },
			{ name: 'article:tag', content: opt.tags.join(',') },
		]);
		this.meta.updateTag({
			name: 'type',
			content: 'article',
		});
		this.meta.updateTag({
			name: 'og:title',
			content: opt.title,
		});
		this.meta.updateTag({
			name: 'description',
			content: opt.description,
		});
		this.meta.updateTag({
			name: 'og:description',
			content: opt.description,
		});
		this.meta.updateTag({
			name: 'twitter:title',
			content: this.siteName + ' | ' + opt.title,
		});
		this.meta.updateTag({
			name: 'twitter:description',
			content: opt.description,
		});
		this.meta.updateTag({
			name: 'og:image',
			content: this.defaultOgImg,
		});
		this.meta.updateTag({
			name: 'og:url',
			content: 'https://lungabros.it' + this.router.url,
		});
	}

	/**
	 * Updates the meta tags of the website with the given arguments. 
	 *
	 * @param {UpdateMetaTagsArgs} opt - An object containing the metadata information.
	 */
	update(opt: UpdateMetaTagsArgs) {
		// Remove tags if present
		this.removeArticleTags();

		this.title.setTitle(this.siteName + ' | ' + opt.title);
		this.meta.updateTag({
			name: 'og:title',
			content: opt.title,
		});
		this.meta.updateTag({
			name: 'description',
			content: opt.description || this.defaultDesc,
		});
		this.meta.updateTag({
			name: 'og:description',
			content: opt.description || this.defaultDesc,
		});
		this.meta.updateTag({
			name: 'type',
			content: 'website',
		});
		this.meta.updateTag({
			name: 'twitter:title',
			content: this.siteName + ' | Your diving experience',
		});
		this.meta.updateTag({
			name: 'twitter:description',
			content: opt.description || this.defaultDesc,
		});
		this.meta.updateTag({
			name: 'og:url',
			content: 'https://lungabros.it' + this.router.url,
		});
		this.meta.updateTag({
			name: 'og:image',
			content: opt.img || this.defaultOgImg,
		});
	}
}
