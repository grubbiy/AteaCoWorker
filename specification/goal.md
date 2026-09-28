# Coworker — Product goal and acceptance contract

Version: 1.0  
Prepared: 2026-09-26  
Owner: Vegard / Atea Local AI Hackathon  
Status: Build specification; not a claim that the application is implemented.

## 1. The goal

Build **Coworker**, an offline-first Windows desktop workspace that helps Atea employees and customers turn their existing project knowledge into useful work: answers, notes, Word documents, and PowerPoint presentations.

The distinguishing feature is **Prepare for offline**. While connected, a user identifies what they will work on and selects authorized SharePoint locations and/or local project files. Coworker proposes a bounded set of relevant supporting documents, explains the selections, and downloads approved material into a protected local project pack. After preparation, the user can disconnect, restart the app, and continue working with a local AI model and verifiable references to the downloaded material.

**Product promise:** Prepare your project while online. Keep working with its knowledge when you are not.

This is not a promise that all company information is downloaded, that every relevant document can be found, or that offline copies remain current forever.

## 2. Primary scenario: the eight-hour train journey

An Atea consultant is preparing a customer workshop. The consultant has an initial brief and knows which project folder and approved reference libraries are relevant.

Before departure, the consultant creates a project, adds the brief, selects permitted sources, and clicks **Prepare for offline**. Coworker proposes supporting documents, shows relevance reasons and missing topics, respects a download budget, and waits for approval. The app downloads and indexes the chosen material and performs an offline-readiness check.

On the train, with networking disabled, the consultant asks questions with source citations, writes a workshop plan, rewrites sections, and creates an editable presentation. Notes and drafts persist locally through app restarts. Clicking a citation opens the cached passage, not a web page.

After reconnecting, the consultant explicitly refreshes the pack, reviews changed or unavailable sources, and decides whether to refresh affected drafts. The MVP does not automatically upload anything or overwrite a SharePoint original.

## 3. Who this serves

- Atea employees preparing proposals, workshops, handovers, and internal material.
- Customer employees doing similar project work in environments with unreliable or restricted connectivity.
- Field consultants who need a selected body of knowledge rather than an entire corporate document library.

A commercial product or enterprise deployment is a later outcome. The hackathon deliverable must first demonstrate one credible end-to-end workflow.

## 4. Non-negotiable properties

| ID | Requirement |
| --- | --- |
| G01 | Chat, retrieval, drafting, editing, and export work without internet after explicit preparation. |
| G02 | All AI inference, embeddings, and reranking are local. There is no silent cloud fallback. |
| G03 | Online SharePoint discovery uses the signed-in user's approved access and a separately enforced project scope. |
| G04 | The user reviews the proposed pack before bulk downloads; discovery also has visible scope and transfer limits. |
| G05 | Answers about project facts provide citations that resolve to exact cached versions and meaningful locations. |
| G06 | The app produces real, editable `.docx` and `.pptx` files; a chat answer or screenshot is not an export. |
| G07 | Existing files are edited through explicit, supported operations on copies, with review and undo. |
| G08 | The app shows missing sources, unsupported content, stale snapshots, denied downloads, and incomplete preparation honestly. |
| G09 | Project storage is protected; sensitive text must not leak into plaintext indexes, logs, or hidden sync folders. |
| G10 | The app runs on the actual Windows 11 guest environment. It must not assume access to host hardware. |
| G11 | The first model choice favors a European provider and commercially usable open weights, subject to license and runtime checks. |
| G12 | Demo fixtures are clearly synthetic; tests, benchmarks, and tenant integration are never presented as verified unless actually run. |

## 5. Scope and priorities

### P0 — The complete hackathon MVP

1. A Windows desktop workspace with projects, sources, chat, notes, documents, presentations, model settings, and visible offline status.
2. A protected local store, local file import, a small synthetic corpus, and at least one working local inference configuration.
3. Microsoft work-account connection, explicit source selection, bounded document discovery, proposal review, download, and local indexing.
4. A readiness report that distinguishes **Ready**, **Ready with gaps**, and **Not ready**.
5. Offline, project-scoped question answering with locally resolvable citations and honest abstention when evidence is missing.
6. Notes and a structured Word drafting surface: create a draft, rewrite selected supported content, review a change, undo, and export a valid editable `.docx`.
7. A template-based slide composer: generate an outline, create editable slides and speaker notes, revise a supported text element, reorder slides, and export a valid editable `.pptx`.
8. Manual refresh after reconnecting; changed/deleted/unavailable sources are reconciled without overwriting local work.
9. Offline restart, denied-egress, data-isolation, document-integrity, and cancellation tests; a reproducible demo and setup guide.

Implement a local-file vertical slice first, then the real SharePoint connector. A local-only demo is useful progress, but it is **not** completion of the SharePoint differentiator. Live connector acceptance requires a test tenant, app registration, consent, and actual testing; otherwise clearly label it unverified.

### P1 — Only after P0 works

- Local semantic embeddings and optional reranking if they improve measured retrieval; lexical retrieval remains a supported fallback.
- Stronger model profiles and a more refined hardware benchmark/selection experience.
- More document structures, imported customer templates, and improved layout validation.
- A local task list and explicit `.ics` calendar export.
- Carefully scoped, approved SharePoint publishing with conflict handling, as a separately secured capability.

### P2 — Explicitly deferred

- Direct Outlook synchronization, meeting invitations, and calendar write permissions.
- A PowerPoint or Word add-in; the MVP is a standalone desktop app.
- General computer control, screen recording, microphone recording, browser automation, and activity surveillance.
- Tenant-wide crawling, background collection of unrelated files, or cross-customer retrieval.
- Fine-tuning on company documents; first use retrieval, templates, structured outputs, and evaluation.
- Full Word/PowerPoint replacement, arbitrary perfect round-trip editing, advanced animations, complex charts, SmartArt, macros, and password-protected/rights-managed document processing.
- A cloud backend, cloud AI inference, mandatory SaaS subscription, multi-user collaboration, or a hosted vector database.

Do not implement P1/P2 while a P0 acceptance gate is broken.

## 6. Architectural boundaries

The initial target is **Windows 11 on x64 and ARM64**, including development inside a Windows 11 Parallels VM. Detect the guest architecture, available memory, actual accelerator support, and battery state. Use a native CPU inference path when no tested guest accelerator is available.

A proposed default implementation is a .NET 10 WPF desktop app, deterministic Open XML document operations, a local SQLite-backed protected store, and a supervised local `llama.cpp` runtime. The master prompt explains the exact boundaries. These are engineering choices, not requirements to retain an unsuitable dependency at all costs. Record and test any justified substitution.

Keep four permissions separate:

1. Permission to sign in and read a remote item.
2. Application scope allowing that item into this project.
3. Organizational permission to retain and process an offline copy.
4. User approval to export or publish derived work.

A cloud read grant does not automatically satisfy the other three. A folder selector is not a substitute for server-side permissions.

## 7. The offline contract

**Offline means:** after setup and preparation, the app does not need an external network connection to unlock an eligible local pack, open local drafts, search, answer, edit, or export. It does not silently attempt telemetry, login renewal, remote fonts, model downloads, remote images, or cloud inference. Explicit Offline Lock blocks app-originated external traffic even when the machine is connected.

**Online preparation means:** the user authorizes Microsoft sign-in, scoped search requests, and downloads. Search terms and file requests necessarily reach Microsoft. Models or runtimes may be downloaded separately with explicit approval. Do not describe the entire application as never communicating with cloud services.

**Freshness means:** display when a pack was prepared, each source's captured version, last successful access verification, and any locally enforced expiry policy. Offline mode cannot learn about new remote permission revocations or newly changed documents. A local expiry is not tamper-proof DRM.

## 8. Definition of done

| Test ID | Acceptance test | Required evidence |
| --- | --- | --- |
| AT01 | Build and launch the application on the available Windows target. | Build log, exact runtime identifiers, screenshot, known untested targets. |
| AT02 | Import synthetic local files and generate a real response with a local model. | Model ID/revision, runtime, checksum, prompt, timing, output. |
| AT03 | Use a work account to propose and prepare a scoped SharePoint pack. | Redacted test-tenant walkthrough, consent/scopes, downloaded-item manifest. |
| AT04 | Required sources finish downloading, extracting, and indexing before readiness is claimed. | Machine-readable readiness report plus UI state. |
| AT05 | Disconnect networking, restart, and complete chat → note → Word → PowerPoint. | Offline test report and exported files. |
| AT06 | Offline Lock prevents external egress with networking otherwise enabled. | Application request audit and independent OS-level observation for app and child processes. |
| AT07 | Every displayed citation resolves to its cached source version and passage. | Automated citation resolution checks; manual claim-support evaluation. |
| AT08 | Missing or contradictory evidence is surfaced rather than fabricated. | Answerable, unanswerable, outdated, and conflicting-source evaluation cases. |
| AT09 | Generated Office documents validate and open in an available local renderer without repair prompts or visible layout defects. | Open XML validation, reopen test, rendered/manual visual inspection with renderer recorded. |
| AT10 | Supported edits preserve untouched content; undo restores the working copy; originals remain byte-identical. | Original/after hashes, targeted-diff tests, undo test. |
| AT11 | Interrupted downloads, cancelled generation, low disk space, expired sign-in, and corrupt files fail safely. | Automated tests and visible recoverable error states. |
| AT12 | Reconnection identifies source changes and blocks use of confirmed revoked/deleted sources according to policy. | Refresh tests, invalidation of dependent caches, retained user draft/conflict behavior. |
| AT13 | A project cannot retrieve another project's sources or gain tools from instructions embedded in documents. | Isolation and prompt-injection tests. |
| AT14 | Sensitive sentinel text is absent from application-managed plaintext storage and logs. | Inspection of database, journals, indexes, caches, temp files, and logs; documented OS limitations. |
| AT15 | A second developer can follow setup, configure authorized access, and reproduce the demo. | README, scripts, pinned dependencies, licenses, demo guide, limitations. |

There is no blanket "production-ready" claim. Report each gate as **Passed**, **Failed**, **Blocked**, or **Not run**, with evidence.

## 9. Evaluation targets, not promised performance

Use a fixed synthetic corpus with at least 12 documents, including irrelevant documents, a conflicting older version, and intentionally missing information. Add English and Norwegian prompts.

Initial targets on the disclosed reference machine:

- 100% of displayed citations resolve to an existing eligible cached version and valid locator.
- At least 90% supported factual claims on a manually checked answer set.
- At least 90% correct abstention on intentionally unanswerable questions.
- Relevant evidence appears in the top five retrieval results for at least 80% of answerable evaluation questions.
- 100% of the supported Office fixture suite passes structural validation; visual verification is reported separately.
- No silent overwrite, unauthorized scope expansion, or application-originated external request in Offline Lock.

Record cold/warm model load time, first-token latency, generation rate, retrieval latency, indexing time, peak memory, actual transfer bytes, and battery mode. Set speed targets after the first real benchmark; do not invent universal tokens-per-second or battery-life promises.

## 10. Demo story

**Connected:** Choose a brief and allowed reference folders. Review the proposed pack and a visible evidence gap. Prepare the pack.

**Disconnected:** Disable networking and restart Coworker. Ask a question, click its local citation, draft a short Word plan, generate a five-slide deck, revise one slide, and export both files.

**Reconnected:** Refresh after a source changes. Show the change and the affected draft reference. Keep the original cloud files unchanged.

The demo succeeds because useful work continues without connectivity—not because a chatbot claims it is offline.

## 11. Decision rule

When requirements compete, prioritize:

**Trustworthy offline workflow → relevant sources and citations → safe editable outputs → usable performance → visual polish → extra features.**

A narrow, functioning workspace is preferable to a broad assistant with simulated integrations.
