import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ArticleSchemaOrg, CourseListSchemaOrg, CourseSchemaOrg, PersonSchemaOrg, SchemaOrg } from '../models/schema-org.model';


type UpdateArticleMetaTagsArgs = {
	title: string;
	description: string;
	tags: string[];
	createdAt: string;
	img?: string;
}
type UpdateCourseMetaTagsArgs = {
	id: string;
	title: string;
	description?: string;
	createdAt: string;
	img: string;
}
type UpdatePersonMetaTagsArgs = {
	title: string;
	name: string;
	description?: string;
	email: string;
	jobTitle: string;
	languages: string[];
	socials: string[];
	phone: string;
	img: string;
}
type GeneralTags = {
	title: string;
	img?: string;
	description?: string;
	type?: 'website' | 'course' | 'article' | 'person',
}
type InitMetaTagsArgs = {
	description: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalMetaTagsService {

	private siteName = 'Lunga BROS';
	private defaultDesc = '';
	private defaultOgImg = 'https://lungabros.it/assets/meta/lungabros-og_image.png';
	private schema: SchemaOrg = {};

	constructor(
		private title: Title,
		private meta: Meta,
		private router: Router,
    @Inject(DOCUMENT) private document: Document
	) { }
	
	/**
	 * Initializes meta tags for the webpage, including Open Graph and Twitter metadata.
	 *
	 * @param {InitMetaTagsArgs} opt - Object containing a meta tags of the page.
	 */
	init(opt: InitMetaTagsArgs): void {
		this.defaultDesc = opt.description;

		this.schema = {
			"@type": "Organization",
			"name": this.siteName,
			"email": "info@lungabros.it",
			"description": opt.description,
			"url": "http://www.lungabros.it",
			"logo": "http://www.lungabros.it/assets/logo/logo_lungabros_onwhite.png",
			"founder": [
				{
					"@type": "Person",
					"name": "Pietro Lungarini",
					"jobTitle": "Istruttore PADI #529123",
					"description": "Vengo da Cesena, una piccola città dell'Emilia-Romagna. Assieme a mio fratello ho scoperto la subacquea nel 2018 e da quell'anno non abbiamo mai smesso di immergerci negli abissi! Da Freelancer, ho intrapreso un lungo percorso di continua evoluzione. Grazie alla mia curiosità ho infatti acquisito competenze sotto tantissimi aspetti.",
					"image": "https://lungabros.imgix.net/gallery/pietro_overlay-min.png?ixlib=ng-1.0.0-rc.1&auto=format%2Ccompress&ar=1%3A1&fit=crop&crop=top&w=1946",
					"email": "pietro@lungabros.com",
					"telephone": "+393349447086",
					"knowsLanguage": ["IT", "EN"],
					"affiliation": {
						"@type": "Organization",
						"name": 'PADI',
						"sameAs": 'https://www.padi.com/',
					},
					"birthDate": '1999-06-20',
					"url": 'https://lungabros.it/about/pietro-lungarini',
					"sameAs": [
						"https://instagram.com/wheresbebo",
						"https://www.facebook.com/pietrolungarini",
						"https://linkedin.com/in/plungarini",
						"https://twitter.com/wheresbebo"
					]
				},
				{
					"@type": "Person",
					"name": "Samuele Lungarini",
					"jobTitle": "Istruttore PADI #529119",
					"description": "Vengo da Cesena, una piccola città dell'Emilia-Romagna. Assieme a mio fratello ho scoperto la subacquea nel 2018 e da quell'anno non abbiamo mai smesso di immergerci negli abissi! Inoltre ho appreso diverse competenze che mi hanno aiutato a crescere in diversi aspetti, sia subacquei che non.",
					"image": "https://lungabros.imgix.net/gallery/samuele_overlay-min.png?ixlib=ng-1.0.0-rc.1&auto=format%2Ccompress&ar=1%3A1&fit=crop&crop=top&w=1946",
					"email": "samuele@lungabros.com",
					"telephone": "+393317595546",
					"knowsLanguage": ["IT", "EN"],
					"affiliation": {
						"@type": "Organization",
						"name": 'PADI',
						"sameAs": 'https://www.padi.com/',
					},
					"birthDate": '2004-05-06',
					"url": 'https://lungabros.it/about/samuele-lungarini',
					"sameAs": [
						"https://instagram.com/samuele.lungarini",
						"https://www.facebook.com/samuele.lungarini",
						"https://www.linkedin.com/in/slungarini"
					]
				}
			],
			"foundingDate": "2018",
			"sameAs": [
				"https://www.instagram.com/lungabros/"
			],
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "Cesena",
				"addressRegion": "Emilia-Romagna",
				"postalCode": "47521",
				"addressCountry": "Italy"
			},
			"contactPoint": [
				{
					"@type": "ContactPoint",
					"telephone": "+393317595546",
					"contactType": "customer service",
					"availableLanguage": ["IT"]
				},
				{
					"@type": "ContactPoint",
					"telephone": "+393349447086",
					"contactType": "customer service",
					"availableLanguage": ["IT", "EN"]
				}
			],
		};

		this.meta.addTags([
			{ property: 'og:title', content: this.siteName + ' | Your diving experience.' },
			{ property: 'og:description', content: opt.description },
			{ property: 'og:site_name', content: this.siteName },
			{ property: 'og:url', content: 'https://lungabros.it/' },
			{ property: 'og:type', content: 'website' },
			{ property: 'og:locale', content: 'it_IT' },
			{ property: 'fb:app_id', content: '1049725339732847' },
			{ name: 'keywords', content: 'immersione subacquea, mondo sommerso, corsi subacquei, diving course, brevetto sub padi, brevetto padi open water, orca diving center puglia, orca diving center torre lapillo, snorkeling torre lapillo, torre lapillo snorkeling, corso blsd riconosciuto, lunga bros, corsi, subacquei, orcadivingcenter, orca, diving, torre lapillo, puglia, corso blsd, diving club, e-learning, elearning, diving salento, immersioni puglia, diving service, corso scuba diver, corso sub lecce, immersioni salento, diving salento relitti, esame divemaster padi, padi, padi open water, corsi padi, padi pros, domande esame rescue padi, brevetto sub livelli, subacqueo professionista, certificazione subacquea, corsi PADI, istruttori PADI, avventure subacquee, sicurezza subacquea, preservazione degli oceani, passione per l\'immersione, standard di sicurezza, PADI AWARE' },
			{ property: 'og:image', content: this.defaultOgImg },
			{ property: 'og:image:width', content: '1179' },
			{ property: 'og:image:height', content: '630' },
			{ name: 'twitter:card', content: 'summary' },
			{ name: 'twitter:site', content: this.siteName },
			{ name: 'twitter:image', content: this.defaultOgImg },
			{ name: 'twitter:title', content: this.siteName + ' | Your diving experience.' },
			{ name: 'twitter:description', content: opt.description },
		]);

		this.update({ ...opt, title: this.siteName + ' | Your diving experience.' });
	}

	/**
	 * Sets the course with new meta tags. Removes previous meta tags if present.
	 *
	 * @param {UpdateCourseMetaTagsArgs} opt - An object containing course meta tag options.
	 */
	setCourse(opt: UpdateCourseMetaTagsArgs): void {
		const schema: CourseSchemaOrg = {
			"@type": "Course",
			"@id": `https://lungabros.it/courses/info/${opt.id}`,
			"name": opt.title,
			"description": opt.description || this.defaultDesc,
			"datePublished": opt.createdAt,
			"image": opt.img,
			"url": `https://lungabros.it/courses/info/${opt.id}`,
			"hasCourseInstance": {
				"@type": "CourseInstance",
				instructor: this.schema.founder
			},
			"provider": {
				"@type": "Organization",
				"name": 'PADI',
				"sameAs": 'https://www.padi.com/',
			}
		}

		this._update({ ...opt, type: 'course' });
		this.append(schema);
	}
	
	/**
	 * Sets the person metadata tags.
	 *
	 * @param {UpdatePersonMetaTagsArgs} opt - The options for updating the person metadata tags.
	 */
	setPerson(opt: UpdatePersonMetaTagsArgs): void {
		opt.img = opt.img ?
			`https://lungabros.imgix.net/gallery/${opt.img}-min.png?ixlib=ng-1.0.0-rc.1&auto=format%2Ccompress&ar=1%3A1&fit=crop&crop=top&w=1946` :
			this.defaultOgImg;

		const schema: PersonSchemaOrg = {
			"@type": "Person",
			"name": opt.name,
			"description": opt.description || this.defaultDesc,
			"image": opt.img,
			"url": 'https://lungabros.it' + this.router.url,
			email: opt.email,
			jobTitle: opt.jobTitle,
			knowsLanguage: opt.languages,
			sameAs: opt.socials,
			telephone: opt.phone,
		}

		this._update({ ...opt, type: 'person' });
		this.append(schema);
	}
	
	/**
	 * Sets the course list by updating the course meta tags.
	 *
	 * @param {UpdateCourseMetaTagsArgs[]} opt - An array of objects representing the course meta tags to be updated.
	 */
	setCourseList(opt: UpdateCourseMetaTagsArgs[]): void {
		const schema: CourseListSchemaOrg = {
			"@type": "ItemList",
			itemListElement: [],
		}

		for (let i = 0; i < opt.length; i++) {
			const course = opt[i];

			const courseSchema: CourseSchemaOrg = {
				"@type": "Course",
				"@id": `https://lungabros.it/courses/info/${course.id}`,
				"name": course.title,
				"description": course.description || this.defaultDesc,
				"datePublished": course.createdAt,
				"image": course.img,
				"url": `https://lungabros.it/courses/info/${course.id}`,
				"hasCourseInstance": {
					"@type": "CourseInstance",
					instructor: this.schema.founder
				},
				"provider": {
					"@type": "Organization",
					"name": 'PADI',
					"sameAs": 'https://www.padi.com/',
				}
			}

			schema.itemListElement.push({
				"@type": "ListItem",
				position: i + 1,
				item: courseSchema,
			});
		}

		this._update({
			type: 'website',
			title: 'I nostri corsi',
			description: 'Esplora le meraviglie sottomarine con i nostri corsi subacquei. Dalla formazione di base all\'avventura esperta, scopri un nuovo mondo sotto le onde. Unisciti a noi per un\'immersione emozionante!',
		});
		this.append(schema);
	}

	/**
	 * Sets the article metadata tags.
	 *
	 * @param {UpdateArticleMetaTagsArgs} opt - The options for updating the article metadata tags.
	 */
	setArticle(opt: UpdateArticleMetaTagsArgs): void {
		const schema: ArticleSchemaOrg = {
			"@type": "Article",
			"headline": opt.title,
			"description": opt.description,
			"datePublished": opt.createdAt,
			"dateModified": opt.createdAt,
			"url": 'https://lungabros.it' + this.router.url,
			"image": opt.img,
			"keywords": opt.tags,
			"author": [
				{
					"@type": "Person",
					"name": "Pietro Lungarini",
					"url": "https://lungabros.it/about/pietro-lungarini"
				},
				{
					"@type": "Person",
					"name": "Samuele Lungarini",
					"url": "https://lungabros.it/about/samuele-lungarini"
				},
			]
		}

		this._update({ ...opt, type: 'article' });
		this.append(schema);
	}

	/**
	 * Updates the given GeneralTags object.
	 *
	 * @param {GeneralTags} opt - The GeneralTags object to update.
	 */
	update(opt: GeneralTags): void {
		this.append(this.schema, true);
		this._update(opt);
	}

	/**
	 * Updates the meta tags and title of the page based on the provided options.
	 *
	 * @param {GeneralTags} opt - The options for updating the meta tags and title.
	 */
	private _update(opt: GeneralTags): void {
		this.setCanonical();

		this.title.setTitle(opt.title);
		
		this.meta.updateTag({
			name: '@type',
			content: opt.type || 'website',
		});
		this.meta.updateTag({
			property: 'og:title',
			content: opt.title,
		});
		this.meta.updateTag({
			name: 'description',
			content: opt.description || this.defaultDesc,
		});
		this.meta.updateTag({
			property: 'og:description',
			content: opt.description || this.defaultDesc,
		});
		this.meta.updateTag({
			property: 'og:type',
			content: opt.type === 'article' ? 'article' : 'website',
		});
		this.meta.updateTag({
			name: 'twitter:title',
			content: opt.title,
		});
		this.meta.updateTag({
			name: 'twitter:site',
			content: this.siteName,
		});
		this.meta.updateTag({
			name: 'twitter:image',
			content: opt.img || this.defaultOgImg,
		});
		this.meta.updateTag({
			name: 'twitter:description',
			content: opt.description || this.defaultDesc,
		});
		this.meta.updateTag({
			property: 'og:image',
			content: opt.img || this.defaultOgImg,
		});
		this.meta.updateTag({
			property: 'og:url',
			content: 'https://lungabros.it' + this.router.url,
		});
	}

	private setCanonical(): void {
		let canonical = this.document.getElementById('canonical') as HTMLLinkElement | null;
		if (!canonical) {
			canonical = this.document.createElement('link');
		}

		canonical.rel = 'canonical';
		canonical.href = 'https://lungabros.it' + this.router.url;
		canonical.id = 'canonical';

		if (this.document.head.firstChild) {
			this.document.head.insertBefore(canonical, this.document.head.firstChild);
		} else {
			this.document.head.appendChild(canonical);
		}
	}

	/**
	 * Appends an item to the schema by creating or updating a <script> element in the document's head.
	 *
	 * @param {SchemaOrg | CourseSchemaOrg | ArticleSchemaOrg | CourseListSchemaOrg | PersonSchemaOrg} item - The item to append to the schema.
	 * @param {boolean} isDefault - Whether the item is the default item or not. Default: false.
	 */
	private append(item: SchemaOrg | CourseSchemaOrg | ArticleSchemaOrg | CourseListSchemaOrg | PersonSchemaOrg, isDefault: boolean = false): void {
		let script = this.document.getElementById('schema') as HTMLScriptElement | null;
		if (!script) {
			script = this.document.createElement('script');
		}
		script.setAttribute('type', 'application/ld+json');
		script.id = 'schema';
		
		if (!isDefault) {
			script.text = JSON.stringify({
				'@context': 'https://schema.org',
				'@graph': [this.schema, item],
			});
		} else {
			script.text = JSON.stringify({
				'@context': 'https://schema.org',
				'@graph': [this.schema],
			});
		}

    if (this.document.head.firstChild) {
			this.document.head.insertBefore(script, this.document.head.firstChild);
		} else {
			this.document.head.appendChild(script);
		}
		
	}
	
}
