import { ItemView, WorkspaceLeaf } from "obsidian";
import { ObsidianClock } from "../adapters/obsidian-clock";
import { DomFeedRenderer } from "../adapters/dom-feed-renderer";
import { ObsidianPeriodicNoteRepository } from "../adapters/obsidian-periodic-note-repository";
import { ObsidianExcerptProvider } from "../adapters/obsidian-excerpt-provider";
import { FeedPresenter } from "../presenters/feed-presenter";
import type TimeflowPlugin from "../main";

export const VIEW_TYPE_TIMEFLOW = "timeflow-periodic";

export class TimeflowView extends ItemView {
	private presenter: FeedPresenter | null = null;
	private renderer: DomFeedRenderer | null = null;

	constructor(
		leaf: WorkspaceLeaf,
		private readonly plugin: TimeflowPlugin,
	) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_TIMEFLOW;
	}

	getDisplayText(): string {
		return "Timeflow periodic";
	}

	getIcon(): string {
		return "history";
	}

	async onOpen(): Promise<void> {
		this.containerEl.addClass("timeflow-view");
		const { contentEl } = this;
		contentEl.empty();
		const root = contentEl.createDiv({ cls: "timeflow-root" });

		const repository = new ObsidianPeriodicNoteRepository(this.app, (ref) =>
			this.plugin.registerEvent(ref),
		);

		const excerptProvider = new ObsidianExcerptProvider(this.app);
		this.renderer = new DomFeedRenderer(
			root,
			excerptProvider,
			() => this.plugin.settings.excerptMaxChars,
		);

		this.presenter = new FeedPresenter(
			new ObsidianClock(),
			repository,
			this.renderer,
			() => this.plugin.settings,
			{
				onOpenNote: (path) => {
					void this.app.workspace.openLinkText(path, "", false);
				},
			},
		);

		if (!this.presenter.isConfigured()) {
			this.renderEmptyState(root);
			return;
		}

		this.presenter.attach();

		this.registerDomEvent(this.renderer.getScrollElement(), "scroll", () => {
			this.presenter?.onScroll();
		});
	}

	async onClose(): Promise<void> {
		this.containerEl.removeClass("timeflow-view");
		this.presenter?.detach();
		this.presenter = null;
		this.renderer?.destroy();
		this.renderer = null;
	}

	jumpToToday(): void {
		this.presenter?.jumpToToday();
	}

	private renderEmptyState(container: HTMLElement): void {
		const state = container.createDiv({ cls: "timeflow-empty" });
		state.createEl("p", {
			text: "Enable daily notes in settings → periodic notes to use the timeline.",
		});
	}
}
