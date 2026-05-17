import { describe, expect, it, vi, beforeEach } from "vitest";

const getAllDailyNotes = vi.fn(() => ({}));
const getAllWeeklyNotes = vi.fn(() => ({}));
const getAllMonthlyNotes = vi.fn(() => ({}));
const getDailyNote = vi.fn();
const getWeeklyNote = vi.fn();
const getMonthlyNote = vi.fn();
const appHasDailyNotesPluginLoaded = vi.fn(() => true);
const appHasWeeklyNotesPluginLoaded = vi.fn(() => true);
const appHasMonthlyNotesPluginLoaded = vi.fn(() => true);
const getDailyNoteSettings = vi.fn(() => ({
	folder: "daily",
	format: "YYYY-MM-DD",
	template: "",
}));
const getWeeklyNoteSettings = vi.fn(() => ({
	folder: "weekly",
	format: "gggg-[W]ww",
	template: "",
}));
const getMonthlyNoteSettings = vi.fn(() => ({
	folder: "monthly",
	format: "YYYY-MM",
	template: "",
}));

vi.mock("obsidian-daily-notes-interface", () => ({
	appHasDailyNotesPluginLoaded,
	appHasWeeklyNotesPluginLoaded,
	appHasMonthlyNotesPluginLoaded,
	getAllDailyNotes,
	getAllWeeklyNotes,
	getAllMonthlyNotes,
	getDailyNote,
	getWeeklyNote,
	getMonthlyNote,
	getDailyNoteSettings,
	getWeeklyNoteSettings,
	getMonthlyNoteSettings,
	createDailyNote: vi.fn(),
	createWeeklyNote: vi.fn(),
	createMonthlyNote: vi.fn(),
}));

describe("ObsidianPeriodicNoteRepository", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal("window", {
			moment: () => ({ format: () => "2026-05-15" }),
		});
	});

	it("reports not configured when daily notes disabled", async () => {
		appHasDailyNotesPluginLoaded.mockReturnValue(false);
		const { ObsidianPeriodicNoteRepository } = await import(
			"../../src/adapters/obsidian-periodic-note-repository"
		);
		const repo = new ObsidianPeriodicNoteRepository(
			{ vault: { on: vi.fn(() => ({})) } } as never,
			vi.fn(),
		);
		expect(repo.isConfigured()).toBe(false);
	});

	it("maps getAllDailyNotes to getNoteForDay", async () => {
		appHasDailyNotesPluginLoaded.mockReturnValue(true);
		getAllDailyNotes.mockReturnValue({});
		getDailyNote.mockReturnValue({ path: "daily/2026-05-15.md" });
		const { ObsidianPeriodicNoteRepository } = await import(
			"../../src/adapters/obsidian-periodic-note-repository"
		);
		const repo = new ObsidianPeriodicNoteRepository(
			{ vault: { on: vi.fn(() => ({})) } } as never,
			vi.fn(),
		);
		repo.refresh();
		expect(repo.getNoteForDay("2026-05-15")?.path).toBe("daily/2026-05-15.md");
	});

	it("maps getAllWeeklyNotes when weekly notes enabled", async () => {
		appHasWeeklyNotesPluginLoaded.mockReturnValue(true);
		getAllWeeklyNotes.mockReturnValue({});
		getWeeklyNote.mockReturnValue({ path: "weekly/2026-W20.md" });
		const { ObsidianPeriodicNoteRepository } = await import(
			"../../src/adapters/obsidian-periodic-note-repository"
		);
		const repo = new ObsidianPeriodicNoteRepository(
			{ vault: { on: vi.fn(() => ({})) } } as never,
			vi.fn(),
		);
		repo.refresh();
		expect(repo.isWeeklyNotesEnabled()).toBe(true);
		expect(repo.getNoteForWeek("2026-05-11")?.path).toBe("weekly/2026-W20.md");
	});

	it("maps getAllMonthlyNotes when monthly notes enabled", async () => {
		appHasMonthlyNotesPluginLoaded.mockReturnValue(true);
		getAllMonthlyNotes.mockReturnValue({});
		getMonthlyNote.mockReturnValue({ path: "monthly/2026-05.md" });
		const { ObsidianPeriodicNoteRepository } = await import(
			"../../src/adapters/obsidian-periodic-note-repository"
		);
		const repo = new ObsidianPeriodicNoteRepository(
			{ vault: { on: vi.fn(() => ({})) } } as never,
			vi.fn(),
		);
		repo.refresh();
		expect(repo.isMonthlyNotesEnabled()).toBe(true);
		expect(repo.getNoteForMonth("2026-05-01")?.path).toBe("monthly/2026-05.md");
	});
});
