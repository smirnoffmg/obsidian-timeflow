import type { PeriodItem } from "../domain/types";
import { isCurrentPeriod } from "./period-format";
import { applyPeriodKindClass, buildPeriodHeader } from "./period-header";

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
	applyPeriodKindClass(card, "timeflow-placeholder", item);
	if (isCurrentPeriod(item, options.today, options.weekStartsOn)) {
		card.classList.add("timeflow-placeholder--current");
	}
	card.dataset.id = item.id;

	card.appendChild(buildPeriodHeader(item));

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

	card.appendChild(messageEl);
	card.appendChild(button);

	return card;
}
