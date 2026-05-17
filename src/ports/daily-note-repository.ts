import type { DayId, NoteRef } from "../domain/types";

export interface IDailyNoteRepository {
	isConfigured(): boolean;
	getNoteForDay(date: DayId): NoteRef | undefined;
	createNoteForDay(date: DayId): Promise<NoteRef>;
	onNotesChanged(callback: () => void): () => void;
	refresh(): void;
}
