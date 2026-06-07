import type { DayId, NoteRef } from "../../src/domain/types";
import type { IClock } from "../../src/ports/clock";
import type { IPeriodicNoteRepository } from "../../src/ports/periodic-note-repository";
import type { IFeedRenderer, RenderContext, RenderOptions } from "../../src/ports/feed-renderer";
import type { PeriodItem } from "../../src/domain/types";

export class FixedClock implements IClock {
	constructor(private readonly day: DayId) {}

	today(): DayId {
		return this.day;
	}
}

export class FakePeriodicNoteRepository implements IPeriodicNoteRepository {
	private dailyNotes = new Map<DayId, NoteRef>();
	private weeklyNotes = new Map<DayId, NoteRef>();
	private monthlyNotes = new Map<DayId, NoteRef>();
	private listeners = new Set<() => void>();
	configured = true;
	weeklyEnabled = false;
	monthlyEnabled = false;

	isConfigured(): boolean {
		return this.configured;
	}

	isWeeklyNotesEnabled(): boolean {
		return this.weeklyEnabled;
	}

	isMonthlyNotesEnabled(): boolean {
		return this.monthlyEnabled;
	}

	setDailyNote(day: DayId, path: string): void {
		this.dailyNotes.set(day, { path });
	}

	setWeeklyNote(weekStart: DayId, path: string): void {
		this.weeklyNotes.set(weekStart, { path });
	}

	setMonthlyNote(monthStart: DayId, path: string): void {
		this.monthlyNotes.set(monthStart, { path });
	}

	refresh(): void {}

	getNoteForDay(date: DayId): NoteRef | undefined {
		return this.dailyNotes.get(date);
	}

	getNoteForWeek(weekStart: DayId): NoteRef | undefined {
		return this.weeklyNotes.get(weekStart);
	}

	getNoteForMonth(monthStart: DayId): NoteRef | undefined {
		return this.monthlyNotes.get(monthStart);
	}

	async createNoteForDay(date: DayId): Promise<NoteRef> {
		const ref = { path: `daily/${date}.md` };
		this.dailyNotes.set(date, ref);
		return ref;
	}

	async createNoteForWeek(weekStart: DayId): Promise<NoteRef> {
		const ref = { path: `weekly/${weekStart}.md` };
		this.weeklyNotes.set(weekStart, ref);
		return ref;
	}

	async createNoteForMonth(monthStart: DayId): Promise<NoteRef> {
		const ref = { path: `monthly/${monthStart}.md` };
		this.monthlyNotes.set(monthStart, ref);
		return ref;
	}

	onNotesChanged(callback: () => void): () => void {
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}

	emitChange(): void {
		for (const cb of this.listeners) {
			cb();
		}
	}
}

/** @deprecated Use FakePeriodicNoteRepository */
export const FakeDailyNoteRepository = FakePeriodicNoteRepository;

export class FakeFeedRenderer implements IFeedRenderer {
	lastItems: PeriodItem[] = [];
	lastContext: RenderContext | null = null;
	scrollTop = 100;
	scrollHeight = 1000;
	clientHeight = 400;
	loading = false;
	scrollTarget: string | null = null;
	invalidatedPaths: string[] | "all" | null = null;

	render(items: PeriodItem[], context: RenderContext, _options?: RenderOptions): void {
		this.lastItems = items;
		this.lastContext = context;
	}

	invalidateExcerpts(paths?: string[]): void {
		this.invalidatedPaths = paths ?? "all";
	}

	scrollToItem(id: string): void {
		this.scrollTarget = id;
	}

	getScrollMetrics() {
		return {
			scrollTop: this.scrollTop,
			scrollHeight: this.scrollHeight,
			clientHeight: this.clientHeight,
		};
	}

	setLoading(loading: boolean): void {
		this.loading = loading;
	}

	destroy(): void {
		this.lastItems = [];
	}
}
