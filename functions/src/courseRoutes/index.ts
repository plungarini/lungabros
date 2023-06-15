import axios from 'axios';
import { warn } from 'firebase-functions/logger';

const owner = 'plungarini';
const repo = 'lungabros';
const path = 'routes.txt';
const token = process.env.GITHUB_TOKEN;


export const updateRoutes = async () => {
	let fileContent = ''; // TODO
	const requestUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

	const requestBody = {
		message: '[FIRESTORE EVENT] Update routes file',
		content: Buffer.from(fileContent).toString('base64'),
	};

	const requestOptions = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};

	try {
		await axios.put(requestUrl, requestBody, requestOptions);
		warn('Routes updated successfully');
	} catch (err) {
		const message = (err as any)?.response?.data?.message;
		throw message ? new Error(message) : err;
	}
}
