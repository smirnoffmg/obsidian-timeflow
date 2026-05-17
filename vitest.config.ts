import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const mockObsidian = fileURLToPath(new URL("./tests/__mocks__/obsidian.ts", import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			obsidian: mockObsidian,
		},
	},
	test: {
		include: ["tests/**/*.test.ts"],
		coverage: {
			provider: "v8",
			include: ["src/domain/**", "src/presenters/**"],
		},
	},
});
