import * as admin from 'firebase-admin';
import { error, warn } from 'firebase-functions/logger';
import { onDocumentUpdated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from 'firebase-functions/v2/options';
import * as nodemailer from 'nodemailer';
import { updateRoutes } from './courseRoutes';
import { getMessageReceivedEmail } from './email/message-received';
import Mail = require('nodemailer/lib/mailer');
import SMTPTransport = require('nodemailer/lib/smtp-transport');

const app = admin.initializeApp();
export const db = app.firestore();


setGlobalOptions({
	region: 'europe-west2',
	concurrency: 10,
	memory: '256MiB',
});


export const updateCourseRoutes = onDocumentUpdated('courses/{docId}', async () => {
	try {
		await updateRoutes();
	} catch (err) {
		error(err);
	}
});

export const writeCourseRoutes = onDocumentWritten('courses/{docId}', async () => {
	try {
		await updateRoutes();
	} catch (err) {
		error(err);
	}
})


export const emailContactForm = onCall<{
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	message: string;
}, Promise<boolean>>({ region: 'europe-west2', cors: true }, async ({ data }) => {

	const email = process.env.EMAIL_USER;
	const pssw = process.env.EMAIL_PSSW;

	if (!email || !pssw || !data.email) throw new Error('Email or Password are undefined for transporter.');

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: email,
			pass: pssw
		}
	});

	const notifyOptions: Mail.Options = {
		from: 'no-reply@lungabros.it',
		to: 'info@lungabros.it',
		subject: `[LUNGABROS.IT] 💬 Nuovo messaggio da ${data.firstName} ${data.lastName}`,
		text: `Nuovo messaggio dal sito web https://lungabros.it da parte di ${data.firstName} ${data.lastName}\n\n"""\n${data.message.trim()}\n"""\n\nInformazioni del contatto:\nNome e Cognome: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nTelefono: ${data.phone}`,
	};

	const userOptions: Mail.Options = {
		from: 'no-reply@lungabros.it',
		to: data.email,
		replyTo: 'info@lungabros.it',
		subject: `[LUNGABROS.IT] 💬 Abbiamo ricevuto il tuo messaggio!`,
		html: getMessageReceivedEmail(data.firstName)
	};

	try {
		const sendEmailNotification = await new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
			transporter.sendMail(notifyOptions, (err, info) => {
				if (err) {
					reject(err);
				} else {
					resolve(info);
				}
			});
		});
		warn('Email notification sent: ' + sendEmailNotification.response);
		
		const sendEmailToUser = await new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
			transporter.sendMail(userOptions, (err, info) => {
				if (err) {
					reject(err);
				} else {
					resolve(info);
				}
			});
		});
		warn('Email to user sent: ' + sendEmailToUser.response);
		
		return true;
	} catch (err) {
		error(err);
		throw err;
	}
})