import { addDays, compareDays } from "../dates";
import type { DayId, TimelineWindow } from "../types";

export const SCROLL_EDGE_THRESHOLD_PX = 200;

export interface ScrollMetrics {
	scrollTop: number;
	scrollHeight: number;
	clientHeight: number;
}

/** Near top (newest entries) — do not load future dates. */
export function shouldExtendPast(metrics: ScrollMetrics): boolean {
	return metrics.scrollTop < SCROLL_EDGE_THRESHOLD_PX;
}

/** Near bottom (oldest visible entries) — load more history. */
export function shouldExtendFuture(metrics: ScrollMetrics): boolean {
	const distanceFromBottom =
		metrics.scrollHeight - metrics.scrollTop - metrics.clientHeight;
	return distanceFromBottom < SCROLL_EDGE_THRESHOLD_PX;
}

export function shouldExtendOlderHistory(metrics: ScrollMetrics): boolean {
	return shouldExtendFuture(metrics);
}

export function extendWindowPast(
	window: TimelineWindow,
	chunkDays: number,
): TimelineWindow {
	return {
		start: addDays(window.start, -chunkDays),
		end: window.end,
	};
}

export function extendWindowFuture(
	window: TimelineWindow,
	chunkDays: number,
): TimelineWindow {
	return {
		start: window.start,
		end: addDays(window.end, chunkDays),
	};
}

export function applyScrollExtension(
	window: TimelineWindow,
	metrics: ScrollMetrics,
	chunkDays: number,
	today: DayId,
): TimelineWindow {
	let next = window;
	// Newest-first: scroll down toward older entries → extend start only.
	if (shouldExtendOlderHistory(metrics)) {
		next = extendWindowPast(next, chunkDays);
	}
	return clampWindowEnd(next, today);
}

export function clampWindowEnd(window: TimelineWindow, today: DayId): TimelineWindow {
	if (compareDays(window.end, today) > 0) {
		return { ...window, end: today };
	}
	return window;
}

export function findTodayItemId(today: DayId): string {
	return `day-${today}`;
}
