# FM-015: Search Media Refinement

Status: planned Owner:
Feature IDs: F-SEARCH-FORM, F-SEARCH-MEDIA Component IDs: C-CATEGORY-CATALOG API IDs: API-SEARCH-EXECUTE, API-SEARCH-AUTOCOMPLETE, API-SEARCH-EMBY-SERIES, API-SEARCH-EMBY-MOVIE Depends on: FM-014 Blocks: FM-017, FM-019

## Outcome

React movie and TV searches support accessible autocomplete, identifier-backed selection, additional title terms, season/episode criteria, and configured Emby availability feedback through canonical search URLs.

## Boundary Rationale

Autocomplete selection, identifier/request transformation, media-only refinement fields, URL restoration, and result availability all describe one selected media search. Indexer choice is independent of media identity; recent/saved searches
follow after this task establishes the complete reusable media criteria.

## Decision Dependencies

- Accepted: ADR-0001, ADR-0002, ADR-0003, ADR-0004.
- Blocking proposed/rejected: None.

## Files Allowed To Modify

- `core/ui-react/src/api/search.ts`, `core/ui-react/src/api/search.test.ts`, and new focused media API files under `core/ui-react/src/api/**`
- `core/ui-react/src/features/search/{SearchPage.tsx,SearchPage.test.tsx,workspace/**,results/**}`
- `tests/system/tests/search.spec.ts`
- The listed feature/API records only; this task packet and `docs/frontend-migration/STATUS.md`

## Read Scope

The agent may read and search the entire repository. Context To Read is mandatory starting context, not a read allowlist. Do not modify files outside Files Allowed To Modify.

## Out Of Scope

- Indexer-selection controls, recent/saved searches, guided tour, paging, or new media providers/backend endpoints

## Context To Read

- `CONTEXT.md`; accepted ADRs; FM-010, FM-012, and FM-014 handoffs; listed registry records
- `core/ui-src/js/search-controller.js`, relevant search/result templates, `SearchWeb`, autocomplete/Emby web contracts, generated types, and `tests/system/tests/search.spec.ts`

## Acceptance

- Movie/TV categories debounce and request `API-SEARCH-AUTOCOMPLETE`; loading, empty, malformed, and failure states are intentional and keyboard/screen-reader operable while preserving `additional-query`, `autocomplete-popup`, and
  `autocomplete-option` selectors.
- Selecting or clearing a suggestion coherently controls title, additional query, provider IDs, season/episode visibility, focus, and canonical URL state; editing a selected title clears stale identifiers.
- Search requests preserve supported TMDB, IMDb, TVDB, TVMaze/TVRage identifiers and media criteria through the validated API boundary without changing plain-search behavior.
- Configured Emby checks use the selected applicable ID and show non-blocking available/unavailable/error behavior without delaying authoritative search results.
- Focused tests cover transformations, stale-response isolation, keyboard selection, URL restore/repeat semantics, and Emby gating; Playwright validates deterministic movie and TV flows in React and retained legacy coverage.
- Registry evidence records concrete targets/tests without claiming indexer, history, or saved-search parity.

## Verification

- In `core/ui-react`: `npm ci && npm run typecheck && npm run lint && npm run format:check && npm run test -- --run && npm run build && npm run check:api && npm run validate:migration` succeeds.
- From repository root: `python3 misc/run_gui_systemtest.py --runtime wsl -- tests/search.spec.ts` succeeds.
- Run `git diff --check` and inspect `git status --short`; confirm only allowed paths and no unexpected generated files.

## Handoff

At handoff, use `templates/handoff.md`, fill every section, and mark this task `review` only after required verification succeeds.
