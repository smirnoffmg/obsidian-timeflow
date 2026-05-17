import type { PeriodItem } from "../domain/types";
import type { IFeedRenderer, RenderContext, RenderOptions } from "../ports/feed-renderer";
import type { IExcerptProvider } from "../ports/excerpt-provider";
import { renderPeriodCard } from "../ui/period-card";
import { renderPlaceholderCard } from "../ui/placeholder-card";
import { renderSectionMarker } from "../ui/section-marker";

function createDiv(className: string): HTMLDivElement {
	const div = document.createElement("div");
	div.className = className;
	return div;
}

export class DomFeedRenderer implements IFeedRenderer {
	private scrollEl: HTMLDivElement;
	private listEl: HTMLDivElement;
	private loadingEl: HTMLDivElement;
	private excerptCache = new Map<string, string>();
	private renderGeneration = 0;

	constructor(
		container: HTMLElement,
		private readonly excerptProvider: IExcerptProvider,
		private readonly getExcerptMaxChars: () => number,
	) {
		this.loadingEl = createDiv("timeflow-loading");
		this.loadingEl.textContent = "Loading…";
		this.loadingEl.hidden = true;
		container.appendChild(this.loadingEl);

		this.scrollEl = createDiv("timeflow-scroll");
		this.listEl = createDiv("timeflow-list");
		this.scrollEl.appendChild(this.listEl);
		container.appendChild(this.scrollEl);
	}

	getScrollElement(): HTMLElement {
		return this.scrollEl;
	}

	getScrollMetrics(): { scrollTop: number; scrollHeight: number; clientHeight: number } {
		return {
			scrollTop: this.scrollEl.scrollTop,
			scrollHeight: this.scrollEl.scrollHeight,
			clientHeight: this.scrollEl.clientHeight,
		};
	}

	setLoading(loading: boolean): void {
		this.loadingEl.hidden = !loading;
	}

	scrollToItem(id: string): void {
		const target = this.listEl.querySelector(`[data-id="${id}"]`);
		if (target instanceof HTMLElement) {
			target.scrollIntoView({ block: "center" });
		}
	}

	render(items: PeriodItem[], context: RenderContext, options?: RenderOptions): void {
		const scrollTop = options?.preserveScroll ? this.scrollEl.scrollTop : 0;
		const generation = ++this.renderGeneration;
		this.listEl.replaceChildren();
		void this.renderItems(items, context, generation).then(() => {
			if (generation !== this.renderGeneration) {
				return;
			}
			if (options?.preserveScroll) {
				this.scrollEl.scrollTop = scrollTop;
			}
		});
	}

	invalidateExcerpts(paths?: string[]): void {
		if (!paths) {
			this.excerptCache.clear();
			return;
		}
		for (const path of paths) {
			this.excerptCache.delete(path);
		}
	}

	destroy(): void {
		this.renderGeneration++;
		this.listEl.replaceChildren();
		this.excerptCache.clear();
	}

	private async renderItems(
		items: PeriodItem[],
		context: RenderContext,
		generation: number,
	): Promise<void> {
		const maxChars = this.getExcerptMaxChars();

		for (const item of items) {
			if (generation !== this.renderGeneration) {
				return;
			}

			if (item.kind === "week-marker" || item.kind === "month-marker") {
				this.listEl.appendChild(renderSectionMarker(item));
				continue;
			}

			if (item.kind === "day" || item.kind === "week" || item.kind === "month") {
				if (item.note) {
					const excerpt = await this.loadExcerpt(item.note.path, maxChars);
					if (generation !== this.renderGeneration) {
						return;
					}
					this.listEl.appendChild(
						renderPeriodCard(item, {
							today: context.today,
							weekStartsOn: context.weekStartsOn,
							excerpt,
							onOpen: context.onOpenNote,
						}),
					);
				} else {
					this.listEl.appendChild(
						renderPlaceholderCard(item, {
							today: context.today,
							weekStartsOn: context.weekStartsOn,
							onCreate: context.onCreatePeriod,
						}),
					);
				}
			}
		}
	}

	private async loadExcerpt(path: string, maxChars: number): Promise<string> {
		const cached = this.excerptCache.get(path);
		if (cached !== undefined) {
			return cached;
		}
		const excerpt = await this.excerptProvider.getExcerpt(path, maxChars);
		this.excerptCache.set(path, excerpt);
		return excerpt;
	}
}
