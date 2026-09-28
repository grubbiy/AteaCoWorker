# Coworker — AI build kit

Prepared for Vegard's Atea Local AI Hackathon, 2026-09-26.

This folder contains an implementation specification, not application source code or a compiled application.

## Files

| File | Purpose |
| --- | --- |
| `master-prompt.md` | Complete implementation assignment, architecture, workflows, security boundaries, testing, milestones, and primary-source references. |
| `goal.md` | Product mission, priority, exclusions, and measurable acceptance contract. |
| `agent.md` | Coding-agent operating rules and the local runtime AI's required behavior. |
| `AGENTS.md` | Small entry point for coding tools that discover instructions using this filename. |

## Use

Copy these files into the root of the repository where the coding agent will build Coworker. For an existing repository, preserve any existing instructions and merge the entry point rather than blindly overwriting it.

Give the agent this message:

```text
Read master-prompt.md, goal.md, and agent.md in this repository.
Build Coworker according to those files; do not merely write another plan.
Inspect the existing repository and actual Windows guest hardware first.
Begin with Milestone 0 and the local-file offline vertical slice, then add
real, permission-aware SharePoint preparation. Run tests and keep
implementation status/evidence in docs/status.md.
Do not use real company data, grant permissions, or alter security settings
without authorization. When an external integration is blocked, continue
with independent work and state exactly what remains unverified.
```

## Key assumptions

The first target is a standalone Windows 11 desktop app, including Windows ARM64 inside Parallels. Local inference must run inside that Windows environment. A European local model is preferred; the spec identifies a verified Mistral starting candidate but requires actual runtime/asset compatibility testing.

The MVP includes project packs, citations, notes, supported Word/PowerPoint creation and edits, and read-only source refresh. Direct Outlook publishing, a full Office replacement, fine-tuning, and computer-wide automation are deferred.

Microsoft sign-in/discovery needs an authorized app registration and tenant consent. Local-file development and the offline demo do not require Microsoft access. Live SharePoint integration is not considered verified until it has actually been tested.

The master prompt includes primary-source references checked on 2026-09-26. Versions, model artifacts, permissions, and runtime flags must still be verified and pinned by the implementation agent.
