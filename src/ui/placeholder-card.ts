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

export function renderPlaceholderCard(
	item: PeriodItem,
	options: {
		today: string;
		onCreate: (date: string) => void;
	},
): HTMLElement {
	const card = document.createElement("div");
	card.className = "timeflow-placeholder";
	if (item.date === options.today) {
		card.classList.add("timeflow-placeholder--today");
	}
	card.dataset.id = item.id;

	const dateEl = document.createElement("div");
	dateEl.className = "timeflow-placeholder__date";
	dateEl.textContent = formatDayHeading(item.date);

	const message = document.createElement("div");
	message.className = "timeflow-placeholder__message";
	message.textContent = "No entry";

	const button = document.createElement("button");
	button.className = "timeflow-placeholder__button";
	button.type = "button";
	button.textContent = "Create note";
	button.addEventListener("click", (e) => {
		e.stopPropagation();
		options.onCreate(item.date);
	});

	card.appendChild(dateEl);
	card.appendChild(message);
	card.appendChild(button);

	return card;
}
