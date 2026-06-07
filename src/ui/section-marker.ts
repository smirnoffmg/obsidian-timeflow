import type { PeriodItem } from "../domain/types";
import { formatMonthHeading, formatWeekHeading } from "./period-format";

export function renderSectionMarker(item: PeriodItem): HTMLElement {
	const el = document.createElement("div");
	el.className = "timeflow-marker";
	const label = document.createElement("span");
	label.className = "timeflow-marker__label";
	label.textContent =
		item.kind === "month-marker" ? formatMonthHeading(item.date) : formatWeekHeading(item.date);
	el.appendChild(label);
	return el;
}
