/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./node_modules/flowbite/**/*.js'],
	theme: {
		extend: {
			colors: {
				'dark-primary': "#1f2028",
				'dark-secondary': "#21222b",
				'dark-tertiary': "#2c2e3a",
				'dark-highlight': "#434556",
				'light-primary': "white",
				'light-secondary': "#f3f4f6",
				'light-tertiary': "#e5e7eb",
				'dark-icon': "white",
				'light-icon': "black",
				'selected-icon': "blue",
			},
		},
	},
	plugins: [require('flowbite/plugin')],
	purge: ['./src/**/*.html', './src/**/*.vue'],
};
