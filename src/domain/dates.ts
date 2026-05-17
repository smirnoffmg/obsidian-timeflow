import type { DayId } from "./types";

const DAY_MS = 86_400_000;

export function parseDayId(id: DayId): Date {
	const [yRaw, mRaw, dRaw] = id.split("-").map(Number);
	const y = yRaw ?? 1970;
	const m = mRaw ?? 1;
	const d = dRaw ?? 1;
	return new Date(Date.UTC(y, m - 1, d));
}

export function formatDayId(date: Date): DayId {
	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, "0");
	const d = String(date.getUTCDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function addDays(id: DayId, days: number): DayId {
	const date = parseDayId(id);
	date.setUTCDate(date.getUTCDate() + days);
	return formatDayId(date);
}

export function compareDays(a: DayId, b: DayId): number {
	return parseDayId(a).getTime() - parseDayId(b).getTime();
}

export function eachDayInclusive(start: DayId, end: DayId): DayId[] {
	if (compareDays(start, end) > 0) {
		return [];
	}
	const days: DayId[] = [];
	let current = start;
	while (compareDays(current, end) <= 0) {
		days.push(current);
		if (current === end) {
			break;
		}
		current = addDays(current, 1);
	}
	return days;
}

export function startOfWeek(day: DayId, weekStartsOn: number): DayId {
	const date = parseDayId(day);
	const dow = date.getUTCDay();
	const diff = (dow - weekStartsOn + 7) % 7;
	date.setUTCDate(date.getUTCDate() - diff);
	return formatDayId(date);
}

export function startOfMonth(day: DayId): DayId {
	const date = parseDayId(day);
	date.setUTCDate(1);
	return formatDayId(date);
}

export function isoWeekNumber(day: DayId): number {
	const date = parseDayId(day);
	const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	const dayNum = target.getUTCDay() || 7;
	target.setUTCDate(target.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
	return Math.ceil(((target.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
}

export function dayIdFromDateLocal(date: Date): DayId {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}
