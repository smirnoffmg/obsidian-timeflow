import { describe, expect, it, vi } from "vitest";
import { FeedPresenter } from "../../src/presenters/feed-presenter";
import { DEFAULT_SETTINGS } from "../../src/timeflow-settings";
import { FakeFeedRenderer, FakePeriodicNoteRepository, FixedClock } from "../__mocks__/fakes";

describe("FeedPresenter", () => {
	it("renders after refresh when configured", async () => {
		const repo = new FakePeriodicNoteRepository();
		repo.setDailyNote("2026-05-15", "daily/2026-05-15.md");
		const renderer = new FakeFeedRenderer();
		const presenter = new FeedPresenter(
			new FixedClock("2026-05-15"),
			repo,
			renderer,
			() => DEFAULT_SETTINGS,
			{ onOpenNote: vi.fn() },
		);

		presenter.attach();
		await vi.waitFor(() => expect(renderer.lastItems.length).toBeGreaterThan(0));

		expect(renderer.lastItems.some((i) => i.kind === "day")).toBe(true);
		presenter.detach();
	});

	it("renders empty when not configured", async () => {
		const repo = new FakePeriodicNoteRepository();
		repo.configured = false;
		const renderer = new FakeFeedRenderer();
		const presenter = new FeedPresenter(
			new FixedClock("2026-05-15"),
			repo,
			renderer,
			() => DEFAULT_SETTINGS,
			{ onOpenNote: vi.fn() },
		);

		await presenter.refresh();
		expect(renderer.lastItems).toHaveLength(0);
	});

	it("jumpToToday scrolls to today item", () => {
		const repo = new FakePeriodicNoteRepository();
		const renderer = new FakeFeedRenderer();
		const presenter = new FeedPresenter(
			new FixedClock("2026-05-15"),
			repo,
			renderer,
			() => DEFAULT_SETTINGS,
			{ onOpenNote: vi.fn() },
		);

		presenter.jumpToToday();
		expect(renderer.scrollTarget).toBe("day-2026-05-15");
	});

	it("invalidates excerpts when vault notes change", async () => {
		const repo = new FakePeriodicNoteRepository();
		repo.setDailyNote("2026-05-15", "daily/2026-05-15.md");
		const renderer = new FakeFeedRenderer();
		const presenter = new FeedPresenter(
			new FixedClock("2026-05-15"),
			repo,
			renderer,
			() => DEFAULT_SETTINGS,
			{ onOpenNote: vi.fn() },
		);

		presenter.attach();
		await vi.waitFor(() => expect(renderer.lastItems.length).toBeGreaterThan(0));
		renderer.invalidatedPaths = null;
		repo.emitChange();
		await vi.waitFor(() => expect(renderer.invalidatedPaths).not.toBeNull());
		expect(renderer.invalidatedPaths).toEqual(["daily/2026-05-15.md"]);
		presenter.detach();
	});

	it("extends window on scroll near edge", async () => {
		const repo = new FakePeriodicNoteRepository();
		const renderer = new FakeFeedRenderer();
		renderer.scrollTop = 650;
		renderer.scrollHeight = 1000;
		renderer.clientHeight = 400;
		const presenter = new FeedPresenter(
			new FixedClock("2026-05-15"),
			repo,
			renderer,
			() => DEFAULT_SETTINGS,
			{ onOpenNote: vi.fn() },
		);

		await presenter.refresh();
		const startBefore = presenter.getWindow().start;
		presenter.onScroll();
		expect(presenter.getWindow().start < startBefore).toBe(true);
	});
});
