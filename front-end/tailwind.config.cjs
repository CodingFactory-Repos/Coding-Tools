/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./node_modules/flowbite/**/*.js',
		'./public/**/*.html',
		'./src/**/*.{js,jsx,ts,tsx,vue}',
		'./src/**/*.html',
	],
	theme: {
		extend: {
			colors: {
				'darker-primary': "#18181E",
				'dark-primary': "#1f2028",
				'dark-secondary': "#21222b",
				'dark-tertiary': "#2c2e3a",
				'dark-highlight': "#434556",
				'light-primary': "white",
				'light-secondary': "#f3f4f6",
				'light-tertiary': "#e5e7eb",
				'dark-icon': "#5c5f73",
				'light-icon': "#5c5f73",
				'lighter-icon': "#9ea1b9",
				'white-icon': 'white',
				'selected-icon': "#246eaf",
				'dark-font': '#9ca3af',
				'light-font': '#d1d5db'
			},
		},
	},
	plugins: [require('flowbite/plugin')],
};
