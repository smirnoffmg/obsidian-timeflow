import { describe, expect, it } from "vitest";
import {
	insertMarkers,
	monthPeriodId,
	weekPeriodId,
} from "../../../src/domain/timeline/marker-inserter";
import type { PeriodItem } from "../../../src/domain/types";

function day(date: string, note?: { path: string }): PeriodItem {
	return { kind: "day", date, note, id: `day-${date}` };
}

const noWeekLookup = () => undefined;
const noMonthLookup = () => undefined;

const baseOptions = {
	showWeekMarkers: false,
	showMonthMarkers: true,
	weekStartsOn: 1,
	weeklyNotesEnabled: false,
	weekLookup: noWeekLookup,
	monthlyNotesEnabled: false,
	monthLookup: noMonthLookup,
};

describe("insertMarkers", () => {
	it("inserts month marker before first day of month", () => {
		const days = [day("2026-05-01"), day("2026-05-02")];
		const result = insertMarkers(days, baseOptions);
		expect(result[0]?.kind).toBe("month-marker");
		expect(result[1]?.kind).toBe("day");
	});

	it("inserts month period card when monthly notes enabled", () => {
		const days = [day("2026-05-01"), day("2026-05-02")];
		const result = insertMarkers(days, {
			...baseOptions,
			monthlyNotesEnabled: true,
			monthLookup: (monthStart) =>
				monthStart === "2026-05-01" ? { path: "monthly/2026-05.md" } : undefined,
		});
		const month = result.find((i) => i.kind === "month");
		expect(month).toBeDefined();
		expect(month?.id).toBe(monthPeriodId("2026-05-01"));
		expect(month?.note?.path).toBe("monthly/2026-05.md");
		expect(result.some((i) => i.kind === "month-marker")).toBe(false);
	});

	it("inserts week marker when weekly notes disabled", () => {
		const days = [day("2026-05-11"), day("2026-05-12")];
		const result = insertMarkers(days, {
			...baseOptions,
			showMonthMarkers: false,
			showWeekMarkers: true,
		});
		expect(result.some((i) => i.kind === "week-marker")).toBe(true);
		expect(result.some((i) => i.kind === "week")).toBe(false);
	});

	it("inserts week period card when weekly notes enabled", () => {
		const days = [day("2026-05-11"), day("2026-05-12")];
		const result = insertMarkers(days, {
			...baseOptions,
			showMonthMarkers: false,
			showWeekMarkers: true,
			weeklyNotesEnabled: true,
			weekLookup: (weekStart) =>
				weekStart === "2026-05-11" ? { path: "weekly/2026-05-11.md" } : undefined,
		});
		const week = result.find((i) => i.kind === "week");
		expect(week).toBeDefined();
		expect(week?.id).toBe(weekPeriodId("2026-05-11"));
		expect(week?.note?.path).toBe("weekly/2026-05-11.md");
		expect(result.some((i) => i.kind === "week-marker")).toBe(false);
	});

	it("skips markers when disabled", () => {
		const days = [day("2026-05-01"), day("2026-06-01")];
		const result = insertMarkers(days, {
			...baseOptions,
			showMonthMarkers: false,
		});
		expect(result.every((i) => i.kind === "day")).toBe(true);
	});

	it("does not duplicate month markers within same month", () => {
		const days = [day("2026-05-01"), day("2026-05-15"), day("2026-05-30")];
		const result = insertMarkers(days, baseOptions);
		const monthMarkers = result.filter((i) => i.kind === "month-marker");
		expect(monthMarkers).toHaveLength(1);
	});
});
