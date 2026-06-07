import { describe, expect, it } from "vitest";
import {
	buildDayItems,
	buildTimeline,
	initialWindow,
} from "../../../src/domain/timeline/timeline-builder";

describe("timeline-builder", () => {
	it("builds consecutive days inclusive", () => {
		const items = buildDayItems({ start: "2026-05-01", end: "2026-05-03" }, () => undefined);
		expect(items).toHaveLength(3);
		expect(items.map((i) => i.date)).toEqual(["2026-05-01", "2026-05-02", "2026-05-03"]);
	});

	it("attaches note when lookup returns one", () => {
		const items = buildDayItems({ start: "2026-05-01", end: "2026-05-01" }, (day) =>
			day === "2026-05-01" ? { path: "daily/2026-05-01.md" } : undefined,
		);
		expect(items[0]?.note?.path).toBe("daily/2026-05-01.md");
	});

	const baseStream = {
		showWeekMarkers: false,
		showMonthMarkers: true,
		weekStartsOn: 1,
		weeklyNotesEnabled: false,
		weekLookup: () => undefined,
		monthlyNotesEnabled: false,
		monthLookup: () => undefined,
	};

	it("buildTimeline includes markers", () => {
		const items = buildTimeline(
			{ start: "2026-05-01", end: "2026-05-02" },
			() => undefined,
			baseStream,
		);
		expect(items.some((i) => i.kind === "month-marker")).toBe(true);
		expect(items.some((i) => i.kind === "day")).toBe(true);
	});

	it("orders days newest first", () => {
		const items = buildTimeline({ start: "2026-05-01", end: "2026-05-03" }, () => undefined, {
			...baseStream,
			showMonthMarkers: false,
		});
		const days = items.filter((i) => i.kind === "day");
		expect(days.map((d) => d.date)).toEqual(["2026-05-03", "2026-05-02", "2026-05-01"]);
	});

	it("initialWindow ends at today with no future days", () => {
		const window = initialWindow("2026-05-15", 90);
		expect(window.start).toBe("2026-02-14");
		expect(window.end).toBe("2026-05-15");
	});
});
