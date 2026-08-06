# Migration Tasks

Task packets are permanent, bounded work contracts. The coordinator creates tasks from `templates/task.md`, promotes them from `planned` to `ready` when dependencies are complete, and lists only immediately relevant tasks in `../STATUS.md`.

Implementation agents may update their assigned task, linked registry records, and allowed implementation files. They must not create new tasks or silently broaden allowed paths. Proposed follow-up work belongs in the handoff.

The implementation agent marks a completed implementation `review`. Only the coordinator marks it `done` after review findings are resolved.
