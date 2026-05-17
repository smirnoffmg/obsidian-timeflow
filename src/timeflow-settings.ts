export interface TimeflowSettings {
	daysBeforeToday: number;
	loadChunkDays: number;
	showWeekMarkers: boolean;
	showMonthMarkers: boolean;
	excerptMaxChars: number;
	weekStartsOn: number;
}

export const DEFAULT_SETTINGS: TimeflowSettings = {
	daysBeforeToday: 90,
	loadChunkDays: 60,
	showWeekMarkers: true,
	showMonthMarkers: true,
	excerptMaxChars: 200,
	weekStartsOn: 1,
};

export function clampSetting(value: number, min: number, max: number, fallback: number): number {
	if (!Number.isFinite(value)) {
		return fallback;
	}
	return Math.min(max, Math.max(min, Math.round(value)));
}
