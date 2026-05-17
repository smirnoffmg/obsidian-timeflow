import { describe, expect, it } from "vitest";
import {
	extractDataviewQueries,
	noteBodyWithoutDataviewFences,
} from "../../src/utils/dataview-plain-excerpt";
import { markdownToPlainText } from "../../src/utils/markdown-to-plain";

describe("dataview plain excerpt helpers", () => {
	it("extracts dataview query bodies", () => {
		const content = `# Day

\`\`\`dataview
TABLE file.name
FROM "daily"
\`\`\`

Notes below.`;
		expect(extractDataviewQueries(content)).toEqual(['TABLE file.name\nFROM "daily"']);
	});

	it("removes dataview fences from body fallback", () => {
		const content = `Intro

\`\`\`dataview
TABLE x
\`\`\`

Outro`;
		const body = noteBodyWithoutDataviewFences(content);
		expect(markdownToPlainText(body)).toBe("Intro Outro");
	});
});
