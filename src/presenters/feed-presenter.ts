import type { PeriodItem, TimelineWindow } from "../domain/types";
import type { StreamInsertOptions } from "../domain/timeline/marker-inserter";
import {
	buildTimeline,
	clampWindowToToday,
	initialWindow,
} from "../domain/timeline/timeline-builder";
import { applyScrollExtension, findTodayItemId } from "../domain/timeline/scroll-window-policy";
import type { IClock } from "../ports/clock";
import type { IPeriodicNoteRepository } from "../ports/periodic-note-repository";
import type { IFeedRenderer, RenderContext } from "../ports/feed-renderer";
import type { TimeflowSettings } from "../timeflow-settings";

export interface FeedPresenterCallbacks {
	onOpenNote: (path: string) => void;
}

export class FeedPresenter {
	private window: TimelineWindow;
	private items: PeriodItem[] = [];
	private loading = false;
	private unsubscribeNotes: (() => void) | null = null;

	constructor(
		private readonly clock: IClock,
		private readonly repository: IPeriodicNoteRepository,
		private readonly renderer: IFeedRenderer,
		private readonly getSettings: () => TimeflowSettings,
		private readonly callbacks: FeedPresenterCallbacks,
	) {
		const settings = getSettings();
		this.window = initialWindow(clock.today(), settings.daysBeforeToday);
	}

	attach(): void {
		this.unsubscribeNotes = this.repository.onNotesChanged(() => {
			void this.refresh({ preserveScroll: true, silent: true });
		});
		void this.refresh();
	}

	detach(): void {
		this.unsubscribeNotes?.();
		this.unsubscribeNotes = null;
	}

	getItems(): PeriodItem[] {
		return this.items;
	}

	getWindow(): TimelineWindow {
		return this.window;
	}

	isConfigured(): boolean {
		return this.repository.isConfigured();
	}

	async refresh(options?: { preserveScroll?: boolean; silent?: boolean }): Promise<void> {
		if (!this.repository.isConfigured()) {
			this.items = [];
			this.render(options);
			return;
		}
		if (!options?.silent) {
			this.setLoading(true);
		}
		this.repository.refresh();
		this.rebuildItems();
		this.invalidateNoteExcerpts();
		if (!options?.silent) {
			this.setLoading(false);
		}
		this.render(options);
	}

	jumpToToday(): void {
		const todayId = findTodayItemId(this.clock.today());
		this.renderer.scrollToItem(todayId);
	}

	onScroll(): void {
		if (!this.repository.isConfigured()) {
			return;
		}
		const settings = this.getSettings();
		const metrics = this.renderer.getScrollMetrics();
		const today = this.clock.today();
		const nextWindow = clampWindowToToday(
			applyScrollExtension(this.window, metrics, settings.loadChunkDays, today),
			today,
		);
		if (nextWindow.start === this.window.start && nextWindow.end === this.window.end) {
			return;
		}
		this.window = nextWindow;
		this.rebuildItems();
		this.render();
	}

	private rebuildItems(): void {
		const settings = this.getSettings();
		const streamOptions: StreamInsertOptions = {
			showWeekMarkers: settings.showWeekMarkers,
			showMonthMarkers: settings.showMonthMarkers,
			weekStartsOn: settings.weekStartsOn,
			weeklyNotesEnabled: this.repository.isWeeklyNotesEnabled(),
			weekLookup: (weekStart) => this.repository.getNoteForWeek(weekStart),
			monthlyNotesEnabled: this.repository.isMonthlyNotesEnabled(),
			monthLookup: (monthStart) => this.repository.getNoteForMonth(monthStart),
		};
		this.items = buildTimeline(
			this.window,
			(day) => this.repository.getNoteForDay(day),
			streamOptions,
		);
	}

	private setLoading(loading: boolean): void {
		this.loading = loading;
		this.renderer.setLoading(loading);
	}

	private buildContext(): RenderContext {
		return {
			today: this.clock.today(),
			isLoading: this.loading,
			onOpenNote: (path) => this.callbacks.onOpenNote(path),
			onCreatePeriod: (item) => {
				void this.createPeriod(item);
			},
			weekStartsOn: this.getSettings().weekStartsOn,
		};
	}

	private invalidateNoteExcerpts(): void {
		const paths = this.items
			.filter(
				(item) =>
					(item.kind === "day" || item.kind === "week" || item.kind === "month") &&
					item.note,
			)
			.map((item) => item.note!.path);
		this.renderer.invalidateExcerpts(paths);
	}

	private render(options?: { preserveScroll?: boolean }): void {
		this.renderer.render(this.items, this.buildContext(), {
			preserveScroll: options?.preserveScroll,
		});
	}

	private async createPeriod(item: PeriodItem): Promise<void> {
		if (item.kind === "week") {
			await this.repository.createNoteForWeek(item.date);
		} else if (item.kind === "month") {
			await this.repository.createNoteForMonth(item.date);
		} else {
			await this.repository.createNoteForDay(item.date);
		}
		await this.refresh();
	}
}
