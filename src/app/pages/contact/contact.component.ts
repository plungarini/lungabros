import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
		email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
		phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
	});

	sending = false;
	sent = false;
	error = false;
	

	constructor(
		private sendEmailService: SendEmailService,
		private pageLoader: PageLoaderService,
		private meta: PersonalMetaTagsService,
		private cdRef: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.pageLoader.show(false);
		this.meta.update({
			title: 'Get in touch',
			description: 'Sei pronto a tuffarti in avventure subacquee incredibili? Scrivici per prenotare un corso di immersioni, fare domande strampalate o anche solo per farti dire quanto amiamo i polpi che ci salutano durante le immersioni!',
		})
	}
	
	async onSubmit(): Promise<void> {
		if (this.form.invalid) return;

		this.setFormStatus('sending');

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

			this.form.reset();
			this.setFormStatus('success');

			setTimeout(() => {
				this.setFormStatus('reset');
			}, 5000);
		} catch (err) {
			this.setFormStatus('error');
		
			console.error(err);

			setTimeout(() => {
				this.setFormStatus('reset');
			}, 5000);
		}
	}

	private setFormStatus(status: 'error' | 'success' | 'sending' | 'reset'): void {
		if (status === 'reset') {
			this.error = false;
			this.sent = false;
			this.sending = false;
			this.cdRef.detectChanges();
			return;
		}

		this.error = status === 'error';
		this.sent = status === 'success';
		this.sending = status === 'sending';

		this.cdRef.detectChanges();
	}

}
