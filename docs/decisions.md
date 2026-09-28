# Decisions

## 2026-09-28 — Concept first, by explicit owner instruction

The owner requested an explanatory repository and an animated, interactive website, explicitly saying not to begin creating the actual application. That supersedes the attached files' earlier demand to implement the complete Windows MVP during this phase.

All original files are retained unchanged under `specification/`. The root `AGENTS.md` scopes current work to the concept demo. We do not silently rewrite the original acceptance contract or claim its desktop gates have passed.

## Website architecture

Use plain HTML, CSS, and ES modules. A static GitHub Pages site fits this demonstration, requires no backend or API key, and can bundle all of its own assets. Application state is local to this browser. Production encryption and real tenant data are intentionally absent.

The visual direction is restrained green, warm paper, peach accents, clear typography, and a workspace illustration built from actual interface elements. No third-party brand logo or font was supplied. Use system fonts and a custom CoWorker mark; state that this is not an official Atea product.

Use pausable hero animation, reduced-motion support, preparation stages, dialogs, and persistent editable state. Animations explain the journey. They are not proof that external operations occurred.

## Coding extension and profiles

The latest brief explicitly adds low-to-high resource preferences, advanced controls, and a safe coding-agent concept that can request internet access. Show these as proposed features. They extend the original narrower scope; actual execution remains deferred pending an isolation design. Offline Lock overrides grants.

## Documents and slides

The concept editor provides real browser editing and Markdown downloads. It does not falsely label a text file as `.docx` or `.pptx`. Native editable Office output remains a requirement of the future desktop app. Scripted sample content is labelled wherever created or shown.

## Savings

Do not use unverified Microsoft pricing or invented Atea seat numbers. Supply explicitly illustrative inputs that testers can change, subtract rollout/support cost, and explain that task substitution alone does not reduce licence spend.

## Hosting

Publish only `site/`, not source specifications or repository documentation. The user authorized a GitHub-hosted test website; repository visibility stays private. GitHub Pages is not automatically private because a repository is private. The published demo contains only public-safe fictional material and concept copy. No paid-plan purchase or repository visibility change is authorized.

The connected GitHub tools can commit files and create branches but do not expose Pages administration. Creating a website-only `gh-pages` branch triggered GitHub's native Pages setup and deployment. Its build/deploy jobs succeeded, the live site returned HTTP 200, and served assets were compared against the tested source. Use that working branch publication configuration; main has a validation-only workflow. The earlier custom deployment attempt failed before branch-based enablement and is recorded in the status report.
