import { describe, expect, it, vi, beforeEach } from "vitest";

const getAllDailyNotes = vi.fn(() => ({}));
const getDailyNote = vi.fn();
const appHasDailyNotesPluginLoaded = vi.fn(() => true);
const getDailyNoteSettings = vi.fn(() => ({
	folder: "daily",
	format: "YYYY-MM-DD",
	template: "",
}));

vi.mock("obsidian-daily-notes-interface", () => ({
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
	getDailyNote,
	getDailyNoteSettings,
	createDailyNote: vi.fn(),
}));

describe("ObsidianDailyNoteRepository", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal("window", {
			moment: () => ({
				format: () => "2026-05-15",
			}),
		});
	});

	it("reports not configured when daily notes disabled", async () => {
		appHasDailyNotesPluginLoaded.mockReturnValue(false);
		const { ObsidianDailyNoteRepository } = await import(
			"../../src/adapters/obsidian-daily-note-repository"
		);
		const repo = new ObsidianDailyNoteRepository(
			{ vault: { on: vi.fn(() => ({})) } } as never,
			vi.fn(),
		);
		expect(repo.isConfigured()).toBe(false);
	});

	it("maps getAllDailyNotes to getNoteForDay", async () => {
		appHasDailyNotesPluginLoaded.mockReturnValue(true);
		getAllDailyNotes.mockReturnValue({});
		getDailyNote.mockReturnValue({ path: "daily/2026-05-15.md" });
		const { ObsidianDailyNoteRepository } = await import(
			"../../src/adapters/obsidian-daily-note-repository"
		);
		const repo = new ObsidianDailyNoteRepository(
			{ vault: { on: vi.fn(() => ({})) } } as never,
			vi.fn(),
		);
		repo.refresh();
		expect(repo.getNoteForDay("2026-05-15")?.path).toBe("daily/2026-05-15.md");
	});
});
