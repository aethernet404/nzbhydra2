# FM-017: Recent Search Reuse

Status: blocked Owner: OpenCode
Feature IDs: F-SEARCH-RECENT, F-SEARCH-FORM, F-SEARCH-MEDIA, F-SEARCH-INDEXERS Component IDs: C-CATEGORY-CATALOG API IDs: API-HISTORY-RECENT-SEARCHES, API-SEARCH-EXECUTE Depends on: FM-016, FM-025 Blocks: FM-019, FM-021

## Outcome

The React search page lists recent searches and can refill or immediately repeat their complete supported criteria, including drag-to-refill where the platform supports it.

## Boundary Rationale

Recent retrieval, safe request parsing, criteria transformation, refill/repeat behavior, and accessible drag alternative form one reuse workflow. It follows media/indexer work so it can round-trip the complete form; the full stats history
route is a separate role-protected paging capability.

## Decision Dependencies

- Accepted: ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005.
- Blocking proposed/rejected: None.

## Files Allowed To Modify

- New recent-history API/domain files under `core/ui-react/src/api/**` and `core/ui-react/src/features/search/history/**`
- `core/ui-react/src/features/search/{SearchPage.tsx,SearchPage.test.tsx,workspace/**}`
- `core/src/main/java/org/nzbhydra/searching/db/SearchEntity.java`
- `core/src/main/java/org/nzbhydra/searching/Searcher.java`
- One new additive Flyway migration under `core/src/main/resources/migration/**`
- `shared/mapping/src/main/java/org/nzbhydra/searching/db/SearchEntityTO.java`
- `core/src/test/java/org/nzbhydra/searching/{SearchEntityTest.java,SearcherUnitTest.java}`
- Generated contract artifacts `core/openapi.json` and `core/ui-react/src/api/generated/openapi.ts`; do not edit either manually
- `tests/system/tests/search-history.spec.ts` and `tests/system/tests/search.spec.ts`
- The listed feature/API records only; this task packet and `docs/frontend-migration/STATUS.md`

## Read Scope

The agent may read/search the repository. Context To Read is mandatory starting context. Do not modify files outside Files Allowed To Modify.

## Out Of Scope

- Stats search-history route, saved searches, server history deletion, guided tour, or changes to existing history rows beyond backward-compatible nullable criteria storage
- Changing search execution, indexer eligibility/preselection, age/size default, history ordering/deduplication, authentication, or endpoint path semantics

## Context To Read

- `CONTEXT.md`; ADR-0001 through ADR-0005; FM-015/FM-016/FM-025 handoffs; listed records; FM-019/FM-021 planned packets
- Legacy `search-controller.js`, `search-history-service.js`, recent dropdown template; `SearchRequest`, `Searcher`, `SearchEntity`, `SearchEntityTO`, `History`, `HistoryWeb`; Flyway schema; OpenAPI generation/check scripts; and linked Java/React/system tests

## Acceptance

- `API-HISTORY-RECENT-SEARCHES` is called through shared transport only when no search is active; malformed entries are isolated and loading/empty/failure states are accessible.
- Newly executed searches durably retain and expose nullable `minAge`, `maxAge`, `minSize`, `maxSize`, and selected-indexer criteria through `API-HISTORY-RECENT-SEARCHES`; the additive schema migration leaves existing history usable, and generated OpenAPI/TypeScript contracts represent the response fields without manual generated-file edits.
- Recent entries safely describe category, query/title, identifiers, season/episode, and source. Age, size, and selected indexers are not displayed inline or in a tooltip because the current React dropdown has no established tooltip convention.
- Refill and repeat use one tested transformation into canonical React search state and preserve all present supported criteria. For entries lacking the new fields, the transformation omits those criteria so the existing FM-016 preselection and normal canonical age/size initialization apply rather than inventing literal fallback values; present indexers are reconciled against current eligibility, and repeat executes through the existing submission lifecycle.
- Pointer drag-to-refill works without making drag the only interaction; keyboard/touch users have an equivalent explicit action.
- Focused Java tests prove request-to-entity persistence and entity-to-DTO mapping for all five new criteria plus compatibility when they are absent. React tests cover payload validation, every criteria mapping, unavailable-indexer reconciliation, and absent-field defaults; Playwright creates a non-default age/size/indexer search, observes it in recent history, refills, and repeats it in React while retaining legacy coverage.
- Registry evidence records concrete adoption without claiming full history-route parity.

## Verification

- Relevant Java tests for `Searcher` persistence and `SearchEntity` DTO conversion succeed through an existing IntelliJ run configuration; if no such configuration exists, stop and request one rather than substituting an unapproved command.
- Regenerate `core/openapi.json` through the established Springdoc process, then in `core/ui-react` run `npm run generate:api` and the complete npm quality/build/API/migration chain; generation is reproducible and the generated response contains all five nullable criteria fields.
- From repository root: `python3 misc/run_gui_systemtest.py --runtime wsl -- tests/search.spec.ts tests/search-history.spec.ts` succeeds.
- Run `git diff --check`; inspect status, allowed scope, the single additive Flyway migration, and unexpected generated files.

## Handoff

Use `templates/handoff.md`; fill every section and mark `review` only after verification succeeds.

## Resumed Blocked Handoff

### Outcome

- Focused Java tests now pass and OpenAPI generation plus the React quality chain pass. The final GUI command remains failing: after a configured search the recent-history request returns HTTP 200 but lacks the newly created `recent criteria` entry, so React has no Refill action.

### Files Modified

- Task-attributable implementation paths are limited to the packet allowlist: the listed `SearchEntity`, `Searcher`, DTO, focused Java tests, additive `V7__SEARCH_CRITERIA.sql`, React recent-search files, `SearchPage`, `SearchWorkspace`, focused React tests, and `tests/system/tests/search.spec.ts`.
- Scope confirmation: no task-attributable implementation change is outside `Files Allowed To Modify`; supplied ADR/planning paths are preserved and not claimed as implementation work.

### Toolchain

- Node: not recorded for final verification.
- Package manager: not recorded for final verification.
- Other material tools: IntelliJ JUnit configuration `Run all tests in core` did not return within 300 seconds.

### Verification Evidence

| Working directory | Command | Result |
|---|---|---|
| `core/ui-react` | `npm run typecheck && npm run test -- --run` | Passed before later test-formatting corrections: 25 files / 114 tests. Not final evidence. |
| IDE | `Run all tests in core` | Blocked: existing configuration exceeded the 300-second MCP wait and left a Java test process running; no focused existing `Searcher`/`SearchEntity` configuration is available. |
| IDE | `SearcherUnitTest` | Passed: 5 passed, 3 skipped, 0 failed. |
| IDE | `SearchEntityTest` | Passed: 3 passed, 0 failed. |
| repository root | `mvn -pl core org.springdoc:springdoc-openapi-maven-plugin:generate` | Passed; `core/openapi.json` regenerated and includes all five criteria fields. |
| `core/ui-react` | `npm run generate:api` twice, then `git diff --exit-code -- src/api/generated/openapi.ts` | Passed; generated types contain all five fields and are reproducible. |
| `core/ui-react` | `npm run typecheck && npm run lint && npm run format:check && npm run test -- --run && npm run build && npm run check:api && npm run validate:migration` | Passed: 25 files / 114 tests; existing non-failing warnings remain. |
| repository root | `python3 misc/run_gui_systemtest.py --runtime wsl -- tests/search.spec.ts tests/search-history.spec.ts` | Failed three times: 11/12 passed; the new recent-search test cannot find Refill. The endpoint response is 200 but does not contain the newly executed search. |
| repository root | `git diff --check` | Passed after the latest task-owned edit. |

### Verification Basis

- Baseline: `0b9940f78414a98be2ade79c362384ed088a98f1`.
- Command coverage: no final verification basis exists because the required GUI verification fails and `tests/system/tests/search.spec.ts` changed after the successful React chain.
- File-content manifest: not recorded; final verification is pending.
- Completed after the last change to each command's listed files: no.
- Task-owned changes after verification: `tests/system/tests/search.spec.ts` changed for GUI diagnosis; all affected verification must be rerun after a fix.

### Dependency Decisions

- Runtime dependencies: None.
- Development dependencies: None.

### Architecture Decisions

- ADR-0001 through ADR-0005 were read and followed; ADR-0005's nullable storage/response and default-on-absence criteria behavior is implemented locally.
- ADR REQUIRED: None.

### Assumptions

- `SearchRequest`'s optional criteria and indexer set are the authoritative newly executed criteria, and `valuesFromSearch` provides the prescribed absent-field defaults.

### Temporary Exceptions And Debt

- None.

### Registry And Documentation Updates

- None beyond lifecycle state; supplied API/ADR planning refinements are preserved as pre-invocation work.

### Follow-Up Work

- Diagnose why `POST /internalapi/history/searches/forsearching` omits the just-persisted search in the managed GUI runtime despite the successful search and 200 response. Rerun the React quality chain and GUI command after any implementation/test correction. The task may not move to review until the GUI run passes.
