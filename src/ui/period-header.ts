import { setIcon } from "obsidian";
import type { PeriodItem } from "../domain/types";
import {
	cardPeriodKind,
	formatPeriodHeading,
	periodKindIcon,
	periodKindLabel,
} from "./period-format";

export function applyPeriodKindClass(
	el: HTMLElement,
	baseClass: "timeflow-card" | "timeflow-placeholder",
	item: PeriodItem,
): void {
	el.classList.add(`${baseClass}--${cardPeriodKind(item)}`);
}

export function buildPeriodHeader(item: PeriodItem): HTMLElement {
	const kind = cardPeriodKind(item);

	const header = document.createElement("div");
	header.className = "timeflow-period__header";

	const iconEl = document.createElement("span");
	iconEl.className = "timeflow-period__icon";
	setIcon(iconEl, periodKindIcon(kind));

	const meta = document.createElement("div");
	meta.className = "timeflow-period__meta";

	const period = document.createElement("span");
	period.className = "timeflow-period__period";
	period.textContent = periodKindLabel(kind);

	const sep = document.createElement("span");
	sep.className = "timeflow-period__sep";
	sep.textContent = "·";

	const heading = document.createElement("span");
	heading.className = "timeflow-period__heading";
	heading.textContent = formatPeriodHeading(item);

	meta.appendChild(period);
	meta.appendChild(sep);
	meta.appendChild(heading);
	header.appendChild(iconEl);
	header.appendChild(meta);

	return header;
}
