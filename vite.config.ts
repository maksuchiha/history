import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	base: './',
	server: {
		port: 3000,
		open: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@styles': path.resolve(__dirname, './src/styles/'),
			'@features': path.resolve(__dirname, './src/features/'),
			'@components': path.resolve(__dirname, './src/components/'),
			'@store': path.resolve(__dirname, './src/store/'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
		},
	},
	build: {
		sourcemap: false,
		minify: 'esbuild',
		outDir: 'dist',
		target: 'esnext',
	},
});
