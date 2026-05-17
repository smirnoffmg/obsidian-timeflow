import type { DayId, PeriodItem } from "../domain/types";

export interface RenderContext {
	today: DayId;
	weekStartsOn: number;
	isLoading: boolean;
	onOpenNote: (path: string) => void;
	onCreatePeriod: (item: PeriodItem) => void;
}

export interface RenderOptions {
	/** Keep scroll position when the feed updates in place. */
	preserveScroll?: boolean;
}

export interface IFeedRenderer {
	render(items: PeriodItem[], context: RenderContext, options?: RenderOptions): void;
	scrollToItem(id: string): void;
	getScrollMetrics(): { scrollTop: number; scrollHeight: number; clientHeight: number };
	setLoading(loading: boolean): void;
	invalidateExcerpts(paths?: string[]): void;
	destroy(): void;
}
