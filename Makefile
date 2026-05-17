-include .env
export

# Make does not expand ~; resolve via the shell.
OBSIDIAN_VAULT := $(shell echo $(OBSIDIAN_VAULT))

PLUGIN_ID := timeflow-periodic
ARTIFACTS := main.js manifest.json styles.css
PLUGIN_DEST := $(OBSIDIAN_VAULT)/.obsidian/plugins/$(PLUGIN_ID)
DEMO_VAULT := $(CURDIR)/demo-vault
DEMO_PLUGIN_DEST := $(DEMO_VAULT)/.obsidian/plugins/$(PLUGIN_ID)

.PHONY: help install bundle sync sync-demo check-vault local-dev dev build test lint check clean

help:
	@echo "make local-dev   build + sync to vault + watch (set OBSIDIAN_VAULT in .env)"
	@echo "make sync        copy artifacts → \$$OBSIDIAN_VAULT/.obsidian/plugins/timeflow-periodic"
	@echo "make sync-demo   copy artifacts → demo-vault/.obsidian/plugins/timeflow-periodic"
	@echo "make install     npm install"
	@echo "make dev         watch → main.js (no copy)"
	@echo "make build       test + production bundle"
	@echo "make test        vitest"
	@echo "make lint        eslint"
	@echo "make check       lint + test"
	@echo "make clean       remove main.js"

install:
	npm install

check-vault:
	@test -n "$(OBSIDIAN_VAULT)" || ( \
		echo "Set OBSIDIAN_VAULT in .env (see .env.example) or:"; \
		echo "  make local-dev OBSIDIAN_VAULT=/path/to/your/vault"; \
		exit 1)

bundle:
	npm run bundle

sync: check-vault
	@mkdir -p "$(PLUGIN_DEST)"
	@cp -f $(ARTIFACTS) "$(PLUGIN_DEST)/"
	@echo "→ $(PLUGIN_DEST)"

sync-demo: bundle
	@mkdir -p "$(DEMO_PLUGIN_DEST)"
	@cp -f $(ARTIFACTS) "$(DEMO_PLUGIN_DEST)/"
	@echo "→ $(DEMO_PLUGIN_DEST)"

local-dev: install check-vault bundle sync
	OBSIDIAN_PLUGIN_DIR="$(PLUGIN_DEST)" npm run dev

dev:
	npm run dev

build:
	npm run build

test:
	npm test

lint:
	npm run lint

check: lint test

clean:
	rm -f main.js
