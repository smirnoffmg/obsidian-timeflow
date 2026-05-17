import { describe, expect, it } from "vitest";
import {
	applyScrollExtension,
	clampWindowEnd,
	extendWindowPast,
	shouldExtendOlderHistory,
} from "../../../src/domain/timeline/scroll-window-policy";

describe("scroll-window-policy", () => {
	it("extends older history when near bottom", () => {
		expect(
			shouldExtendOlderHistory({
				scrollTop: 650,
				scrollHeight: 1000,
				clientHeight: 400,
			}),
		).toBe(true);
	});

	it("extendWindowPast shifts start earlier", () => {
		const next = extendWindowPast(
			{ start: "2026-05-01", end: "2026-05-31" },
			60,
		);
		expect(next.start).toBe("2026-03-02");
		expect(next.end).toBe("2026-05-31");
	});

	it("clampWindowEnd caps at today", () => {
		const next = clampWindowEnd(
			{ start: "2026-05-01", end: "2026-06-30" },
			"2026-05-15",
		);
		expect(next.end).toBe("2026-05-15");
	});

	it("applyScrollExtension loads older days near bottom only", () => {
		const original = { start: "2026-05-01", end: "2026-05-31" };
		const next = applyScrollExtension(
			original,
			{ scrollTop: 650, scrollHeight: 1000, clientHeight: 400 },
			60,
			"2026-05-31",
		);
		expect(next.start).toBe("2026-03-02");
		expect(next.end).toBe("2026-05-31");
	});

	it("applyScrollExtension does not extend near top", () => {
		const original = { start: "2026-05-01", end: "2026-05-31" };
		const next = applyScrollExtension(
			original,
			{ scrollTop: 50, scrollHeight: 1000, clientHeight: 400 },
			60,
			"2026-05-31",
		);
		expect(next).toEqual(original);
	});
});
