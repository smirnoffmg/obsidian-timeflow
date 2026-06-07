import { App, PluginSettingTab, Setting } from "obsidian";
import type TimeflowPlugin from "./main";
import { clampSetting, DEFAULT_SETTINGS, type TimeflowSettings } from "./timeflow-settings";

export type { TimeflowSettings };
export { DEFAULT_SETTINGS, clampSetting };

export class TimeflowSettingTab extends PluginSettingTab {
	plugin: TimeflowPlugin;

	constructor(app: App, plugin: TimeflowPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Days before today")
			.setDesc("How many past days to load initially.")
			.addText((text) =>
				text
					.setValue(String(this.plugin.settings.daysBeforeToday))
					.onChange(async (value) => {
						this.plugin.settings.daysBeforeToday = clampSetting(
							Number(value),
							7,
							3650,
							DEFAULT_SETTINGS.daysBeforeToday,
						);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Scroll chunk size")
			.setDesc("Days to add when scrolling down into older entries.")
			.addText((text) =>
				text
					.setValue(String(this.plugin.settings.loadChunkDays))
					.onChange(async (value) => {
						this.plugin.settings.loadChunkDays = clampSetting(
							Number(value),
							7,
							180,
							DEFAULT_SETTINGS.loadChunkDays,
						);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Week markers")
			.setDesc("Show week dividers in the timeline.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showWeekMarkers).onChange(async (value) => {
					this.plugin.settings.showWeekMarkers = value;
					await this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName("Month markers")
			.setDesc("Show month dividers in the timeline.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showMonthMarkers).onChange(async (value) => {
					this.plugin.settings.showMonthMarkers = value;
					await this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName("Excerpt length")
			.setDesc("Maximum characters for note previews on cards.")
			.addText((text) =>
				text
					.setValue(String(this.plugin.settings.excerptMaxChars))
					.onChange(async (value) => {
						this.plugin.settings.excerptMaxChars = clampSetting(
							Number(value),
							50,
							2000,
							DEFAULT_SETTINGS.excerptMaxChars,
						);
						await this.plugin.saveSettings();
					}),
			);
	}
}
