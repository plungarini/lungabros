import { error } from 'firebase-functions/logger';
import { onDocumentUpdated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { updateRoutes } from './courseRoutes';

export const updateCourseRoutes = onDocumentUpdated('courses', async () => {
	try {
		await updateRoutes();
	} catch (err) {
		error(err);
	}
})

export const writeCourseRoutes = onDocumentWritten('courses', async () => {
	try {
		await updateRoutes();
	} catch (err) {
		error(err);
	}
})

