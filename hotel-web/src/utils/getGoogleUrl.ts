export const getGoogleUrl = (from: string) => {
	const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
	const params = {
		client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
		redirect_uri: `${import.meta.env.VITE_BASE_URL}${
			import.meta.env.VITE_GOOGLE_REDIRECT
		}`,
		access_type: 'offline',
		response_type: 'code',
		prompt: 'consent',
		scope: ['email profile'].join(' '),
		state: from,
	};
	const qs = new URLSearchParams(params);
	return `${rootUrl}?${qs.toString()}`;
};
