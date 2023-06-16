import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';
import { SendEmailService } from 'src/app/shared/services/send-email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {

	form = new FormGroup({
		firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
	});
	

	constructor(
		private sendEmailService: SendEmailService,
		private pageLoader: PageLoaderService,
		private meta: PersonalMetaTagsService,
	) { }

	ngOnInit(): void {
		this.pageLoader.show(false);
		this.meta.update({
			title: 'Get in touch',
		})
	}
	
	async onSubmit(): Promise<void> {
		console.log(this.form.value);
		const {
			firstName,
			lastName,
			email,
			phone,
			message
		} = this.form.value;

		if (
			!firstName ||
			!lastName ||
			!email ||
			!message
		) return;

		try {
			const res = await this.sendEmailService.send({
				firstName,
				lastName,
				email,
				phone,
				message
			});
			console.log(res);
		} catch (err) {
			console.error(err);
		}
	}

}
