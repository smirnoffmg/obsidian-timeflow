import { parseDayId } from "../domain/dates";
import type { PeriodItem } from "../domain/types";
import { formatWeekHeading } from "./period-format";

function formatMonthLabel(date: string): string {
	const d = parseDayId(date);
	return d.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function renderSectionMarker(item: PeriodItem): HTMLElement {
	const el = document.createElement("div");
	el.className = "timeflow-marker";
	const label = document.createElement("span");
	label.className = "timeflow-marker__label";
	label.textContent =
		item.kind === "month-marker"
			? formatMonthLabel(item.date)
			: formatWeekHeading(item.date);
	el.appendChild(label);
	return el;
}
