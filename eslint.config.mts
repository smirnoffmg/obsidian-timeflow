import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: ["eslint.config.js", "manifest.json"],
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: [".json"],
			},
		},
	},
	...obsidianmd.configs.recommended,
	{
		files: ["src/domain/**/*.ts"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{ regex: "obsidian$", message: "domain/ must not import from Obsidian." },
						{
							regex: "obsidian-daily-notes-interface",
							message: "domain/ must not import from Obsidian.",
						},
					],
				},
			],
		},
	},
	globalIgnores([
		"node_modules",
		"dist",
		"~",
		"vitest.config.ts",
		"esbuild.config.mjs",
		"eslint.config.js",
		"version-bump.mjs",
		"versions.json",
		"main.js",
	]),
);
