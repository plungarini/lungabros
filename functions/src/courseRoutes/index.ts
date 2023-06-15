import axios from 'axios';
import { warn } from 'firebase-functions/logger';
import { db } from '..';

const owner = 'plungarini';
const repo = 'lungabros';
const path = 'routes.txt';
const token = process.env.GITHUB_TOKEN;

export const updateRoutes = async () => {
  const col = await db.collection('courses').get();
  const docs = col.docs;
  const routes = new Set<string>();

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    if (!doc || !doc.id) return;
    routes.add(`/courses/info/${doc.id}`);
  }

  let fileContent = [...routes].join('\n');

  warn(`Found ${docs.length} routes`, fileContent);

  const requestUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // Get current file information
    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const currentFile = response.data;
    const sha = currentFile.sha;

    // Update file with new content and sha
    const requestBody = {
      message: '[FIRESTORE EVENT] Update routes file',
      content: Buffer.from(fileContent).toString('base64'),
      sha: sha,
    };

    await axios.put(requestUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    warn('Routes updated successfully');
  } catch (err) {
    const message = (err as any)?.response?.data?.message;
    throw message ? new Error(message) : err;
  }
};