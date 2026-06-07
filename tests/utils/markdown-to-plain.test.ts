import { describe, expect, it } from "vitest";
import { markdownToPlainText, truncatePlainText } from "../../src/utils/markdown-to-plain";

describe("markdownToPlainText", () => {
	it("strips frontmatter and headings", () => {
		const input = `---
title: Test
---
# Heading

Body text.`;
		expect(markdownToPlainText(input)).toBe("Heading Body text.");
	});

	it("resolves wiki links and markdown links", () => {
		expect(
			markdownToPlainText("See [[Note]] and [[Target|Alias]] and [web](https://x.com)."),
		).toBe("See Note and Alias and web.");
	});

	it("strips callouts and blockquotes", () => {
		const input = `> [!note] Title
> quoted

Normal.`;
		expect(markdownToPlainText(input)).toBe("Normal.");
	});

	it("removes html tags", () => {
		expect(markdownToPlainText("<div>Hello</div>")).toBe("Hello");
	});

	it("strips fenced dataview blocks", () => {
		const input = `Before
\`\`\`dataview
TABLE a
FROM "x"
\`\`\`
After`;
		expect(markdownToPlainText(input)).toBe("Before After");
	});
});

describe("truncatePlainText", () => {
	it("truncates with ellipsis", () => {
		expect(truncatePlainText("abcdefghij", 5)).toBe("abcde…");
	});
});
