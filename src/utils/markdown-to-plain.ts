const FENCED_CODE_BLOCK = /```[^\n]*\n[\s\S]*?```/g;
const BASE_EMBED = /!\[\[[^\]]+\.base(?:#[^\]]*)?\]\]/gi;
const TABLE_SEPARATOR = /^\s*\|?(?:\s*:?-{3,}:?\s*\|?)+\s*$/;

function markdownTablesToPlain(text: string): string {
	const lines = text.split("\n");
	const out: string[] = [];

	for (const line of lines) {
		if (!/^\s*\|/.test(line)) {
			out.push(line);
			continue;
		}
		if (TABLE_SEPARATOR.test(line.trim())) {
			continue;
		}
		const cells = line
			.split("|")
			.map((cell) => cell.trim())
			.filter((cell) => cell.length > 0);
		if (cells.length > 0) {
			out.push(cells.join(" · "));
		}
	}

	return out.join("\n");
}

/** Strip markdown/frontmatter to plain text for card excerpts (no HTML rendering). */
export function markdownToPlainText(content: string): string {
	let text = content.replace(/^---[\s\S]*?---\n?/m, "");
	text = text.replace(FENCED_CODE_BLOCK, " ");
	text = text.replace(BASE_EMBED, "");
	text = markdownTablesToPlain(text);
	text = text.replace(/`([^`]+)`/g, "$1");
	text = text.replace(
		/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
		(_match, target: string, alias?: string) => alias ?? target,
	);
	text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
	text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
	text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
	text = text.replace(/__([^_]+)__/g, "$1");
	text = text.replace(/\*([^*]+)\*/g, "$1");
	text = text.replace(/_([^_]+)_/g, "$1");
	text = text.replace(/~~([^~]+)~~/g, "$1");
	text = text.replace(/^#{1,6}\s+/gm, "");
	text = text.replace(/^>\s?[^\n]*/gm, "");
	text = text.replace(/^\s*[-*+]\s+/gm, "");
	text = text.replace(/^\s*\d+\.\s+/gm, "");
	text = text.replace(/^-{3,}\s*$/gm, "");
	text = text.replace(/<[^>]+>/g, "");
	text = text.replace(/[#>*[\]]/g, "");
	text = text.replace(/\s+/g, " ");
	return text.trim();
}

export function truncatePlainText(text: string, maxChars: number): string {
	if (text.length <= maxChars) {
		return text;
	}
	return `${text.slice(0, maxChars).trim()}…`;
}
