import type { DayId, NoteRef } from "../../src/domain/types";
import type { IClock } from "../../src/ports/clock";
import type { IDailyNoteRepository } from "../../src/ports/daily-note-repository";
import type {
	IFeedRenderer,
	RenderContext,
	RenderOptions,
} from "../../src/ports/feed-renderer";
import type { PeriodItem } from "../../src/domain/types";

export class FixedClock implements IClock {
	constructor(private readonly day: DayId) {}

	today(): DayId {
		return this.day;
	}
}

export class FakeDailyNoteRepository implements IDailyNoteRepository {
	private notes = new Map<DayId, NoteRef>();
	private listeners = new Set<() => void>();
	configured = true;

	isConfigured(): boolean {
		return this.configured;
	}

	setNote(day: DayId, path: string): void {
		this.notes.set(day, { path });
	}

	refresh(): void {}

	getNoteForDay(date: DayId): NoteRef | undefined {
		return this.notes.get(date);
	}

	async createNoteForDay(date: DayId): Promise<NoteRef> {
		const ref = { path: `daily/${date}.md` };
		this.notes.set(date, ref);
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
