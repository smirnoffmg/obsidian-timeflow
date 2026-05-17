import { describe, expect, it } from "vitest";
import { insertMarkers } from "../../../src/domain/timeline/marker-inserter";
import type { PeriodItem } from "../../../src/domain/types";

function day(date: string, note?: { path: string }): PeriodItem {
	return { kind: "day", date, note, id: `day-${date}` };
}

describe("insertMarkers", () => {
	it("inserts month marker before first day of month", () => {
		const days = [day("2026-05-01"), day("2026-05-02")];
		const result = insertMarkers(days, {
			showWeekMarkers: false,
			showMonthMarkers: true,
			weekStartsOn: 1,
		});
		expect(result[0]?.kind).toBe("month-marker");
		expect(result[1]?.kind).toBe("day");
	});

	it("inserts week marker at week boundary", () => {
		const days = [day("2026-05-11"), day("2026-05-12")];
		const result = insertMarkers(days, {
			showWeekMarkers: true,
			showMonthMarkers: false,
			weekStartsOn: 1,
		});
		const weekMarkers = result.filter((i) => i.kind === "week-marker");
		expect(weekMarkers.length).toBeGreaterThanOrEqual(1);
	});

	it("skips markers when disabled", () => {
		const days = [day("2026-05-01"), day("2026-06-01")];
		const result = insertMarkers(days, {
			showWeekMarkers: false,
			showMonthMarkers: false,
			weekStartsOn: 1,
		});
		expect(result.every((i) => i.kind === "day")).toBe(true);
	});

	it("does not duplicate month markers within same month", () => {
		const days = [day("2026-05-01"), day("2026-05-15"), day("2026-05-30")];
		const result = insertMarkers(days, {
			showWeekMarkers: false,
			showMonthMarkers: true,
			weekStartsOn: 1,
		});
		const monthMarkers = result.filter((i) => i.kind === "month-marker");
		expect(monthMarkers).toHaveLength(1);
	});
});
