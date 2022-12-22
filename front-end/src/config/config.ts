// Global express.js configuration

export const config = {
	api: {
		base: import.meta.env.VITE_API_BASE_URL,
		credentials: JSON.parse(import.meta.env.VITE_CREDENTIALS),
	},
};
