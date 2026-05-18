# Changelog

## 1.1.0

- Add GitHub artifact attestations for `main.js` and `styles.css` release builds
- Remove `!important` from plugin styles (higher-specificity selectors)

## 1.0.1

- Rename community plugin id to `timeflow-periodic` (avoids conflict with existing **Timeflow** plugin)
- Rename catalog display name to **Timeflow Periodic**
- Use sentence case for the timeline tab title in the UI

## 1.0.0

Initial public release.

- Infinite vertical timeline for daily Periodic Notes (newest first, no future dates)
- Weekly and monthly note cards when enabled in Periodic Notes
- Month/week section markers when period notes are off
- Note cards with plain-text excerpts; optional Dataview TABLE summaries via API
- Gap placeholders with **Create note**
- Infinite scroll for older days, live vault refresh, **Jump to today** command
