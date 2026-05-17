import { startOfMonth, startOfWeek } from "../dates";
import type { DayId, MarkerOptions, PeriodItem, WeekNoteLookup } from "../types";

export function weekMarkerId(weekStart: DayId): string {
	return `week-marker-${weekStart}`;
}

export function weekPeriodId(weekStart: DayId): string {
	return `week-${weekStart}`;
}

export function monthMarkerId(monthStart: DayId): string {
	return `month-marker-${monthStart}`;
}

export interface StreamInsertOptions extends MarkerOptions {
	weeklyNotesEnabled: boolean;
	weekLookup: WeekNoteLookup;
}

export function insertMarkers(
	days: PeriodItem[],
	options: StreamInsertOptions,
): PeriodItem[] {
	const result: PeriodItem[] = [];
	let lastWeekStart: DayId | null = null;
	let lastMonthStart: DayId | null = null;

	for (const day of days) {
		if (day.kind !== "day") {
			result.push(day);
			continue;
		}

		if (options.showMonthMarkers) {
			const monthStart = startOfMonth(day.date);
			if (monthStart !== lastMonthStart) {
				result.push({
					kind: "month-marker",
					date: monthStart,
					id: monthMarkerId(monthStart),
				});
				lastMonthStart = monthStart;
			}
		}

		const weekStart = startOfWeek(day.date, options.weekStartsOn);
		if (weekStart !== lastWeekStart) {
			if (options.weeklyNotesEnabled) {
				const note = options.weekLookup(weekStart);
				result.push({
					kind: "week",
					date: weekStart,
					note,
					id: weekPeriodId(weekStart),
				});
			} else if (options.showWeekMarkers) {
				result.push({
					kind: "week-marker",
					date: weekStart,
					id: weekMarkerId(weekStart),
				});
			}
			lastWeekStart = weekStart;
		}

		result.push(day);
	}

	return result;
}
