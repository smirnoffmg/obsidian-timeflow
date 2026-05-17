import type { PeriodItem } from "../domain/types";
import { formatPeriodHeading, isCurrentPeriod } from "./period-format";

function titleFromPath(path: string): string {
	const base = path.split("/").pop() ?? path;
	return base.replace(/\.md$/i, "");
}

export function renderPeriodCard(
	item: PeriodItem,
	options: {
		today: string;
		weekStartsOn: number;
		excerpt: string;
		onOpen: (path: string) => void;
	},
): HTMLElement {
	const root = document.createElement("div");
	root.className = "timeflow-card";
	if (item.kind === "week") {
		root.classList.add("timeflow-card--week");
	}
	if (isCurrentPeriod(item, options.today, options.weekStartsOn)) {
		root.classList.add("timeflow-card--today");
	}
	root.dataset.id = item.id;

	const dateEl = document.createElement("div");
	dateEl.className = "timeflow-card__date";
	dateEl.textContent = formatPeriodHeading(item);

	const titleEl = document.createElement("div");
	titleEl.className = "timeflow-card__title";
	titleEl.textContent = item.note ? titleFromPath(item.note.path) : "";

	root.appendChild(dateEl);
	root.appendChild(titleEl);

	if (options.excerpt) {
		const excerptEl = document.createElement("div");
		excerptEl.className = "timeflow-card__excerpt";
		excerptEl.textContent = options.excerpt;
		root.appendChild(excerptEl);
	}

	if (item.note) {
		root.addEventListener("click", () => options.onOpen(item.note!.path));
	}

	return root;
}
