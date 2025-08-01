import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { sveltrisVitePlugins } from 'sveltris';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), react(), ...sveltrisVitePlugins()]
});
