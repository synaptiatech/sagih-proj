import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
	return {
		plugins: [react()],
		build: {
			outDir: 'build',
		},
		define: {
			'process.env': {},
		},
		server: {
			watch: {
				usePolling: true,
			},
			host: true,
			strictPort: true,
			port: 4173,
		},
	};
});
