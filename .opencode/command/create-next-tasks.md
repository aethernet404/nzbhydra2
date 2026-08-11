---
description: Create a cohesive batch of the next consecutive FM migration task packets.
agent: migration-task-designer
---

Parse `$ARGUMENTS` as exactly one positive integer. Reject missing, non-integer, non-positive, or extra arguments before editing. Create that many next consecutive FM task packets. Determine the next ID from the highest existing task ID; do
not overwrite or renumber existing packets.

Design the batch in dependency order from the migration inventories, ADRs, completed handoffs, legacy sources, existing tests, and planned work. Each task must be a substantial independently reviewable vertical capability, not a source-file
or layer-sized fragment. Keep atomically necessary route, UI, transport, focused-test, and registry work together; split only at genuine dependency, independent capability, separate runtime boundary, or unresolved contract. Do not combine
unrelated capabilities merely to increase task size.

Create each packet from `docs/frontend-migration/templates/task.md` and self-review every packet. In `docs/frontend-migration/STATUS.md`, list only the earliest dependency-ready task under `Upcoming`; leave later batch members as planned
packets without adding them to the status file. Report the new IDs, dependency order, boundary rationale, and any architectural questions that require human input.
