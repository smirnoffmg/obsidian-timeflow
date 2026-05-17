import type { App, EventRef } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	createDailyNote,
	getAllDailyNotes,
	getDailyNote,
	getDailyNoteSettings,
} from "obsidian-daily-notes-interface";
import { parseDayId } from "../domain/dates";
import type { DayId, NoteRef } from "../domain/types";
import type { IDailyNoteRepository } from "../ports/daily-note-repository";

const DEBOUNCE_MS = 300;

function dayIdToMoment(day: DayId) {
	const date = parseDayId(day);
	return window.moment([date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()]);
}

export class ObsidianDailyNoteRepository implements IDailyNoteRepository {
	private notesCache: ReturnType<typeof getAllDailyNotes> | null = null;
	private changeCallbacks = new Set<() => void>();
	private debounceTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(
		private readonly app: App,
		private readonly registerEvent: (ref: EventRef) => void,
	) {
		const notify = () => this.scheduleNotify();
		this.registerEvent(this.app.vault.on("create", notify));
		this.registerEvent(this.app.vault.on("delete", notify));
		this.registerEvent(this.app.vault.on("rename", notify));
		this.registerEvent(this.app.vault.on("modify", notify));
	}

	isConfigured(): boolean {
		if (!appHasDailyNotesPluginLoaded()) {
			return false;
		}
		try {
			const settings = getDailyNoteSettings();
			return Boolean(settings.folder && settings.format);
		} catch {
			return false;
		}
	}

	refresh(): void {
		if (!this.isConfigured()) {
			this.notesCache = null;
			return;
		}
		this.notesCache = getAllDailyNotes();
	}

	getNoteForDay(date: DayId): NoteRef | undefined {
		if (!this.notesCache) {
			this.refresh();
		}
		if (!this.notesCache) {
			return undefined;
		}
		const file = getDailyNote(dayIdToMoment(date), this.notesCache);
		return file ? { path: file.path } : undefined;
	}

	async createNoteForDay(date: DayId): Promise<NoteRef> {
		const file = await createDailyNote(dayIdToMoment(date));
		if (!file) {
			throw new Error(`Failed to create daily note for ${date}`);
		}
		this.refresh();
		this.notifyNow();
		return { path: file.path };
	}

	onNotesChanged(callback: () => void): () => void {
		this.changeCallbacks.add(callback);
		return () => this.changeCallbacks.delete(callback);
	}

	private scheduleNotify(): void {
		if (this.debounceTimer !== null) {
			clearTimeout(this.debounceTimer);
		}
		this.debounceTimer = setTimeout(() => {
			this.debounceTimer = null;
			this.refresh();
			this.notifyNow();
		}, DEBOUNCE_MS);
	}

	private notifyNow(): void {
		for (const cb of this.changeCallbacks) {
			cb();
		}
	}
}
