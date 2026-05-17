import type { PeriodItem } from "../domain/types";
import { formatPeriodHeading, isCurrentPeriod } from "./period-format";

export function renderPlaceholderCard(
	item: PeriodItem,
	options: {
		today: string;
		weekStartsOn: number;
		onCreate: (item: PeriodItem) => void;
	},
): HTMLElement {
	const card = document.createElement("div");
	card.className = "timeflow-placeholder";
	if (item.kind === "week") {
		card.classList.add("timeflow-placeholder--week");
	}
	if (isCurrentPeriod(item, options.today, options.weekStartsOn)) {
		card.classList.add("timeflow-placeholder--today");
	}
	card.dataset.id = item.id;

	const dateEl = document.createElement("div");
	dateEl.className = "timeflow-placeholder__date";
	dateEl.textContent = formatPeriodHeading(item);

	const messageEl = document.createElement("div");
	messageEl.className = "timeflow-placeholder__message";
	messageEl.textContent = "No entry";

	const button = document.createElement("button");
	button.className = "timeflow-placeholder__button";
	button.type = "button";
	button.textContent = "Create note";
	button.addEventListener("click", (e) => {
		e.stopPropagation();
		options.onCreate(item);
	});

	card.appendChild(dateEl);
	card.appendChild(messageEl);
	card.appendChild(button);

	return card;
}
