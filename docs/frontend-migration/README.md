# Frontend Migration

This directory is the durable coordination point for replacing the AngularJS UI with React. Conversation history is not part of the migration context.

## Reading Order

Every migration agent reads:

1. `/AGENTS.md`
2. This file
3. The assigned file under `tasks/`
4. Only the context, decisions, and registry entries linked by that task

Agents editing `core/ui-react` also read `/core/ui-react/AGENTS.md`.

## Sources Of Truth

| Information                                | Authoritative file   |
|--------------------------------------------|----------------------|
| Durable product and deployment constraints | `CONTEXT.md`         |
| Active and next work                       | `STATUS.md`          |
| User-visible parity                        | `FEATURES.yaml`      |
| Shared target components                   | `COMPONENTS.yaml`    |
| Frontend API adoption                      | `APIS.yaml`          |
| Consequential decisions                    | `decisions/ADR-*.md` |
| Task scope, acceptance, and handoff        | `tasks/FM-*.md`      |

Do not duplicate an authoritative fact in another document. Link its stable ID instead.

## Workflow

Task states are `planned`, `ready`, `in_progress`, `review`, `blocked`, and `done`.

1. The coordinator promotes a dependency-free `planned` task to `ready` and selects it in `STATUS.md`.
2. The implementation agent records its owner and marks it `in_progress` before editing implementation files.
3. The agent stays within the task's allowed files and acceptance criteria.
4. The agent searches `COMPONENTS.yaml` and `APIS.yaml` before introducing shared code.
5. The agent runs the task's verification and records concise evidence in its handoff.
6. The agent updates affected registries and marks the task `review` in the same change.
7. A fresh agent reviews the change against the task and linked feature records.
8. The coordinator marks the task `done` after review findings are resolved.

Only the coordinator creates tasks or changes task dependencies. Implementation agents add a follow-up proposal to their handoff instead of expanding scope.

## Registry Rules

- Feature IDs use `F-<AREA>-<CAPABILITY>`.
- Component IDs use `C-<RESPONSIBILITY>`.
- API IDs use `API-<AREA>-<OPERATION>`.
- Task IDs use `FM-NNN`.
- Decisions use `ADR-NNNN`.
- IDs are permanent. Superseded records remain present and point to their replacement.
- A shared component or API wrapper must have a registry ID before it is implemented.
- Existing `data-testid` values are compatibility contracts unless a task explicitly replaces them.

## Context Discipline

- Keep task packets below roughly 100 lines.
- Do not paste logs, source files, schemas, or investigation transcripts into migration documents.
- Keep completed task files in place, but do not load them for unrelated work.
- Keep `STATUS.md` limited to active, blocked, review-ready, and immediately next work.
- Verify legacy behavior from source and tests; older planning documents may be stale.
- Use Git history for chronology.

## Parallel Work

The initial workflow is sequential. The same task ownership and allowed-file rules support future worktrees: concurrent tasks must not own the same implementation files or registry records.
