import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallableFromURL } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

	private functions = inject(Functions);

	constructor() { }
	
	send(form: {
		firstName: string;
		lastName: string;
		email: string;
		phone?: string;
		message: string;
	}): Promise<any> {
		const fnUrl = 'https://emailcontactform-pr6c6pbisa-nw.a.run.app';
		const fn = httpsCallableFromURL<{
			firstName: string;
			lastName: string;
			email: string;
			phone?: string;
			message: string;
		}>(this.functions, fnUrl, { timeout: 60 * 1000 })
		return fn(form);
	}
}
