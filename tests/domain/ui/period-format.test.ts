import { describe, expect, it } from "vitest";
import {
	cardPeriodKind,
	isCurrentPeriod,
	periodKindIcon,
	periodKindLabel,
} from "../../../src/ui/period-format";

describe("period kind helpers", () => {
	it("labels and icons per kind", () => {
		expect(periodKindLabel("day")).toBe("Day");
		expect(periodKindLabel("week")).toBe("Week");
		expect(periodKindLabel("month")).toBe("Month");
		expect(periodKindIcon("day")).toBe("calendar");
		expect(periodKindIcon("week")).toBe("calendar-range");
		expect(periodKindIcon("month")).toBe("calendar-days");
	});

	it("maps period items to card kinds", () => {
		expect(cardPeriodKind({ kind: "day", date: "2026-05-15", id: "d" })).toBe("day");
		expect(cardPeriodKind({ kind: "week", date: "2026-05-11", id: "w" })).toBe("week");
		expect(cardPeriodKind({ kind: "month", date: "2026-05-01", id: "m" })).toBe("month");
	});
});

describe("isCurrentPeriod", () => {
	it("marks today for daily items", () => {
		expect(
			isCurrentPeriod(
				{ kind: "day", date: "2026-05-15", id: "day-2026-05-15" },
				"2026-05-15",
				1,
			),
		).toBe(true);
	});

	it("marks current week for weekly items", () => {
		expect(
			isCurrentPeriod(
				{ kind: "week", date: "2026-05-11", id: "week-2026-05-11" },
				"2026-05-15",
				1,
			),
		).toBe(true);
	});

	it("marks current month for monthly items", () => {
		expect(
			isCurrentPeriod(
				{ kind: "month", date: "2026-05-01", id: "month-2026-05-01" },
				"2026-05-15",
				1,
			),
		).toBe(true);
	});
});
