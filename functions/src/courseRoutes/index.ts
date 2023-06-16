import axios from 'axios';
import { warn } from 'firebase-functions/logger';
import { db } from '..';

const owner = 'plungarini';
const repo = 'lungabros';
const routesFilePath = 'routes.txt';
const sitemapPath = 'src/assets/sitemap.xml';
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

  const requestUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${routesFilePath}`;

  try {
    // Get current file information
    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const currentFile = response.data;
		const sha = currentFile.sha;
		const currentContent = Buffer.from(currentFile.content, 'base64').toString();
		
		if (currentContent === fileContent) {
      warn('The content is already up to date. Skipping the update.');
      return;
		}
		
		warn('Content is different, updating file on GitHub...');

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

		warn('Routes updated successfully, updating sitemap...');
		await updateSitemap([...routes]);
  } catch (err) {
    const message = (err as any)?.response?.data?.message;
    throw message ? new Error(message) : err;
  }
};

const defaultRoutes = [
	{ url: 'https://lungabros.it/', priority: 0 },
	{ url: 'https://lungabros.it/contact', priority: 0 },
	{ url: 'https://lungabros.it/articles/importanza-della-sicurezza', priority: 0 },
	{ url: 'https://lungabros.it/articles/torchbearers', priority: 0 },
	{ url: 'https://lungabros.it/about', priority: 0 },
	{ url: 'https://lungabros.it/about/pietro-lungarini', priority: 0 },
	{ url: 'https://lungabros.it/about/samuele-lungarini', priority: 0 },
];

const updateSitemap = async (coursesRoutes: Array<string>) => {
	const newSitemapRoutes = [
		...defaultRoutes,
		...coursesRoutes
			.map((r) => ({ url: `https://lungabros.it/${r}`, priority: 0.7 }))
	];

	let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
	newSitemapRoutes.forEach(({ url, priority }) => {
		sitemapXml += `\t<url>\n`;
		sitemapXml += `\t\t<loc>${url}</loc>\n`;
		sitemapXml += `\t\t<priority>${priority}</priority>\n`;
		sitemapXml += `\t\t<changefreq>weekly</changefreq>\n`;
		sitemapXml += `\t</url>\n`;
	});

	sitemapXml += `</urlset>`;
	
	warn('Generated sitemapXml => ', sitemapXml);

  const requestUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${sitemapPath}`;

	try {
		// Get current file information
		const response = await axios.get(requestUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const currentFile = response.data;
		const sha = currentFile.sha;
		const currentContent = Buffer.from(currentFile.content, 'base64').toString();
		
		if (currentContent === sitemapXml) {
			warn('The content is already up to date. Skipping the update.');
			return;
		}
		
		warn('Content is different, updating file on GitHub...');

		// Update file with new content and sha
		const requestBody = {
			message: '[FIRESTORE EVENT] Update sitemap file',
			content: Buffer.from(sitemapXml).toString('base64'),
			sha: sha,
		};

		await axios.put(requestUrl, requestBody, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		warn('Sitemap updated successfully');
	} catch (err) {
		const message = (err as any)?.response?.data?.message;
    throw message ? new Error(message) : err;
	}
}