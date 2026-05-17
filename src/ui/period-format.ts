import { addDays, isoWeekNumber, parseDayId, startOfMonth, startOfWeek } from "../domain/dates";
import type { DayId, PeriodItem } from "../domain/types";

export type CardPeriodKind = "day" | "week" | "month";

export function cardPeriodKind(item: PeriodItem): CardPeriodKind {
	if (item.kind === "week" || item.kind === "month") {
		return item.kind;
	}
	return "day";
}

export function periodKindLabel(kind: CardPeriodKind): string {
	switch (kind) {
		case "week":
			return "Week";
		case "month":
			return "Month";
		default:
			return "Day";
	}
}

export function periodKindIcon(kind: CardPeriodKind): string {
	switch (kind) {
		case "week":
			return "calendar-range";
		case "month":
			return "calendar-days";
		default:
			return "calendar";
	}
}

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

export function formatMonthHeading(monthStart: DayId): string {
	const d = parseDayId(monthStart);
	return d.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function formatPeriodHeading(item: PeriodItem): string {
	switch (item.kind) {
		case "week":
			return formatWeekHeading(item.date);
		case "month":
			return formatMonthHeading(item.date);
		default:
			return formatDayHeading(item.date);
	}
}

export function isCurrentPeriod(
	item: PeriodItem,
	today: DayId,
	weekStartsOn: number,
): boolean {
	switch (item.kind) {
		case "week":
			return startOfWeek(today, weekStartsOn) === item.date;
		case "month":
			return startOfMonth(today) === item.date;
		default:
			return item.date === today;
	}
}
