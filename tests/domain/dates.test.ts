import { describe, expect, it } from "vitest";
import {
	addDays,
	compareDays,
	dayIdFromDateLocal,
	eachDayInclusive,
	formatDayId,
	isoWeekNumber,
	parseDayId,
	startOfMonth,
	startOfWeek,
} from "../../src/domain/dates";

describe("parseDayId / formatDayId", () => {
	it("round-trips a standard date", () => {
		expect(formatDayId(parseDayId("2026-05-15"))).toBe("2026-05-15");
	});

	it("round-trips month and day boundaries", () => {
		expect(formatDayId(parseDayId("2026-01-01"))).toBe("2026-01-01");
		expect(formatDayId(parseDayId("2026-12-31"))).toBe("2026-12-31");
	});

	it("parseDayId returns UTC midnight", () => {
		const date = parseDayId("2026-05-15");
		expect(date.getUTCFullYear()).toBe(2026);
		expect(date.getUTCMonth()).toBe(4); // 0-indexed
		expect(date.getUTCDate()).toBe(15);
		expect(date.getUTCHours()).toBe(0);
	});
});

describe("addDays", () => {
	it("adds positive days", () => {
		expect(addDays("2026-05-15", 10)).toBe("2026-05-25");
	});

	it("adds negative days", () => {
		expect(addDays("2026-05-15", -15)).toBe("2026-04-30");
	});

	it("crosses month boundary", () => {
		expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
	});

	it("crosses year boundary", () => {
		expect(addDays("2025-12-31", 1)).toBe("2026-01-01");
	});
});

describe("compareDays", () => {
	it("returns negative when a < b", () => {
		expect(compareDays("2026-05-01", "2026-05-15")).toBeLessThan(0);
	});

	it("returns zero when equal", () => {
		expect(compareDays("2026-05-15", "2026-05-15")).toBe(0);
	});

	it("returns positive when a > b", () => {
		expect(compareDays("2026-05-15", "2026-05-01")).toBeGreaterThan(0);
	});
});

describe("eachDayInclusive", () => {
	it("returns all days in range inclusive", () => {
		expect(eachDayInclusive("2026-05-01", "2026-05-03")).toEqual([
			"2026-05-01",
			"2026-05-02",
			"2026-05-03",
		]);
	});

	it("returns single day when start equals end", () => {
		expect(eachDayInclusive("2026-05-15", "2026-05-15")).toEqual(["2026-05-15"]);
	});

	it("returns empty array when start is after end", () => {
		expect(eachDayInclusive("2026-05-15", "2026-05-01")).toEqual([]);
	});
});

describe("startOfWeek", () => {
	it("returns Monday for a mid-week day (weekStartsOn=1)", () => {
		// 2026-05-15 is a Friday
		expect(startOfWeek("2026-05-15", 1)).toBe("2026-05-11");
	});

	it("returns Sunday for a mid-week day (weekStartsOn=0)", () => {
		// 2026-05-15 is a Friday → previous Sunday is 2026-05-10
		expect(startOfWeek("2026-05-15", 0)).toBe("2026-05-10");
	});

	it("returns the day itself when it is the week start", () => {
		// 2026-05-11 is a Monday
		expect(startOfWeek("2026-05-11", 1)).toBe("2026-05-11");
	});
});

describe("startOfMonth", () => {
	it("returns first day of the month for a mid-month date", () => {
		expect(startOfMonth("2026-05-15")).toBe("2026-05-01");
	});

	it("returns the same day when already the first", () => {
		expect(startOfMonth("2026-05-01")).toBe("2026-05-01");
	});

	it("handles end of month", () => {
		expect(startOfMonth("2026-05-31")).toBe("2026-05-01");
	});
});

describe("isoWeekNumber", () => {
	it("returns W20 for 2026-05-15", () => {
		expect(isoWeekNumber("2026-05-15")).toBe(20);
	});

	it("returns W1 for the first ISO week of the year", () => {
		// 2026-01-01 is a Thursday → ISO week 1
		expect(isoWeekNumber("2026-01-01")).toBe(1);
	});

	it("returns W53 for last ISO week that belongs to prior year", () => {
		// 2015-12-31 is a Thursday → ISO week 53 of 2015
		expect(isoWeekNumber("2015-12-31")).toBe(53);
	});
});

describe("dayIdFromDateLocal", () => {
	it("returns a valid YYYY-MM-DD string", () => {
		const result = dayIdFromDateLocal(new Date(2026, 4, 15)); // May 15 local
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(result).toBe("2026-05-15");
	});
});
