import { describe, expect, it } from "vitest";
import { clampSetting } from "../src/timeflow-settings";

describe("clampSetting", () => {
	it("clamps within range", () => {
		expect(clampSetting(500, 7, 365, 90)).toBe(365);
	});

	it("returns fallback for non-finite", () => {
		expect(clampSetting(Number.NaN, 7, 365, 90)).toBe(90);
	});
});
