import { TFile, type App } from "obsidian";
import type { IExcerptProvider } from "../ports/excerpt-provider";
import {
	extractDataviewQueries,
	getDataviewApi,
	noteBodyWithoutDataviewFences,
	plainExcerptFromDataviewQuery,
} from "../utils/dataview-plain-excerpt";
import { markdownToPlainText, truncatePlainText } from "../utils/markdown-to-plain";

export class ObsidianExcerptProvider implements IExcerptProvider {
	constructor(private readonly app: App) {}

	async getExcerpt(path: string, maxChars: number): Promise<string> {
		const file = this.app.vault.getAbstractFileByPath(path);
		if (!(file instanceof TFile)) {
			return "";
		}
		const content = await this.app.vault.read(file);

		const dataviewApi = getDataviewApi(this.app);
		if (dataviewApi) {
			for (const query of extractDataviewQueries(content)) {
				const fromTable = await plainExcerptFromDataviewQuery(
					dataviewApi,
					query,
					file.path,
					maxChars,
				);
				if (fromTable) {
					return fromTable;
				}
			}
		}

		const plain = markdownToPlainText(noteBodyWithoutDataviewFences(content));
		return truncatePlainText(plain, maxChars);
	}
}
