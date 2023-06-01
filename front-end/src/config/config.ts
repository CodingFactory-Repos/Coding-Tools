export const config = {
	api: {
		base: import.meta.env.VITE_API_BASE_URL,
		credentials: JSON.parse(import.meta.env.VITE_CREDENTIALS),
	},
	prodSiteUrl: import.meta.env.VITE_PROD_SITE_URL,
};
