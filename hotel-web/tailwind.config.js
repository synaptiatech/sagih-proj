const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	variants: {
		borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
	},
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', ...defaultTheme.fontFamily.sans],
			},
			transformOrigin: {
				0: '0%',
			},
			zIndex: {
				'-1': '-1',
			},
			padding: {
				drawer: '1rem 1rem 1rem calc(var(--drawer-width) + 1rem)',
			},
			width: {
				drawer: 'var(--drawer-width)',
			},
		},
	},
	plugins: [],
};
