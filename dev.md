# Development

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- Obsidian 1.5.0+

## Local plugin install

1. Copy `.env.example` to `.env` and set `OBSIDIAN_VAULT` to your vault root.
2. From the repo root:

```bash
make install
make local-dev   # build, sync to vault, watch for changes
```

3. In Obsidian: **Settings → Community plugins** → enable **Timeflow** → reload.

Artifacts sync to `$OBSIDIAN_VAULT/.obsidian/plugins/timeflow-periodic/` (`main.js`, `manifest.json`, `styles.css`).

## Demo vault (screenshots)

See [demo-vault/SETUP.md](demo-vault/SETUP.md). Quick path:

```bash
make install
make sync-demo
```

Open the `demo-vault/` folder in Obsidian, enable **Periodic Notes** and **Timeflow**, then capture assets into [images/](images/).

## Commands

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `make test`      | Vitest                               |
| `make lint`      | ESLint                               |
| `make build`     | test + typecheck + production bundle |
| `make sync`      | Copy artifacts to `OBSIDIAN_VAULT`   |
| `make sync-demo` | Copy artifacts to `demo-vault/`      |

## Release

See [RELEASE.md](RELEASE.md) and [CHANGELOG.md](CHANGELOG.md).
