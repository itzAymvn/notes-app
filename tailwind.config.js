/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			backgroundColor: {
				accent: "#fe8769",
			},

			textColor: {
				accent: "#fe8769",
			},

			colors: {
				accent: "#fe8769",
			},

			borderColor: {
				accent: "#fe8769",
			},
		},
	},
	plugins: [],
}
