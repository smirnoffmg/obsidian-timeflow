export type DayId = string;

export interface NoteRef {
	path: string;
}

export type PeriodKind = "day" | "week-marker" | "month-marker";

export interface PeriodItem {
	kind: PeriodKind;
	date: DayId;
	note?: NoteRef;
	id: string;
}

export interface TimelineWindow {
	start: DayId;
	end: DayId;
}

export interface MarkerOptions {
	showWeekMarkers: boolean;
	showMonthMarkers: boolean;
	weekStartsOn: number;
}

export interface NoteLookup {
	(day: DayId): NoteRef | undefined;
}
