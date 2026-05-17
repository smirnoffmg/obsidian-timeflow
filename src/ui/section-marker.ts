import { addDays, isoWeekNumber, parseDayId } from "../domain/dates";
import type { PeriodItem } from "../domain/types";

function formatMonthLabel(date: string): string {
	const d = parseDayId(date);
	return d.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function formatWeekLabel(weekStart: string): string {
	const start = parseDayId(weekStart);
	const end = parseDayId(addDays(weekStart, 6));
	const week = isoWeekNumber(weekStart);
	const range = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}–${end.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`;
	return `Week ${week} · ${range}`;
}

export function renderSectionMarker(item: PeriodItem): HTMLElement {
	const el = document.createElement("div");
	el.className = "timeflow-marker";
	const label = document.createElement("span");
	label.className = "timeflow-marker__label";
	label.textContent =
		item.kind === "month-marker"
			? formatMonthLabel(item.date)
			: formatWeekLabel(item.date);
	el.appendChild(label);
	return el;
}
