# Timeflow

An [Obsidian](https://obsidian.md/) community plugin that turns your daily Periodic Notes into an infinite vertical **temporal feed** — time as the main way to browse your journal.

## Features

- **Continuous timeline** — daily entries in one scrollable view (newest at the top, no future dates)
- **Mixed stream** — daily and weekly note cards; month/week section markers when weekly notes are off
- **Note cards** — existing daily notes show a title and excerpt; click to open
- **Gap placeholders** — missing days appear as interactive cards with **Create note**
- **Infinite scroll** — scroll down to load older days automatically
- **Live updates** — vault changes (create, modify, rename, delete) refresh the feed; works with any plugin that edits daily notes after creation

## Requirements

- Obsidian **1.5.0** or newer
- [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) or core **Daily notes** enabled, with folder and date format configured
- Optional: **Weekly notes** in Periodic Notes — shown as full cards at the start of each week (replaces week divider markers)

## Usage

1. Enable **Timeflow** in **Settings → Community plugins**.
2. Open the timeline:
   - Click the **history** ribbon icon, or
   - Command palette → **Open timeline**
3. **Jump to today** from the command palette when needed.
4. Click a card to open a note, or **Create note** on a gap day.

Configure the initial date range and markers in **Settings → Timeflow**.

## Development

See [dev.md](dev.md) for local setup (including `make local-dev` to build and sync into your vault).

```bash
make install    # npm install
make local-dev    # build, copy to vault, watch
make test         # vitest
make lint         # eslint
make build        # test + typecheck + production bundle
```

### Project layout

```
src/
  domain/       # Pure timeline logic (tested without Obsidian)
  ports/        # Interfaces (repository, renderer, clock)
  adapters/     # Obsidian and DOM implementations
  presenters/   # Feed orchestration
  views/        # Timeflow ItemView
  commands/     # Plugin commands
tests/          # Vitest unit tests
```

Architecture follows ports/adapters with a thin `main.ts` composition root. See [AGENTS.md](AGENTS.md) for plugin conventions.

## Releasing

1. Bump `version` in `manifest.json` and add an entry to `versions.json`.
2. Run `npm run build` and attach `main.js`, `manifest.json`, and `styles.css` to the GitHub release (tag = version, no `v` prefix).

## License

0-BSD (see [LICENSE](LICENSE)).
