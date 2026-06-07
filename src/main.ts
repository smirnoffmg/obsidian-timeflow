import { Plugin } from "obsidian";
import { activateTimeflow, registerCommands } from "./commands";
import { TimeflowSettingTab } from "./settings";
import { DEFAULT_SETTINGS, type TimeflowSettings } from "./timeflow-settings";
import { TimeflowView, VIEW_TYPE_TIMEFLOW } from "./views/timeflow-view";

export default class TimeflowPlugin extends Plugin {
	settings: TimeflowSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_TIMEFLOW, (leaf) => new TimeflowView(leaf, this));

		registerCommands(this);

		this.addRibbonIcon("history", "Open timeline", () => {
			void activateTimeflow(this);
		});

		this.addSettingTab(new TimeflowSettingTab(this.app, this));
	}

	onunload(): void {
		// Leaves persist across plugin reload per Obsidian UX guidelines.
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<TimeflowSettings>,
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
