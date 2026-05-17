import type { DayId, NoteRef } from "../domain/types";

export interface IPeriodicNoteRepository {
	isConfigured(): boolean;
	isWeeklyNotesEnabled(): boolean;
	getNoteForDay(date: DayId): NoteRef | undefined;
	getNoteForWeek(weekStart: DayId): NoteRef | undefined;
	createNoteForDay(date: DayId): Promise<NoteRef>;
	createNoteForWeek(weekStart: DayId): Promise<NoteRef>;
	onNotesChanged(callback: () => void): () => void;
	refresh(): void;
}
