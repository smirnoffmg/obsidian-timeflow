import type { WorkspaceLeaf } from "obsidian";
import type TimeflowPlugin from "../main";
import { TimeflowView, VIEW_TYPE_TIMEFLOW } from "../views/timeflow-view";

export function registerCommands(plugin: TimeflowPlugin): void {
	plugin.addCommand({
		id: "open",
		name: "Open timeline",
		callback: () => {
			void activateTimeflow(plugin);
		},
	});

	plugin.addCommand({
		id: "jump-to-today",
		name: "Jump to today",
		callback: () => {
			const view = getTimeflowView(plugin);
			if (view) {
				view.jumpToToday();
				return;
			}
			void activateTimeflow(plugin).then(() => {
				getTimeflowView(plugin)?.jumpToToday();
			});
		},
	});
}

export async function activateTimeflow(plugin: TimeflowPlugin): Promise<WorkspaceLeaf> {
	const { workspace } = plugin.app;
	let leaf = workspace.getLeavesOfType(VIEW_TYPE_TIMEFLOW)[0];
	if (!leaf) {
		leaf = workspace.getLeaf("tab");
		await leaf.setViewState({ type: VIEW_TYPE_TIMEFLOW, active: true });
	}
	void workspace.revealLeaf(leaf);
	return leaf;
}

function getTimeflowView(plugin: TimeflowPlugin): TimeflowView | null {
	const leaf = plugin.app.workspace.getLeavesOfType(VIEW_TYPE_TIMEFLOW)[0];
	return leaf?.view instanceof TimeflowView ? leaf.view : null;
}
