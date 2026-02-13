# AGENTS.md

Agent-first operating guide for this repository.

## Intent
This project is maintained by both humans and coding agents. Optimize for:
- **Fast orientation** (where things live).
- **Low-token edits** (small, focused patches).
- **Safe changes** (validate impacted areas before commit).
- **Future-proof structure** (domain boundaries over ad-hoc coupling).

## Working model
1. Start with `README.md` and `docs/agent-context.md`.
2. Keep edits scoped to one domain unless the task requires cross-domain work.
3. Prefer existing utilities/hooks/providers before adding new abstractions.
4. When introducing files, place them in an existing domain folder first; create a new domain only if necessary.
5. Update docs when architectural intent changes.

## Source map
- `src/pages/*` route-level views.
- `src/components/*` UI grouped by domain (`guild`, `missions`, `character`, `inventory`, `ui`, ...).
- `src/providers/*` global cross-cutting state.
- `src/hooks/*` reusable state/effect logic.
- `src/data/*` static gameplay data.
- `src/api/*` backend-bound logic.
- `src/utils/*` pure helper logic.
- `src/types/*` shared contracts.

## Agent-first conventions
- Keep functions/components cohesive and small.
- Avoid deep relative imports when a local barrel exists.
- Add concise comments only when intent is not obvious from code.
- Prefer pure, testable helper functions for game calculations.
- Keep naming domain-specific and explicit (e.g., `MissionResultsModal` vs generic names).

## Validation checklist before commit
- Run lint: `npm run lint`
- Run build/type-check: `npm run build`
- If structure changed, regenerate context map: `npm run agent:context`

## Definition of done for structural changes
- New/changed architecture rationale documented in `docs/agent-first.md`.
- `docs/agent-context.md` regenerated.
- `README.md` updated if the developer workflow changed.
