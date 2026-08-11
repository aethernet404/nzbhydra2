# FM-010: Search Workspace And Core Results

Status: planned Owner:
Feature IDs: F-SEARCH-FORM, F-SEARCH-RESULTS Component IDs: C-CATEGORY-CATALOG, C-RESULT-TABLE API IDs: API-SEARCH-EXECUTE Depends on: FM-005, FM-006, FM-007, FM-009 Blocks: FM-011, FM-012, FM-013, FM-014

## Outcome

The React `/` route provides a usable basic search: configured category defaults and numeric criteria are URL-backed, a valid request executes through the shared transport, and core results render with intentional success, empty, failure,
and malformed-data states.

## Boundary Rationale

The form, request transformation, response validation, and first results presentation are one executable user workflow. Category lookup is shared with future configuration work, so this task establishes `C-CATEGORY-CATALOG`; richer media,
indexer-selection, history, live-progress, filtering, grouping, paging, and downloads remain separate capabilities.

## Files Allowed To Modify

- `core/ui-react/package.json` and `core/ui-react/package-lock.json`, only to add exact production dependencies `react-hook-form` and `zod` compatible with the declared React and TypeScript toolchain
- `core/ui-react/src/router.tsx` and `core/ui-react/src/router.test.tsx`
- `core/ui-react/src/api/search.ts` and `core/ui-react/src/api/search.test.ts`
- `core/ui-react/src/domain/categories/**`
- `core/ui-react/src/features/search/{SearchPage.tsx,SearchPage.test.tsx,workspace/**,results/**}`
- `tests/system/tests/search.spec.ts`
- The `F-SEARCH-FORM`, `F-SEARCH-RESULTS`, `C-CATEGORY-CATALOG`, `C-RESULT-TABLE`, and `API-SEARCH-EXECUTE` records only
- `docs/frontend-migration/STATUS.md` and this task packet

## Read Scope

The agent may read and search the entire repository. Context To Read is mandatory starting context, not a read allowlist. Do not modify files outside Files Allowed To Modify; escalate the exact path and reason if one is required.

## Out Of Scope

- Autocomplete/identifier refinement, selectable indexers, recent searches, guided tour, STOMP progress, paging, saved searches, sorting/filtering, grouping/selection, and downloads
- Spring mappings, generated OpenAPI types, and changes to the shared transport

## Context To Read

- `CONTEXT.md`, `ADR-0001` through `ADR-0004`, and FM-005 through FM-009 handoffs
- `F-SEARCH-FORM`, `F-SEARCH-RESULTS`, `C-CATEGORY-CATALOG`, `C-RESULT-TABLE`, and `API-SEARCH-EXECUTE`
- `core/ui-src/js/{categories-service,search-controller,search-request-service,search-service,search-results-controller}.js`
- `core/ui-src/html/{states/search.html,states/search-results.html,directives/search-result.html}` and `SearchWeb`

## Acceptance

- The canonical base-aware `/` React route replaces only its migration placeholder and preserves the legacy switch and Spring role protection.
- The form restores and updates valid query, category, age, and size criteria through canonical URL semantics; category defaults and size presets use validated `C-CATEGORY-CATALOG` data from bootstrap safe configuration.
- Submit generates a numeric request ID, uses `API-SEARCH-EXECUTE` through `C-API-TRANSPORT`, sends `loadAll: false`, and prevents an empty configured-indexer selection from issuing a search. Rich indexer controls remain absent.
- Core results preserve `search-query`, `search-submit`, `search-category-control`, `search-category-option-*`, `search-results`, `indexer-limit-warnings`, `search-results-summary`, `search-results-table`, `search-result-row`, and
  `search-result-title` selectors where rendered.
- Response-boundary validation intentionally handles request errors, no picked indexers, all-indexer failure, no results, quota warnings, rejected-result counts, and malformed or titleless entries without breaking rendering.
- Focused component tests cover URL/form/request transformation and every result state. Playwright exercises a React-selected shell with mocked indexers, confirms the request and displayed results, and compares preserved selectors with
  legacy at desktop and 390 px widths.
- Registry records identify concrete target/test evidence and no wider parity is claimed.

## Verification

- In `core/ui-react`: `npm ci && npm run typecheck && npm run lint && npm run format:check && npm run test -- --run && npm run build && npm run check:api && npm run validate:migration` succeeds.
- From repository root: `python3 misc/run_gui_systemtest.py --runtime wsl -- tests/search.spec.ts` succeeds after its React coverage is added.
- From repository root: `git diff --check` and `git status --short`; inspect all task-owned paths, confirm scope compliance, and report unexpected generated files.

## Handoff

### Result

Record completed user-visible behavior and excluded parity work.

### Verification

Use `templates/handoff.md`; record every command, result, scope check, and required SHA-256 verification basis.

### Decisions

Record category/default, URL, and response-validation decisions.

### Dependency/toolchain decisions

Record dependencies, versions, and actual Node/npm versions, or `None`.

### Assumptions

Record material contract assumptions, or `None`.

### Unresolved issues

Record intentionally deferred or blocked work, or `None`.

### Follow-up

Record bounded follow-up proposals, or `None`.
