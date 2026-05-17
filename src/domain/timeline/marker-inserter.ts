import { startOfMonth, startOfWeek } from "../dates";
import type { DayId, MarkerOptions, PeriodItem } from "../types";

export function weekMarkerId(weekStart: DayId): string {
	return `week-marker-${weekStart}`;
}

export function monthMarkerId(monthStart: DayId): string {
	return `month-marker-${monthStart}`;
}

export function insertMarkers(
	days: PeriodItem[],
	options: MarkerOptions,
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

		if (options.showWeekMarkers) {
			const weekStart = startOfWeek(day.date, options.weekStartsOn);
			if (weekStart !== lastWeekStart) {
				result.push({
					kind: "week-marker",
					date: weekStart,
					id: weekMarkerId(weekStart),
				});
				lastWeekStart = weekStart;
			}
		}

		result.push(day);
	}

	return result;
}
