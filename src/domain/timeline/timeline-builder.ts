import { addDays, compareDays, eachDayInclusive } from "../dates";
import type {
	DayId,
	MarkerOptions,
	NoteLookup,
	PeriodItem,
	TimelineWindow,
} from "../types";
import { insertMarkers } from "./marker-inserter";

export function buildDayItems(
	window: TimelineWindow,
	lookup: NoteLookup,
): PeriodItem[] {
	const days = eachDayInclusive(window.start, window.end);
	return days.map((date): PeriodItem => {
		const note = lookup(date);
		return {
			kind: "day",
			date,
			note,
			id: `day-${date}`,
		};
	});
}

export function buildTimeline(
	window: TimelineWindow,
	lookup: NoteLookup,
	markerOptions: MarkerOptions,
): PeriodItem[] {
	const dayItems = buildDayItems(window, lookup);
	const withMarkers = insertMarkers(dayItems, markerOptions);
	return reverseTimeline(withMarkers);
}

/** Newest entries first (today at top). */
export function reverseTimeline(items: PeriodItem[]): PeriodItem[] {
	return [...items].reverse();
}

export function clampWindowToToday(window: TimelineWindow, today: DayId): TimelineWindow {
	if (compareDays(window.end, today) > 0) {
		return { ...window, end: today };
	}
	if (compareDays(window.start, today) > 0) {
		return { start: today, end: today };
	}
	return window;
}

export function initialWindow(today: DayId, daysBefore: number): TimelineWindow {
	return clampWindowToToday(
		{
			start: addDays(today, -daysBefore),
			end: today,
		},
		today,
	);
}
