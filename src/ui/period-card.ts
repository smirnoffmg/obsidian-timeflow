import { parseDayId } from "../domain/dates";
import type { PeriodItem } from "../domain/types";

function formatDayHeading(date: string): string {
	const d = parseDayId(date);
	return d.toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	});
}

function titleFromPath(path: string): string {
	const base = path.split("/").pop() ?? path;
	return base.replace(/\.md$/i, "");
}

export function renderPeriodCard(
	item: PeriodItem,
	options: {
		today: string;
		excerpt: string;
		onOpen: (path: string) => void;
	},
): HTMLElement {
	const card = document.createElement("div");
	card.className = "timeflow-card";
	if (item.date === options.today) {
		card.classList.add("timeflow-card--today");
	}
	card.dataset.id = item.id;

	const dateEl = document.createElement("div");
	dateEl.className = "timeflow-card__date";
	dateEl.textContent = formatDayHeading(item.date);

	const titleEl = document.createElement("div");
	titleEl.className = "timeflow-card__title";
	titleEl.textContent = item.note ? titleFromPath(item.note.path) : "";

	card.appendChild(dateEl);
	card.appendChild(titleEl);

	if (options.excerpt) {
		const excerptEl = document.createElement("div");
		excerptEl.className = "timeflow-card__excerpt";
		excerptEl.textContent = options.excerpt;
		card.appendChild(excerptEl);
	}

	if (item.note) {
		card.addEventListener("click", () => options.onOpen(item.note!.path));
	}

	return card;
}
