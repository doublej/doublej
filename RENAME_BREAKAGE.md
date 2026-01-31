# Post-Rename Breakage Report

## Summary

After renaming project directories and GitHub repos, several internal references were stale. This document tracks what was found and fixed.

## CRITICAL — Fixed

### 1. `python/image-compressor` (was `avif-maker`)

**Files changed:**
- `pyproject.toml`: URLs `avif-maker` → `image-compressor`, script entry `avif_maker.cli` → `image_compressor.cli`, hatch packages path `src/avif_maker` → `src/image_compressor`
- `Dockerfile`: CMD `avif_maker/foo.py` → `image_compressor/foo.py`
- `mkdocs.yml`: All `avif-maker` → `image-compressor`, `avif_maker` → `image_compressor` (repo_url, site_url, paths, social links)
- `README.md`: All `avif-maker` → `image-compressor` (title, badges, links)
- `src/avif_maker/` → `src/image_compressor/` (directory rename)
- `tests/test_compression.py`: imports `avif_maker` → `image_compressor`
- `tests/test_path_sources.py`: imports + patch paths `avif_maker` → `image_compressor`

### 2. `web/ss-glass` (was `ss_glass`)

**Files changed:**
- `package.json`: name `ss_glass` → `ss-glass`, all GitHub URLs `ss_glass` → `ss-glass`
- `scripts/deploy.sh`: hardcoded path `web/ss_glass/` → `web/ss-glass/`

## MEDIUM — Fixed (cosmetic/docs)

### 3. `python/comfy-ui`
- `pyproject.toml`: name `ComfyUI` → `comfy-ui`

### 4. `python/ss-image-processor` (was `c4d-to-pixi-encoder`)
- `pyproject.toml`: name `c4d-to-pixi-encoder` → `ss-image-processor`
- `README.md`: title `c4d-to-pixi-encoder` → `ss-image-processor`
- **TODO**: Package dir `src/c4d2pixi` still uses old name — rename requires updating all internal imports + CLI entry points

### 5. `python/vr-support-bot-v4`
- `pyproject.toml`: name `vr-support-bot-4` → `vr-support-bot-v4`

### 6. `web/uttertype-website`
- `package.json`: name `utty-website` → `uttertype-website`

### 7. `python/pimpelmees-bot-v2`
- `pyproject.toml`: name `pimpelmees-bot-2` → `pimpelmees-bot-v2`

### 8. `web/personal-www-v3`
- `package.json`: name `personal-www-2` → `personal-www-v3`

## LOW — No action taken (acceptable / intentional)

### 9. `python/marktplaats-search`
- `pyproject.toml`: name `marktplaats_search` — underscores OK for Python packages
- `package.json`: name `marktplaats-search-frontend` — intentional, it's the frontend sub-package

### 10. `python/playlist-researcher`
- `pyproject.toml`: name `playlist_researcher` — underscores OK for Python packages

### 11. `python/haist-qr`
- `package.json`: name `haist-qr-web` — intentional, web frontend portion of multi-stack project

### 12. `python/haist-qr-web-shadcn`
- `package.json`: name `haist-qr-web` — shadcn variant of haist-qr-web, package name doesn't reflect variant

### 13. `python/ezviz_api`
- `package.json`: name `ezviz_api` — matches dir, underscore convention

## Broad scan — not actioned (intentional divergence, archived, or low impact)

Many other projects have dir-vs-name mismatches that are intentional:
- Raycast extensions: `raycast-ext-*` dirs vs short package names (convention)
- Archived projects: `_archive/*` with template names like `nuxt-app`
- Generic dirs: `web/disco` → `web-boilerplate`, `web/terminal` → `amsterdam-house-analysis`
- Abbreviations: `web/the-ultimate-music-quiz` → `melodiq`, `web/create_li_post` → `linkedin-post-image-generator`

Full list of 48 mismatches available on request.
