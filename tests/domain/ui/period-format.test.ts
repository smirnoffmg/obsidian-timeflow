import { describe, expect, it } from "vitest";
import { isCurrentPeriod } from "../../../src/ui/period-format";

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
});
