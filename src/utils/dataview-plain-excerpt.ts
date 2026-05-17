import type { App } from "obsidian";
import { markdownToPlainText, truncatePlainText } from "./markdown-to-plain";

const DATAVIEW_FENCE = /```dataview\s*\n([\s\S]*?)```/gi;
const DATAVIEWJS_FENCE = /```dataviewjs\s*\n[\s\S]*?```/gi;

export interface DataviewQueryApi {
	queryMarkdown(
		source: string,
		originFile?: string,
	): Promise<{ successful: boolean; value?: string }>;
}

type AppWithPlugins = App & {
	plugins: { plugins: Record<string, { api?: DataviewQueryApi } | undefined> };
};

export function getDataviewApi(app: App): DataviewQueryApi | undefined {
	const plugin = (app as AppWithPlugins).plugins.plugins.dataview;
	return plugin?.api;
}

export function extractDataviewQueries(content: string): string[] {
	const queries: string[] = [];
	let match: RegExpExecArray | null;
	const re = new RegExp(DATAVIEW_FENCE.source, "gi");
	while ((match = re.exec(content)) !== null) {
		const query = match[1]?.trim();
		if (query) {
			queries.push(query);
		}
	}
	return queries;
}

export function noteBodyWithoutDataviewFences(content: string): string {
	return content.replace(DATAVIEW_FENCE, " ").replace(DATAVIEWJS_FENCE, " ");
}

export async function plainExcerptFromDataviewQuery(
	api: DataviewQueryApi,
	query: string,
	originFile: string,
	maxChars: number,
): Promise<string | null> {
	try {
		const result = await api.queryMarkdown(query, originFile);
		if (!result.successful || !result.value?.trim()) {
			return null;
		}
		const plain = markdownToPlainText(result.value);
		if (!plain) {
			return null;
		}
		return truncatePlainText(plain, maxChars);
	} catch {
		return null;
	}
}
