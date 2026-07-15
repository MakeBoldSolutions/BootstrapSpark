---
command: bold.plan
subcommand: init
description: Detect repo entry path (migrate / discover / greenfield) and route accordingly.
collector: collect-entry-path-context
args: []
---

# bold.plan init

Detect which of three entry paths applies, then route. All three converge on identical artifacts: a ratified backbone, a populated project genome, and a seeded `system/` taxonomy.

## Definition of Done

Done when a ratified backbone, a populated `project.json`, and a seeded `system/` all exist — regardless of which entry path produced them. For migrate specifically, done also requires meeting the acceptance bar below; for discover, route to `bold.plan discover` and its own Definition of Done applies.

## Detect entry path

Read the collector output.

- `has_bold_docs` true → already initialized. Report status instead of re-running any path; if the human wants to redo it, that's a deliberate re-init, not entry-path detection's job.
- `has_devspark` or `has_documentation_dir` true → **Migrate**
- `total_files` ≤ 5 → **Greenfield**. A bare scaffold (`README.md`, `LICENSE`, `.gitignore`, maybe a CI stub) still reads as empty; this is a stated rule, not a judgment call, so the boundary doesn't shift run to run — a real repo with actual source and tooling clears it within a handful of files (validated against synthetic fixtures: a true greenfield scaffold sits at 3, a small real codebase already at 9).
- Otherwise → **Discover**

## Migrate

DevSpark migration is brownfield discovery with a richer evidence source: a DevSpark repo is a fully documented brownfield in the predecessor's dialect. A real DevSpark install has usually grown well beyond its original template — don't assume the collector's named fields are the whole story.

1. **Collect** — run `collect-devspark-inventory`. Beyond its named fields (constitution, team scripts, spec dirs, multi-app config), it also reports a generic catch-all of anything under `.documentation/` it doesn't specifically recognize, whether a root `.archive/` already exists, legacy per-host adapter file counts (`.claude/commands/`, `.github/agents/`, `.github/prompts/`, `agents-registry.json`), and a tracked-file sweep for lingering "devspark" text. Every catch-all entry needs a classification in the report below — none of them are pre-decided.
2. **Reason** — produce a migration report following the shape in `templates/migration-report-template.md` (inventory table, "found beyond the standard mapping" table, proposed mapping table, numbered items needing a call, acceptance bar, execution order) — this is a structural template, not boilerplate to copy verbatim; every row must reflect what the collector and a manual cross-check actually found in this repo. Map DevSpark artifacts to Bold equivalents per bold-tool-plan.md §10.4's table:
   - Constitution → `backbone.md`, restated *tersely* (`source: migrated(constitution.md)`, MANDATORY→`enforced` else `adopting`) with full sub-rule detail moved to a `system/` doc, not left in the backbone.
   - Team scripts → `bold-docs/overrides/`, with a note that they likely don't match any current Bold script name (DevSpark's command surface is different) — flag for review, don't imply they're wired up.
   - Feature dirs → `features/` (in-flight) or `.archive/` (complete, harvested on entry).
   - Legacy per-host adapter files and `agents-registry.json` → deleted (superseded by Bold's own generated adapters + `AGENTS.md`).
   - A pre-existing root `.archive/` → adopt in place, merge its history into the new `index.md`; don't overwrite it as a conflict.
   - Every catch-all `.documentation/` entry → classify as durable (`bold-docs/system/`) or historical (`.archive/`) — it's real project content organized under a DevSpark-created folder name, not automatically DevSpark tooling.
   - Any editor/tooling config referencing DevSpark (`.vscode/settings.json`, `.claude/settings.local.json`, similar) → update to Bold equivalents or drop the DevSpark-specific entries only.
3. **Ratify** — human confirms the report; it becomes the contract.
4. **Execute** — write the transformed artifacts, verify them (re-run the collector's text sweep to confirm the acceptance bar below), then delete `.devspark/` and legacy files. The deletion is the last step, never the first.

**Acceptance bar**: after migration, the repo must be indistinguishable from one born on Bold — nothing in the finished repo carries legacy DevSpark naming or structure. A lingering historical mention in `.archive/` or a provenance note (`source: migrated(...)`) doesn't violate this; a live reference in an active file does.

## Discover

Route to `bold.plan discover`.

## Greenfield

1. **Starter/kit selection** — offer the catalog (`source/starters/`, `source/kits/`); a kit is a preset composition (starter + stacks + flavors + answer defaults), layers are the power-user path for picking stacks/flavors individually.
2. **Stack detection** from existing files, to suggest (not force) a starting selection.
3. **Compose** — run `compose-layers` with the chosen starter (+ stacks/flavors, or the chosen kit). **If it reports any `conflicts`, halt and ask**: name the colliding question `id` and which layers both defined it — never silently pick one (bold-tool-plan.md §12.3, "conflicts halt and ask, never silent last-wins"). This is the one thing in this step that isn't a judgment call.
4. **Questionnaire** — ask every question in `composed_questions`, in order, skipping any whose `when` names a layer not in this composition. For each, the effective default is `kit_answer_defaults[id]` if present, else the question's own `default` — Enter-mashing through all of them still yields a valid project. Write each answer into `project.json` under the genome key its `maps_to` names, with `source: asked`.
5. **Generate** a provenance-annotated backbone (cite each `backbone_fragments` entry's `source` layer), a seeded `system/`, and `AGENTS.md`.
