// Global express.js configuration
export const config = {
	api: {
		base: import.meta.env.API_BASE_URL,
		credentials: JSON.parse(import.meta.env.CREDENTIALS),
	},
};