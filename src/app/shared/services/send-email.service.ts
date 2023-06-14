import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

	constructor(
		private functions: Functions
	) { }
	
	async send(form: {
		firstName: string;
		lastName: string;
		email: string;
		phone?: string;
		message: string;
	}): Promise<any> {
		const fn = httpsCallable<{
			firstName: string;
			lastName: string;
			email: string;
			phone?: string;
			message: string;
		}>(this.functions, 'emailContactForm');
		return fn(form);
	}
}
