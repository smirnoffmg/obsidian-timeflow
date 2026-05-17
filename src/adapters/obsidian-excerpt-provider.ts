import { TFile, type App } from "obsidian";
import type { IExcerptProvider } from "../ports/excerpt-provider";

export class ObsidianExcerptProvider implements IExcerptProvider {
	constructor(private readonly app: App) {}

	async getExcerpt(path: string, maxChars: number): Promise<string> {
		const file = this.app.vault.getAbstractFileByPath(path);
		if (!(file instanceof TFile)) {
			return "";
		}
		// Read from disk so post-create template/plugin edits are reflected on vault modify.
		const content = await this.app.vault.read(file);
		const plain = content
			.replace(/^---[\s\S]*?---\n/m, "")
			.replace(/[#>*`[\]]/g, "")
			.replace(/\n+/g, " ")
			.trim();
		if (plain.length <= maxChars) {
			return plain;
		}
		return `${plain.slice(0, maxChars).trim()}…`;
	}
}
