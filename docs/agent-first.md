# Agent-first redesign

This repository is now documented and tooled for **agent-first maintenance**.

## Why
The codebase has many gameplay domains and a large file tree. Agents operate with limited context windows, so we optimize for:
- quick repo orientation,
- deterministic structural summaries,
- minimal cross-domain edits,
- and explicit architectural intent.

## What changed

### 1) Repository operating contract
A root `AGENTS.md` now defines:
- domain map,
- editing rules,
- validation checklist,
- and documentation expectations for structural changes.

### 2) Deterministic context artifact
A new script (`scripts/generate-agent-context.mjs`) generates `docs/agent-context.md`, which contains:
- high-signal folder summaries,
- file counts per folder,
- and representative files.

This gives agents a low-token "map" without scanning the entire project.

### 3) Workflow integration
`package.json` includes `npm run agent:context`, and `README.md` documents this workflow.

## Design principles going forward

1. **Domain-first placement**: add features inside existing domain folders (`missions`, `guild`, `character`, etc.) before creating new top-level concepts.
2. **Separation of concerns**:
   - `data/` for static balancing/configuration,
   - `utils/` for pure computation,
   - `providers/` for app-level state orchestration,
   - `components/` and `pages/` for rendering.
3. **Small diffs by default**: avoid broad rename/restructure unless requested.
4. **Context refresh discipline**: regenerate `docs/agent-context.md` after structural changes.

## Future-proofing opportunities
- Add path aliases for stable imports across domains.
- Add lightweight tests for core mission/training calculations in `src/utils`.
- Introduce a typed "game rules" module to centralize balancing constants currently spread across `src/data`.
