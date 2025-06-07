import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],

	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@app": resolve(__dirname, "src/app"),
			"@assets": resolve(__dirname, "src/assets"),
			"@components": resolve(__dirname, "src/components"),
			"@utils": resolve(__dirname, "src/utils"),
		},
	},
});
