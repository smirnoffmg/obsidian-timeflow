import { addDays, isoWeekNumber, parseDayId, startOfWeek } from "../domain/dates";
import type { DayId, PeriodItem } from "../domain/types";

export function formatDayHeading(date: DayId): string {
	const d = parseDayId(date);
	return d.toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	});
}

export function formatWeekHeading(weekStart: DayId): string {
	const start = parseDayId(weekStart);
	const end = parseDayId(addDays(weekStart, 6));
	const week = isoWeekNumber(weekStart);
	const range = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}–${end.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`;
	return `Week ${week} · ${range}`;
}

export function formatPeriodHeading(item: PeriodItem): string {
	return item.kind === "week" ? formatWeekHeading(item.date) : formatDayHeading(item.date);
}

export function isCurrentPeriod(
	item: PeriodItem,
	today: DayId,
	weekStartsOn: number,
): boolean {
	if (item.kind === "week") {
		return startOfWeek(today, weekStartsOn) === item.date;
	}
	return item.date === today;
}
