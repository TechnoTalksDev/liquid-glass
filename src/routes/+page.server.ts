import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch }) => {
	// Fetch Spotify data from n8n webhook with basic auth
	const username = env.N8N_USERNAME;
	const password = env.N8N_PASSWORD;

	let music = {};

	if (username && password) {
		// Create credentials string and encode it properly for basic auth
		const credentialsString = `${username}:${password}`;
		// Use Buffer for proper encoding in Node.js server environment
		const credentials = Buffer.from(credentialsString, 'utf8').toString('base64');

		//console.log('Username:', username);
		//console.log('Password length:', password.length);

		try {
			let res = await fetch(
				'https://n8n.technotalks.net/webhook/4505915a-04b5-4b66-84a2-19038946357d',
				{
					headers: {
						Authorization: `Basic ${credentials}`,
						'Content-Type': 'application/json'
					}
				}
			);

			console.log('Attempting to fetch from n8n webhook...');

			if (res.ok) {
				console.log('Successfully fetched music data from n8n');
				try {
					music = await res.json();
				} catch (jsonError) {
					console.error('Error parsing JSON response:', jsonError);
					console.error('Response was not valid JSON');
					// Fallback to default music data
					music = { name: null };
				}
			} else {
				console.error(`n8n webhook error: ${res.status} ${res.statusText}`);
				// Don't try to parse error responses as JSON - they might be HTML
				try {
					const errorText = await res.text();
					console.error('Error response:', errorText);
				} catch (textError) {
					console.error('Could not read error response text:', textError);
				}
				// Fallback to default music data
				music = { name: null };
			}
		} catch (error) {
			console.error('Error fetching music data:', error);
			// Fallback to default music data
			music = { name: null };
		}
	} else {
		console.error('N8N credentials not found in environment variables');
		music = { name: null };
	}

	return { music };
};
