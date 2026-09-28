# Master prompt — Build Coworker

Prepared: 2026-09-26  
Intended recipient: An AI coding agent with access to the project repository and development terminal.  
Companion files: `goal.md` and `agent.md`.  
Instruction: Build and verify the application. Do not merely respond with another proposal.

---

## 0. Your assignment

You are the implementation agent for **Coworker**, an offline-first local AI productivity workspace for the **Atea Local AI Hackathon**, owned by Vegard.

Read this document, `goal.md`, and `agent.md` completely before making architectural changes. Treat `goal.md` as the product and acceptance contract, this document as the implementation specification, and `agent.md` as the development and runtime-agent operating rules. Follow higher-priority instructions of your environment. If the repository already contains working software, inspect and preserve it instead of overwriting it blindly.

Your job is to create a working desktop application, tests, setup scripts, and documentation. Make reasonable reversible decisions without repeatedly asking for clarification. Stop for genuinely required authorization, credentials, destructive changes, or non-reversible security decisions. When such access is unavailable, continue with the local-file path and clearly identify the unverified integration; do not fake success.

Build a complete vertical slice before adding breadth. Use synthetic documents during development. Do not read real Atea/customer files or credentials merely because you can access the machine.

## 1. What we are creating

Coworker lets an employee prepare a project while online, then continue working with relevant company knowledge when offline.

The user:

1. Creates a project and explains the task, such as preparing a customer workshop, a proposal, a handover, or a presentation.
2. Adds existing local working documents and explicitly selects authorized SharePoint folders/libraries that Coworker may search.
3. Clicks **Prepare for offline**.
4. Reviews a proposed pack of useful reference documents, including reasons, estimated bytes, freshness, and known gaps.
5. Approves the selection. Coworker downloads permitted copies, extracts supported content, and builds local search indexes.
6. Disconnects and uses local AI to ask grounded questions, capture notes, draft and revise Word material, and create or revise editable PowerPoint slides.
7. Reconnects later and explicitly refreshes source snapshots. Uploading is a separate future capability, not an automatic side effect.

The product is **not** just a chatbot with file upload. Its distinguishing feature is a prepared, scoped, inspectable project knowledge pack combined with practical offline document work.

The target experience is an eight-hour train journey with no external network dependency after preparation. Eight hours is a usage scenario, not a battery-life guarantee.

## 2. Hard boundaries

### 2.1 Local AI really means local

All generation, query expansion, document summarization, embeddings, and reranking must execute on the user's actual Windows machine/guest. Do not call cloud inference providers, remote embedding APIs, hosted vector databases, or an inference server on the Mac host. Do not silently substitute a remote model when local inference is unavailable.

An API-compatible protocol does not imply use of a hosted API. A local runtime may expose an HTTP interface only on loopback, supervised and protected by the application.

### 2.2 Online preparation is explicit

Microsoft authentication, Graph queries, and authorized file downloads require connectivity. Clearly disclose that search terms and file requests are sent to Microsoft during preparation. Do not send the complete local brief as a search request. Prefer compact project terms and exact references; let the user review/edit generated queries before the first search batch.

Model/runtime installation is a separate explicit online action. Normal app startup must not download assets automatically.

### 2.3 No unrestricted discovery

The user selects both seed files and a **search scope**. Do not assume all readable tenant documents are in scope. Do not crawl the entire tenant or follow arbitrary links in files. Explicitly cited documents outside scope may appear as unresolved references with an explanation and an option to request scope expansion; they must not be fetched automatically.

### 2.4 Originals and permissions are protected

The MVP is read-only toward SharePoint. Local edits create working copies. Exports are explicit. No auto-upload, auto-email, auto-invite, original overwrite, automatic permission grant, or automatic consent escalation.

Respect download restrictions and protected documents. Do not bypass Microsoft 365 controls through alternate browser, screenshot, print, or extraction paths. Do not equate a successful download with complete enterprise policy approval.

### 2.5 Do not expand into a general copilot

Exclude computer control, microphone/screen recording, unrestricted shell execution, meeting bots, agent marketplaces, autonomous browsing, customer fine-tuning, and direct Outlook writes. The runtime AI acts only through small, typed workspace operations. The coding agent may use development tools, but those tools must not become capabilities of the shipped AI.

## 3. Initial engineering choices

Use these defaults unless an actual compatibility problem justifies a documented alternative:

| Layer | Initial choice | Boundary |
| --- | --- | --- |
| Desktop | C# / .NET 10, WPF, MVVM | Windows-first native app, not a cloud website. |
| Domain | Small typed services and explicit workflow state machines | Prefer ordinary code to a large autonomous-agent framework. |
| Microsoft access | MSAL.NET public-client authentication; Microsoft Graph v1.0 REST through typed adapters | No embedded client secret, no application-wide service identity. |
| Local generation | Supervised native `llama.cpp` process with an approved GGUF model | Loopback-only; local model path; no remote loading at runtime. |
| Model candidate | `mistralai/Ministral-3-3B-Instruct-2512`, suitably converted/quantized and verified | Candidate, not a promise of quality or runtime compatibility. |
| Office I/O | Open XML SDK for `.docx` / `.pptx` creation and narrowly targeted edits | Deterministic document operations; no LLM-generated executable code. |
| Storage | SQLite for records plus encrypted project blobs | No plaintext persisted full-text index. |
| Search | In-memory lexical index first; optional local embeddings behind an interface | Search must remain usable without a second model. |
| Tests | xUnit or a documented equivalent; fixture-driven integration tests | Live Graph and real-model tests are distinct from mocks. |
| Distribution | Self-contained Windows publish, architecture-specific dependencies | Start with a working portable folder; add an installer only afterward. |

.NET 10 is a supported LTS release at the research date [S01]. Open XML provides structured Office package manipulation [S02]. `llama.cpp` documents local inference/server functionality and publishes Windows ARM64 CPU builds [S03, S04]. These facts do not remove the requirement to test the selected versions together.

Do not pin guessed versions. Resolve actual stable package versions, runtime release/commit, model revision, tokenizer/chat template, and asset hashes during bootstrap; record them in lockfiles and an environment manifest. Prefer tested pinned releases over unbounded `latest` dependencies.

### 3.1 Windows in Parallels

Assume development may happen inside Windows 11 ARM64 in Parallels. Inspect the guest, not the host marketing specifications:

- OS/process architecture and native dependency architecture.
- Guest-assigned and currently available RAM.
- CPU capabilities exposed inside the guest.
- Disk space and file-system locations, including redirected/shared folders.
- Actual GPU/backend initialization results, not the presence of an adapter name.
- Battery/power state where accessible.

Make native ARM64 CPU inference the baseline on an ARM64 guest. On x64, use a compatible x64 runtime. Do not assume Apple Metal, Apple Neural Engine, CUDA, an NPU, or host unified memory is available to the guest. No mandatory WSL, Docker, Homebrew, or host service. Keep x64 and ARM64 validation results separate. Native Windows ARM support is documented, but each third-party binary still needs verification [S05].

### 3.2 Suggested repository shape

```text
Coworker/
  master-prompt.md
  goal.md
  agent.md
  AGENTS.md
  README.md
  global.json
  Directory.Packages.props
  src/
    Coworker.App/             # WPF shell and view models
    Coworker.Core/            # domain, workflow, policies, contracts
    Coworker.Infrastructure/  # storage, Microsoft adapter, runtime host
    Coworker.Documents/       # parsers, citation locators, Office operations
  tests/
    Coworker.UnitTests/
    Coworker.IntegrationTests/
    Coworker.AcceptanceTests/
  assets/
    templates/
    prompts/
    model-manifests/
  samples/
    synthetic-project/
  scripts/
    bootstrap.ps1
    run.ps1
    test.ps1
    publish.ps1
    verify-offline.ps1
  docs/
    architecture.md
    decisions.md
    setup-windows.md
    microsoft-setup.md
    permissions-matrix.md
    model-setup.md
    privacy-and-threat-model.md
    offline-contract.md
    document-support.md
    demo.md
    evaluation.md
    status.md
    limitations.md
  artifacts/                 # ignored generated evidence/builds
```

Keep project count small. Do not build a microservice deployment, a plugin platform, or separate services that add no value. Exclude local data, credentials, model weights, outputs, and logs from source control.

## 4. User experience

Deliver a calm, practical desktop workspace with a clear task flow. Do not spend the first implementation phase on visual effects.

### 4.1 Main shell

Use a left navigation column for Projects, Sources, Chat, Notes, Documents, Presentations, and Settings. A project header shows:

- Project name and active customer/work context.
- Effective connection mode and a prominent Offline Lock switch.
- Pack state, preparation timestamp, source count, and storage use.
- Active local model/profile and model readiness.
- A **Prepare for offline** or **Refresh pack** action.

The central area is the active work surface. A collapsible evidence panel shows retrieved passages, source versions, local citation locators, and relevant warnings. Do not force every task into a chat window.

Conceptual layout, not a required pixel-perfect design:

```text
+-----------------------------------------------------------------------+
| Coworker | Customer workshop | Offline Lock ON | Ready with gaps       |
+--------------+-------------------------------------+------------------+
| Projects     | Active task / document / slides     | Evidence         |
| Sources      |                                     | [1] Brief        |
| Chat         | Local drafting and editing surface  | section 2        |
| Notes        |                                     |                  |
| Documents    | Proposed change -> Review -> Apply  | [2] Runbook      |
| Presentations|                                     | section 4        |
| Settings     | Saved locally                       | Captured version |
+--------------+-------------------------------------+------------------+
```

### 4.2 First-run setup

Make Microsoft sign-in optional for local-file projects. Offer:

1. Run a synthetic local demo.
2. Import local documents.
3. Connect Microsoft work account.

Detect hardware and propose a local model, but display size/license/runtime information and require download approval. Support importing an already downloaded model bundle. When no usable model exists, ordinary notes and source browsing still work; AI controls explain what is missing instead of returning canned output.

### 4.3 Prepare wizard

Use a short sequence: **Task → Seeds → Search scope → Discovery budget → Proposed pack → Prepare → Readiness**.

Proposal rows show title, authorized location, file type, size or unknown-size status, last modified time, reason for inclusion, related topic, required/optional status, and warning badges. Allow pin, exclude, and reorder. Explain the difference between metadata discovery and downloading full candidate content.

Always show actual transfer bytes, not just final pack size. Cache reuse must reduce repeat transfers. Metered-connection behavior defaults to no automatic downloads.

### 4.4 Interaction quality

Stream model responses. Support cancellation without losing the project. Persist drafts promptly. Keep long-running parsing/inference off the UI thread. Support keyboard navigation, selection-based rewrite, sensible tab order, accessible labels, high-DPI displays, and clear errors.

Use English initially. Keep strings localizable, and test Norwegian Bokmål/Nynorsk text in source extraction and generation. Do not claim Norwegian quality without evaluation.

## 5. Local data and source model

Separate source identity, source versions, project membership, and editable artifacts. Do not use a filename as the identity of a remote item.

Core records:

| Record | Required meaning |
| --- | --- |
| `Project` | ID, tenant/account binding or local-only identity, task description, language, scope, policy, storage budget. |
| `SourceScope` | Explicit allowed tenant/site/drive/folder/local-root identifiers and exclusions. |
| `SourceItem` | Stable compound identity, origin, eligibility, current availability, encrypted descriptive metadata. |
| `SourceVersion` | Captured version/ETag, content hash, fetched timestamp, extraction version, encrypted blob location. |
| `ProjectSource` | Project membership, pin/exclude state, relevance reasons, required/optional role, offline eligibility. |
| `Chunk` | Version ID, extracted text, exact locator, content hash, searchable text and optional embedding metadata. |
| `PackSnapshot` | Immutable membership/version snapshot, preparation state, policy, budgets, readiness report. |
| `DraftArtifact` | Notes/document/deck, structured content, revision, source dependencies, working-copy/export state. |
| `AgentRun` | Typed workflow, mode, step state, approvals, structured outcomes, timings, safe audit entries. |
| `RefreshJob` | Requested refresh, captured baseline, progress, retry state, source changes, outstanding conflicts. |
| `ModelProfile` | Verified local asset/runtime identity, supported tasks, memory/latency measurements. |

Every applicable record is scoped to project and account. Never retrieve across customers or tenants by default. An explicit source share/import must create its own authorized project membership; it is not implicit global memory.

Store source time, capture time, and last successful permission check separately. A local file hash is an integrity identifier, not evidence that Microsoft still allows access.

## 6. Protection and persistence

### 6.1 Application-managed encryption

Implement protection early, not as a label added to a plaintext prototype. One feasible MVP design:

- Generate a random per-project data key using standard cryptographic APIs.
- Protect the data key with Windows user-scoped DPAPI or an equivalently reviewed Windows mechanism.
- Encrypt source blobs, extracted passages, embeddings, titles/paths/queries, notes, conversations, manifests with sensitive fields, and checkpoints using authenticated encryption such as AES-GCM from the platform library.
- Use a unique nonce per encryption and authenticated metadata that binds ciphertext to project, record, version, and schema. Never invent a new cryptographic algorithm.
- Persist only ciphertext and non-sensitive opaque bookkeeping in SQLite. Ensure journals/WAL/backups do not contain plaintext source content.
- Build the lexical index in memory after unlock; configure index temporary storage to remain memory-resident. Cache encrypted extraction data so reopening avoids reparsing full Office files.
- Reconstruct a bounded search index asynchronously; keep readiness distinct from model readiness during startup.

If a tested encrypted SQLite distribution is selected instead, prove its ARM64 packaging and journal behavior. Do not leave FTS plaintext on disk while calling the whole workspace encrypted.

### 6.2 Limits and exports

Decrypted content necessarily exists in process memory during use. Windows paging, crash dumps, administrators, and compromised user sessions are outside a claim of perfect secrecy. Document full-disk encryption and managed-device policies as enterprise deployment requirements, not guarantees implemented by this app.

Keep managed workspace data under a private local application-data path. Detect/warn about OneDrive, network, or Parallels shared paths. A user-exported `.docx` or `.pptx` may be ordinary plaintext Office content; explicitly distinguish it from protected managed storage and warn before exporting to a synchronized location.

Source and draft opening in external Office requires an explicit export/open action. Use app-private temporary storage only when necessary, track it, and clean it on normal shutdown and recovery. Explain that already exported files cannot be retracted by deleting the local pack.

### 6.3 Retention and locking

Support configurable pack expiry, last-verification time, manual deletion, project lock, and lock-on-Windows-session-lock. Defaults for a synthetic demo are not enterprise policy. Show organizational policy state as `Demo`, `Configured`, or `Not configured`; never show an invented compliance approval.

At logout or confirmed revocation, apply documented policy to the affected account's packs and derived caches. Clear eligible runtime conversation/KV caches when sources become unavailable or the active project changes. Preserve user-created work according to explicit policy; mark source dependencies unavailable rather than silently deleting the user's entire draft.

Deletion removes managed records/blobs/keys according to policy. Do not promise forensic secure erase from SSDs, snapshots, backups, or user exports.

## 7. Microsoft authentication and connector

### 7.1 Authentication

Use an Entra ID public-client registration for a Windows desktop app. Prefer a single-tenant test registration initially, with configuration for an approved customer tenant later. Use MSAL, a supported system-browser or Windows broker flow, and the appropriate PKCE/public-client behavior. Keep tokens in a protected MSAL cache; never embed a client secret or ask the model to handle tokens. Document the exact redirect and broker configuration used [S06].

Separate sign-in readiness from offline workspace access. Offline Lock must prevent silent token acquisition as well as interactive sign-in. An expired access token must not destroy an eligible offline project.

An `offline_access` OAuth scope concerns token renewal; it is not permission to retain documents indefinitely. User consent can be blocked by tenant policy even when an API lists a delegated permission. Do not attempt to bypass tenant approval.

### 7.2 Permission matrix

Implement **delegated read-only** access. Map each real endpoint to its documented permission and test the combination in a test tenant. A typical SharePoint discovery implementation may need delegated `Files.Read.All`, with `Sites.Read.All` only for functionality requiring it. `Files.Read` is not a blanket substitute for all SharePoint discovery. Do not request Mail, Calendar, Directory, or write permissions for P0 [S07, S08, S09].

Microsoft selected-resource permissions require explicit grants and have endpoint-specific compatibility. Do not assume a selected-folder UI creates a server-enforced OAuth boundary, or that `Sites.Selected` works with a search endpoint simply because it exists. The drive search documentation explicitly notes a limitation for the `Sites.Selected` application permission [S07, S10].

In `docs/permissions-matrix.md`, include endpoint, permission type, exact scope, justification, tested tenant outcome, and fallback. If broad search permission is not approved, fall back to authorized local-file import or a separately verified explicit-folder traversal path. Label reduced capability; do not secretly broaden scopes.

### 7.3 Stable API surface

Use stable Graph v1.0 endpoints where supported. Illustrative operations to verify and wrap:

```text
GET  /sites/{hostname}:/{relative-site-path}
GET  /sites/{site-id}/drives
GET  /drives/{drive-id}/items/{folder-id}/children
GET  /drives/{drive-id}/items/{item-id}
GET  /drives/{drive-id}/items/{item-id}/content
POST /search/query
GET  /drives/{drive-id}/root/delta
```

These are a design guide, not permission proof. Store stable site/drive/item IDs after resolving links. Safely handle pagination, moved items, `remoteItem` references, timeouts, 429 `Retry-After`, and bounded transient retries. Do not treat a malformed SharePoint link as a filesystem path.

For search, use `driveItem` requests and server-side scope filters where supported. Microsoft documents KQL path filtering [S08]. Escape project terms correctly and construct filters from validated scope objects rather than LLM-generated raw KQL. Recheck each hit against stable authorized ancestry and project policy before download; a string prefix is insufficient. Shared shortcuts or moved items can resolve outside the intended folder.

For downloads, obtain fresh content URLs through Graph. Preauthenticated redirect URLs are short-lived secrets, not persistent source links. Do not log them, give them to the model, or forward the Graph bearer token to the redirected download host [S11]. Restrict redirects to verified Microsoft download destinations for the configured cloud, enforce HTTPS, reject loopback/private-network redirects, and cap redirect depth. Support legitimate Microsoft CDN redirects rather than incorrectly allowing only `graph.microsoft.com`.

### 7.4 Connector boundaries

Define an `ISourceConnector` abstraction with a real Microsoft implementation and local/synthetic implementations:

```text
ResolveScopeAsync(input, cancellation)
ListChildrenAsync(scope, cursor, cancellation)
SearchCandidatesAsync(scope, queryPlan, budget, cancellation)
GetMetadataAsync(sourceKey, cancellation)
DownloadAsync(sourceKey, expectedVersion, budget, cancellation)
RevalidateAccessAsync(sourceKey, cancellation)
GetChangesAsync(scope, checkpoint, cancellation)
```

Only the connector receives access tokens. The agent sees opaque IDs, safe metadata, and supported capabilities. All connector requests pass through the same outbound policy and network-mode gate.

## 8. Prepare-for-offline pipeline

### 8.1 States

Persist an explicit job state:

```text
Draft -> AnalyzingSeeds -> AwaitingQueryApproval -> Discovering
      -> AwaitingPackApproval -> Downloading -> Extracting -> Indexing
      -> Verifying -> Ready | ReadyWithGaps | NotReady

Every active state can transition to Paused, Cancelled, or FailedRecoverable.
```

Do not display 100% for an estimated stage that is still running. Count bytes and work units actually completed. A user may cancel and resume without duplicating successful downloads.

### 8.2 Analyze seeds locally

Extract the task, project/customer identifiers, topics, known terminology, explicit document references, likely deliverables, and missing questions. Do this through deterministic extraction plus bounded local model assistance. Sanitize secrets from suggested queries and let the user inspect the compact query plan.

Never expose model-internal reasoning. Show a useful explanation such as “Matches the workshop's deployment topic and is explicitly referenced by the brief.”

### 8.3 Discover with a budget

Start with scoped metadata/server search. Do not download every document to discover which documents to download.

Initial configurable proposal defaults, to be validated by usage:

- Up to 8 short search queries.
- Up to 100 distinct metadata candidates after deduplication.
- Up to 30 optional supporting documents proposed, plus explicit seeds.
- A 250 MiB additional-download budget, with a separate disk-space requirement.
- A 25 MiB per-file limit for the first supported parser pipeline.
- Low transfer concurrency, initially 2 active downloads.

These are product defaults, not Graph service limits. Show which limit stopped discovery. Account for retries and any full-content scouting in the total network budget. Full-content scouting requires explicit approval; search metadata/snippets may be used without pretending that the whole source was read.

Rank candidates using measurable features: exact project identifiers, explicit references, seed-topic overlap, title/heading relevance, task coverage, version/freshness evidence, existing local reuse, and diversity. Penalize duplicates and unrelated material. Do not assume the newest file is authoritative or generate a meaningless “97% confidence” number.

Implement deterministic lexical ranking first. Optional embeddings or a small local reranking pass can improve the shortlist, but only when benchmarked. Small-model context is a scarce resource; do not feed hundreds of full documents into one prompt.

### 8.4 Review the proposal

Present inclusion reasons, scope, byte estimates, required vs optional files, and known unsupported/protected items. The user can edit the selection. Do not silently remove pinned/required files to make a budget fit.

A coverage checklist should reflect the task's topics, such as objectives, technical background, customer requirements, timeline, and risks. Its state is heuristic: supported, partially supported, or missing. Do not claim exhaustive knowledge of the tenant or of all relevant documents.

### 8.5 Download, extract, and commit

For approved items:

1. Recheck scope, metadata, policy, size, and download eligibility.
2. Capture baseline version/ETag when available.
3. Stream into protected staging storage with strict byte limits and cancellation.
4. Compute a content hash and verify the file signature/type.
5. Recheck version if needed to detect a file changing mid-download; retry within budget or mark unstable.
6. Parse in a bounded worker; record extraction coverage and meaningful locators.
7. Encrypt extracted content and build/update local indexes.
8. Commit a new pack snapshot atomically only after verification.

Keep the previous complete snapshot usable until the new one is committed, subject to access/expiry policy. Never present partially written blobs as available sources.

### 8.6 Readiness report

A pack is **Ready** only when all required items are locally available, supported extraction/indexing completed, the actual local model/runtime is ready, policy permits use through the selected offline period, and a smoke question/citation lookup succeeds.

**Ready with gaps** requires usable required items but missing optional material, known unsupported portions, or disclosed coverage limitations. **Not ready** applies when required sources or the model are missing, integrity fails, or policy blocks the task. Individual expired/blocked items cannot be retrieved merely because the pack has a permissive label.

Show cached source count, actual bytes, pending/failed items, model assets, prepared timestamp, policy expiry, gaps, and a **Test offline now** action. Model downloads are counted separately from document downloads so the user understands the storage/transfer costs.

## 9. Extraction and citation fidelity

### 9.1 Supported formats

P0 accepts `.docx`, `.pptx`, text-based `.pdf`, `.txt`, and `.md` as sources. New editable exports are `.docx`, `.pptx`, `.txt`, or `.md` as appropriate. Choose a maintained, commercially compatible PDF parser and verify the exact package and native dependencies before including it. A source parser is not a full document renderer.

For Word, extract supported paragraphs, headings, lists, and table cells; optionally headers/footers where implemented. Record omitted text boxes, tracked changes, footnotes, complex fields, or other unsupported structures. Define a consistent policy for revision markup rather than inadvertently treating deleted text as current.

For PowerPoint, extract slide titles, text shapes, supported tables, and speaker notes, with slide and shape identities. Do not imply that chart/SmartArt/image content was understood when only surrounding text was extracted.

For PDFs, preserve actual PDF page numbers and text locations where available. Scanned/image-only PDF content is marked unsupported in P0; do not silently send it to cloud OCR or pretend the document is empty. Local OCR is a separate future capability with its own model/assets, limits, and quality reporting.

For text/Markdown, preserve line ranges and heading context. Do not execute Markdown HTML, scripts, links, or embedded instructions.

### 9.2 Input safety

Treat Office files as untrusted ZIP/XML packages. Bound compressed and expanded sizes, entry count, nesting, XML entity handling, extraction time, and memory. Reject path traversal, unsupported encryption, legacy `.doc`/`.ppt`, macro-enabled formats, and malformed packages with a useful message. Never execute macros, OLE objects, external references, linked images, embedded scripts, or document-supplied tools.

Run heavy parsing in a cancellable worker process with resource/time limits where practical. Kill and clean up stalled workers. A failed optional file should not destroy a usable pack.

### 9.3 Locators

Each chunk points to an immutable source version and a locator that can be reopened offline:

```text
DOCX: package part + heading path + paragraph/block identity;
      table index / row / cell when relevant.
PPTX: slide part/ID + displayed slide number + shape ID + paragraph index;
      mark speaker-note locators separately.
PDF:  actual file page number + extraction offsets/bounds when available.
TXT/MD: file version + line start/end + optional heading.
```

Do not invent Word page numbers from extraction. Pagination depends on rendering. A displayed slide number is convenient but is not the sole durable identity after reorder.

Citation labels are assigned by application code, not invented URLs from the model. Resolve source IDs, version IDs, and chunk IDs against the current run's evidence allowlist. The click handler opens the local captured passage with source metadata. Opening the live SharePoint URL is a separate explicit action that obeys Offline Lock.

## 10. Retrieval and grounded answers

### 10.1 Retrieval sequence

1. Take the active project and eligible pack snapshot from application state, not the model.
2. Interpret the user's task and selected editor context.
3. Search only eligible project chunks; apply source scope, expiry, exclusion, and account filters before ranking.
4. Use lexical search first. Optionally combine local embeddings with lexical results, deduplicate overlapping chunks, and select a diverse evidence set.
5. Pack evidence with source/version IDs and locators into a bounded prompt. Keep a safe output-token reserve.
6. Generate an answer or structured draft with source references.
7. Validate output shape and citation IDs; repair at most once if the problem is syntactic.
8. Return a sourced answer, clearly labeled suggestion, or explicit evidence gap.

An initial chunk size around 400–700 tokens with modest overlap is a tunable starting point, not a standard. Respect headings, tables, and slide boundaries instead of splitting mechanically through every structure. Track parser and embedding versions so indexes can be rebuilt safely.

Source content is data, never an instruction channel. Delimit it clearly, but do not rely on delimiters alone for safety: runtime permissions and tool allowlists enforce the boundary.

### 10.2 Evidence behavior

Distinguish:

- **Supported fact:** reference the relevant cached evidence.
- **User-provided information:** label it as supplied by the user, not an external source.
- **Suggestion/assumption:** clearly separate it from documented fact.
- **Missing/conflicting evidence:** show the gap or conflicting versions and ask for a decision only when necessary.

Do not treat a structurally valid citation as proof of factual support. Programmatic checks verify provenance and locator existence; human evaluation and focused checks assess whether the cited passage actually supports the claim. Never advertise guaranteed hallucination prevention.

Exact quotes must match normalized source text. Preserve numbers, dates, units, and qualifiers. Calculations use deterministic typed utilities and cite their inputs; do not invent costs, customer promises, or technical specifications to complete a draft.

If a user asks about current information while offline, display the pack timestamp and state that newer information may not be available. Do not improvise a live search.

### 10.3 Scoped memory

Save only explicit project conversations, drafts, and user-approved notes. There is no activity surveillance. Keep retrieval answers traceable to their source versions. Invalidate or quarantine source-derived summaries, embeddings, response caches, and active model contexts when their supporting source becomes ineligible. Do not let a summary retain otherwise blocked information as an unrestricted alternate source.

## 11. Runtime agent design

Use a deterministic workflow controller with small local-model steps. One model can handle the initial workload. Do not instantiate multiple autonomous agents just to make the system look sophisticated.

Supported workflows:

```text
PreparePack
AnswerProjectQuestion
SummarizeSelectedSources
DraftNote
DraftDocument
ReviseDocumentSelection
DraftPresentation
ReviseSlideSelection
RefreshPack
```

Each workflow has a known state machine and a bounded set of allowed operations. General execution:

```text
Receive -> Validate intent/scope -> Gather evidence -> Draft structured result
        -> Validate result -> Preview -> Obtain required approval
        -> Execute typed operation -> Verify -> Commit -> Report
```

A chat answer can skip mutation approval. Mutating an existing working artifact requires review. An explicit user request to create a new local draft can authorize draft creation, but not unrelated file export or remote publication. A cancelled or failed workflow reports the actual state and preserves completed safe work.

### 11.1 Tool surface

Expose only the tools necessary for the current workflow, for example:

```text
search_project(query, filters, limit)
read_source_excerpt(sourceVersionId, locator)
get_active_document_selection()
propose_document_patch(artifactId, baseRevision, patch)
propose_slide_patch(artifactId, baseRevision, patch)
create_note_draft(title, blocks, citations)
create_document_draft(templateId, sections, citations)
create_presentation_draft(templateId, slides, citations)
get_pack_readiness(projectId)
```

The orchestrator derives project identity and tool permissions from session state. The model cannot choose an arbitrary project ID, filesystem path, Graph URL, executable, shell command, or OAuth scope. Connector operations are used by the preparation workflow, not granted freely to general chat.

Define typed request/response schemas with strict size limits, enums, `additionalProperties: false`, known IDs, and revision preconditions. Parameter validation is ordinary code. Native tool calling is optional; schema-constrained JSON steps are enough when more reliable on the chosen runtime [S03].

### 11.2 Example patch contract

This example describes a contract to implement and validate; the IDs are illustrative:

```json
{
  "schemaVersion": 1,
  "artifactId": "working-artifact-id",
  "baseRevision": 7,
  "operation": "replace_block_text",
  "targetBlockId": "block-id-from-app",
  "expectedTextHash": "hash-from-current-selection",
  "replacementText": "Proposed replacement text.",
  "citationIds": ["evidence-id-from-this-run"],
  "rationale": "Short user-facing explanation, not hidden reasoning."
}
```

Reject stale revisions, mismatched hashes, unknown citations, edits outside selection, unsupported structure, excessive length, or invented operations. Rebase only through an explicit new proposal. Never apply a best-guess mutation to the wrong location.

### 11.3 Bounded execution

Give every step cancellation, timeout, resource budget, and an idempotency/run identifier. Initial limits: one plan revision, one malformed-output repair, and at most a small fixed number of evidence reads per answer. These are configurable engineering defaults, not a reason to ignore legitimate large requests; split long work into reviewable chunks.

Do not display chain-of-thought. Show short progress summaries, source selections, proposed changes, verification outcomes, and actionable errors.

## 12. Notes and Word workflow

### 12.1 Notes

Provide a local notes editor with title, plain text/Markdown content, optional tags, timestamps, and source references. Support “Turn this note into a document outline” and “Turn this outline into slides” using the same evidence contract. User-authored notes are not automatically authoritative evidence for claims originating elsewhere.

Autosave within the protected workspace and maintain a small revision history. No calendar integration is required for notes.

### 12.2 Structured document authoring

The first editor is a **section/block editor**, not a promise of complete Word fidelity. Support titles, headings, paragraphs, simple lists, and simple tables. Users can ask for an outline, draft one section, shorten/rewrite selected content, or create a document from an approved plan.

The local model returns a typed document structure; deterministic code creates the Office package. It never emits executable code or unrestricted Open XML for execution.

Use semantic styles, readable margins, coherent typography, heading levels, page breaks where deliberate, table header rows, and a sources/reference section. Prefer a supplied approved template when available. Without one, use a neutral business template; do not invent Atea brand assets.

### 12.3 Existing `.docx` edits

Import a working copy and enumerate supported editable blocks. Preserve untouched package parts and relationships. Handle text split across runs; do not perform raw global XML string replacement. Preserve run formatting when a supported edit permits it, and warn when a replacement intentionally uses the enclosing paragraph style.

P0 may edit plain paragraphs and simple table-cell text. Refuse or offer a separate generated copy for unsupported fields, tracked-change regions, embedded objects, complex layouts, or protected content. Do not silently flatten the entire document to make editing easier.

For each accepted edit: capture revision/hash, stage a copy, apply narrowly, validate, show a content diff, commit atomically, and retain undo. If the selected block changed externally, stop and present a conflict rather than writing over it.

### 12.4 Export and quality checks

Export real `.docx` files to a user-selected location. Structural validation and successful re-opening are required. During development, render representative output fixtures with an available local Office-compatible renderer and inspect every page for clipping, broken tables, headings, and missing content. Record which renderer was used; identical rendering across all Office versions is not promised.

Open XML itself is not a page-layout renderer. If no renderer is installed, the app still supports structured authoring, but the development report must mark visual validation as not run. Do not claim perfect layout from XML validity alone.

## 13. PowerPoint workflow

### 13.1 Generate through an approved outline

Use: **Task and evidence → Outline → User review → Slide content → Deterministic layout → Validation → Editable deck**.

An outline includes audience, objective, slide count, narrative order, key points, and source dependencies. Generate slide content in short batches so a small model can maintain quality. Do not ask a 3B-class model to emit an entire complex presentation package in one answer.

Support these initial slide types: title, section divider, title/body, two-column comparison, simple process/timeline, and summary/next steps. Prioritize real editability over screenshot-based slides.

### 13.2 Layout rules

Use a curated local template with native text boxes and shapes. Start with 16:9 slides. Define bounds, margins, spacing, maximum text lengths, and a small typography hierarchy. Keep speaker notes for detail rather than shrinking body text to unreadable sizes. If content does not fit, simplify, split, or ask for review; never silently clip it.

No cloud fonts, web images, remote icons, or generated images requiring external services. Reuse approved local assets only. For source images, preserve provenance and permission constraints. Do not synthesize factual charts from missing numbers.

Keep a sources slide and meaningful per-slide source references in speaker notes or a references field. Do not expose internal-only links in a customer export without an explicit export review. Removing a citation does not remove sensitive information from the slide body; export approval must consider the content itself.

### 13.3 Editing

Within the slide composer, support edit text, rewrite a selected supported text shape, reorder slides, duplicate a supported slide, and regenerate a selected slide with review. Import existing `.pptx` packages conservatively, preserving masters, layouts, relationships, and untouched content. Unsupported animations, embedded media, charts, and SmartArt remain preserved and locked against unsupported edits.

Use slide part/ID and shape IDs, not only “slide 3,” for mutations. Re-check the working revision before applying a patch. Changing a slide's text must not rebuild unrelated slides.

### 13.4 Validation

Produce a real `.pptx` that reopens without a repair prompt. Validate relationships, IDs, and package structure. Check shape bounds, overflow, and content density; render/inspect the supported fixture decks with a local renderer during development. An in-app structured preview is not advertised as exact PowerPoint rendering.

Supply one approved five-slide synthetic demo deck generated by the application and revise one slide live while offline. Do not ship a handcrafted deck as evidence that model-driven generation works.

## 14. Model installation and hardware adaptation

### 14.1 Candidate, not an invented winner

Prefer a European model provider. The verified starting candidate is **Ministral 3 3B Instruct 2512**, whose upstream model card specifies Apache-2.0 weights [S12, S13]. The upstream artifact may not be in the GGUF format required by the chosen runtime. Resolve a trustworthy converted/quantized artifact or a reproducible conversion; verify exact compatibility before recommending it.

Do not assume every older Ministral release has the same license. Do not claim a European provider guarantees European-only training data, a European-only software supply chain, or regulatory compliance.

A larger 8B-family candidate is optional only after actual memory and quality testing. Use a smaller compatible candidate if necessary, documenting provider, license, and limitations; do not silently ignore the user's European preference. Do not name an unverified model as installed.

### 14.2 Asset manifest

For each approved runtime/model bundle, record:

```text
publisher, upstream model ID, upstream revision,
artifact repository and exact revision, asset filename,
format, quantization, measured size, SHA-256,
license and required notices, runtime release/commit,
architecture, tokenizer/chat-template identity,
local context limit, tested tasks and quality results,
measured memory/latency, supported platform profile.
```

Actual hashes are computed/verified from real assets; placeholders may exist only in clearly disabled sample manifests. Checksums provide integrity, not proof that an untrusted publisher is safe. Prefer trusted publishers and verified provenance. Do not execute downloaded model repository code, pickle payloads, or `trust_remote_code` pathways as a convenience.

Downloads require a visible size/license prompt, disk-space check, progress, cancellation, integrity validation, and resume strategy. Offline startup uses local asset paths only. Missing auxiliary tokenizer/template files make a bundle unready rather than triggering a hidden fetch.

### 14.3 Supervised runtime

Bind only to numeric loopback; do not expose to LAN or use `0.0.0.0`. Pick/manage a local port safely, authenticate requests with a per-launch secret, reject arbitrary endpoints, avoid proxies for loopback traffic, and restrict origin/browser access where supported. Document any public health endpoint and ensure it exposes no project data. The runtime must not have optional remote-tool, agent, web-fetch, or model-router downloads enabled.

Launch only a verified executable with a typed argument list, never a shell-composed string. Keep secrets out of logs/command display. Supervise process lifetime, timeouts, crash cleanup, cancellation, and idle unloading. Clear conversation/KV state across project boundaries. Do not let an unrelated process already listening on a port receive project prompts.

### 14.4 Selection and performance

Choose the best **tested eligible profile**, not the theoretical largest model. Consider free RAM, weights, KV cache, context size, app/index memory, operating-system headroom, power mode, and native runtime support. Start with a conservative context window such as 4K–8K, not the model's maximum advertised context.

Benchmark short synthetic tasks: cited Q&A, a selected paragraph rewrite, a slide-outline schema, and a Norwegian prompt. Record cold/warm load, first-token latency, tokens per second, peak memory, and result quality. Never use customer data for installation benchmarks.

If memory pressure occurs, shrink context, reduce concurrency, unload optional embedding models, or select a smaller already-approved model. Do not repeatedly crash/restart or fall back to the cloud. When generation is unavailable, allow local reading, lexical search, and manual editing.

Expose Balanced and Battery Saver modes. Delay nonessential indexing on battery, keep only one primary generation job active, and unload idle models after a configurable interval. Do not promise a specific battery duration without measuring it.

Fine-tuning is not part of P0. First improve the retrieval set, prompts, task schemas, template quality, and evaluation cases.

## 15. Offline Lock and connectivity

Separate **physical connectivity** from **permission to use the network**. Suggested effective modes:

```text
OfflineLocked       # user/policy forbids external requests
OfflineUnavailable  # external connectivity unavailable
OnlineIdle          # connectivity exists, no approved job active
OnlinePreparing     # approved scoped discovery/download job
OnlineRefreshing    # approved scoped revalidation job
```

Use one outbound request policy service for every non-loopback client. Classify requests as authentication, source discovery, source download, model installation, update check, or a future publication. Only enable categories for an approved operation. Runtime inference uses a separately validated loopback channel.

Entering Offline Lock cancels queued and in-flight external jobs, prevents token renewal, blocks remote asset resolution, and persists across restart. Test lock entry during a download and an authentication attempt. Do not automatically switch out of Offline Lock when Wi-Fi returns. Reconnecting can show “Refresh available,” but must not initiate an upload or unapproved search.

Bundle UI fonts/icons/styles/help assets. Do not include web analytics, remote error reporting, external image loading, online license checks, or automatic update queries in the offline path. Disable dependency telemetry where applicable. The app's offline claim covers its own processes, not unrelated Windows or Office networking.

A failed network request is not the same as no attempted network request. Verification must cover both disabled-network operation and Offline Lock with a usable external connection. An app gate is not a tamper-proof OS sandbox; independently observe app and child-process connections during tests. Any firewall-based test setup must be explicit, scoped, reversible, and never disable enterprise security controls.

## 16. Refresh, freshness, and conflicts

### 16.1 Read-only refresh in P0

Refresh is a user-initiated operation that compares remote metadata/versions against the pack and downloads approved changed content. For a small pack, per-item metadata revalidation is a clear initial implementation. Use delta tracking only when its actual scope is approved; do not scan an entire drive merely to refresh a selected folder. Microsoft documents delta links and deletion markers, but a delta feed is not a complete offline permission-revocation system [S14].

Persist opaque next/delta links safely. Handle invalid checkpoints, pagination, repeated events, moves, and throttling. Do not reconstruct a delta URL by guessing its token semantics.

Treat source state distinctly: unchanged, changed, deleted, denied, temporarily unavailable, unknown. A 403 can indicate denied access or a policy condition; do not label every 403 a proven permanent revocation. Fail closed for blocked sources while recording a precise status and recovery path.

On refreshed changes, build a new source version and index transactionally. Display a change summary and which answers/drafts cite the older version. Do not silently rewrite user content or retroactively attach an old answer to a new source version.

### 16.2 Offline limitations

The app cannot discover an unseen remote revocation or edit while disconnected. Display last successful checks and enforce the local offline-use policy. At reconnection, revalidate before treating cached remote permissions as fresh. Do not treat an unexpired OAuth token as a durable authorization record for each offline file.

For confirmed deleted/denied sources, exclude the source and its derived retrieval artifacts according to policy, clear active model context, and mark prior references unavailable. Retained user-authored drafts and already exported files need explicitly documented handling; never claim remote wipe of user exports.

### 16.3 Future publishing contract

Do not implement this before P0, but keep the architecture compatible with an explicit publication workflow:

- New operation and new approval, with destination and exact content shown.
- Incremental write permission only when this feature is enabled.
- Recheck destination access and compare remote ETag/base version.
- On conflict, keep both or ask the user; never silently overwrite.
- Use endpoint-specific documented conditional-write behavior rather than assuming every upload supports the same precondition.
- Persist a bounded outbox with idempotency keys, cancellation, and honest status.

Offline drafts are not “synced” until a real successful remote write is verified. `.ics` export, if later added, is not proof that an Outlook event was created or that attendees received invitations.

## 17. Security and policy threat model

Write `docs/privacy-and-threat-model.md` with data flows, trust boundaries, assets, adversaries, mitigations, and residual risks. At minimum cover:

| Threat | Required mitigation |
| --- | --- |
| Instructions hidden in a source document | Treat source as data; typed tools; no model-controlled network/path/permission expansion. |
| Cross-customer data leakage | Account/project-scoped storage and retrieval; context reset; isolation tests. |
| An apparently relevant but out-of-scope result | Canonical ID/ancestry validation before retrieval/download; explicit scope expansion. |
| Stolen laptop or copied workspace | Protected keys and encrypted sensitive storage; managed-device/full-disk-encryption guidance. |
| Plaintext search/log/temp leakage | Encrypted persistence, in-memory index, redacted logs, sentinel inspections, cleanup tests. |
| Lost cloud access while offline | Timestamp/expiry disclosures, configurable policy, revalidation on reconnect; no instant-revocation claim. |
| Malicious Office/PDF/archive | Bounded parsing, isolated workers where feasible, no macros or external content fetch. |
| Malicious document link | No automatic follow; URL canonicalization and cloud/domain validation; SSRF protections. |
| Preauthenticated URL or token leakage | Credential isolation, URL redaction, no bearer forwarding across redirects. |
| Arbitrary code from model output | Schema validation and allowlisted deterministic document tools; no `eval`, shell, or model-generated code execution. |
| Untrusted local inference service | App-owned verified process, authenticated loopback endpoint, port/process checks. |
| Export to unintended cloud storage | Explicit export review, path warnings, no default synchronized workspace. |
| Compromised dependency/model artifact | Pinned versions, trusted provenance, checksums, notices, vulnerability review. |

Offline eligibility uses `Allowed`, `Denied`, or `Unknown` from a configured policy adapter. File readability and policy eligibility are separate. For a hackathon without enterprise policy integration, restrict real use to explicitly sanctioned test locations and supported unprotected documents; mark the demo policy as a demo. Do not fabricate full Purview/DLP/label enforcement. Unknown or unsupported protection blocks protected-enterprise processing rather than causing a bypass.

Local AI can reduce external processing of work content; it does not automatically establish GDPR compliance, regulatory approval, complete security, zero cost, or immunity to hallucinations. Write those limits plainly.

## 18. Testing and evaluation

Create deterministic fixtures and tests before the final demo. Avoid only testing the happy path.

### 18.1 Unit and integration coverage

Test at least these groups:

**Source scope and identity:** path escaping, encoded URLs, misleading folder prefixes, out-of-scope shortcuts, moved items, pagination, account mismatch, filename collisions, duplicate versions.

**Preparation:** budget exhaustion, unknown-size files, interrupted download, resumable work, version change during download, disk full, failed required source, failed optional source, unsupported extraction, atomic snapshot commit.

**Permissions/authentication:** consent denied, user cancels sign-in, expired token, denied content, unknown eligibility, sign-out, refresh refusal, no scope escalation, no cloud writes.

**Retrieval:** exact reference matching, Norwegian text, relevant sources in top results, no cross-project hits, excluded/expired sources absent, contradictory versions, missing evidence, dependency invalidation.

**Citations:** nonexistent IDs, wrong versions, invalid locators, quote mismatch, invented Word page numbers, offline click resolution, old citation behavior after refresh.

**Agent output:** malformed JSON, unknown tools, model-injected paths, stale revisions, excessive output, cancelled run, repeated operation idempotency, source-embedded instructions requesting exfiltration.

**Office editing:** text across runs, lists, simple tables, untouched headers/footers/media, existing layouts, hidden or unsupported regions, relationship preservation, slide reorder, original hashes, atomic save, file locks, undo.

**Runtime/platform:** missing model asset, wrong binary architecture, port already occupied, unauthenticated local access, model crash, low memory, context overflow, idle unload, ARM64 CPU path, x64 path where available.

**Offline/persistence:** app restart with no internet, Offline Lock persisted, lock transition during jobs, no token renewal, no model auto-fetch, no external fonts/images, encrypted checkpoints, crash recovery, tampered ciphertext, plaintext sentinel scan.

Use mocks/fakes for deterministic Graph error coverage, but mark them as mocks. A real-model test and a live-tenant test must be reported separately.

### 18.2 Synthetic demonstration corpus

Create at least 12 small, clearly synthetic files with a fictional customer. Include a project brief, workshop goals, requirements, runbook, handover notes, sample proposal, previous slide deck, a text-based reference PDF, an irrelevant project, an older contradictory plan, a deliberately missing referenced document, and a source containing hostile instructions for testing.

No actual Atea customer data, real contact details, credentials, or proprietary template assets. Make the expected answers and evidence references explicit so the retrieval/answer quality can be measured.

### 18.3 Evaluation report

Use the gates in `goal.md`. Report exact machine/guest configuration, models, quantization, runtime build, corpus, prompts, cold/warm runs, RAM, latency, and outcomes. Make retrieval quality, citation resolvability, claim support, valid output schemas, document integrity, visual quality, and actual offline behavior separate metrics.

Initial quality targets are evaluation goals, not fabricated achieved numbers. When a target is missed, retain the evidence, diagnose the failure, and narrow the supported behavior or improve the implementation.

### 18.4 Visual and functional demo proof

Open exported `.docx` and `.pptx` files in an available local renderer/application and inspect the supported fixture suite. Keep screenshots or rendered-page evidence with sensitive paths redacted. Automated structure checks do not replace layout inspection.

Run a full demo with external networking disabled and restart the app after disabling it. Separately test Offline Lock while external connectivity is available. Do not use cached prerecorded responses as evidence of inference. If Office, a test tenant, or another capability is unavailable, mark the relevant acceptance gate blocked/not run rather than claiming it passed.

## 19. Delivery sequence

### Milestone 0 — Inspect and de-risk

Inspect the repository and guest environment. Record constraints. Choose actual pinned dependencies. Prove a native local model can answer a short prompt, that protected storage can reopen, and that a minimal Office file can be generated/validated on the target. Create the decision log and test harness.

Do not spend this milestone researching endlessly; run concrete compatibility spikes and keep the viable path.

### Milestone 1 — Local-file vertical slice

Create project → import synthetic brief/runbook → extract/index → ask a cited question → save note → draft/export a short `.docx` → draft/export a five-slide `.pptx`. Restart offline and repeat a small edit/export. Deliver functioning UI and services, not static screens.

### Milestone 2 — SharePoint preparation

Add real public-client sign-in, explicit scope selection, query review, budgeted discovery, pack proposal, approved downloads, eligibility checks, and readiness. Keep the local connector working. When tenant configuration is unavailable, write precise setup instructions, use clearly labeled fixtures for development, and leave live verification explicitly blocked.

### Milestone 3 — Reliability and offline proof

Add cancellation/resume, snapshot transactions, request gating, credential isolation, storage protections, targeted edit/undo tests, citation validation, resource limits, and independent denied-egress evidence. Fix failures before adding new features.

### Milestone 4 — Refresh, packaging, and demo

Implement manual source refresh and change impact, package a reproducible Windows build, document model and Microsoft setup, finalize evaluation evidence, and run the complete demo.

Only after these milestones may you implement P1 items. Maintain `docs/status.md` after each milestone with what works, what was tested, what is blocked, and the next concrete step.

## 20. Deliverables

Produce:

- Working source code and a runnable Windows build for the architecture actually verified.
- Build/run/test/publish scripts and a dependency/runtime/model manifest.
- The synthetic sample project and reproducible fixture generator where applicable.
- Real document/deck outputs generated by the app, with verification evidence.
- Setup instructions for local models and Microsoft app registration, tenant restrictions, and consent.
- Architecture, permission matrix, document-support matrix, privacy/threat model, offline contract, model evaluation, test status, known limitations, and demo instructions.
- Third-party/model license notices and a list of external assets required for a fully prepared offline installation.

A clean checkout may require approved first-time downloads. Provide an offline deployment-bundle plan that includes legally redistributable dependencies and records any assets that must be supplied separately. Do not claim a zero-download installation unless it was tested from that exact bundle.

Your final implementation report must contain: completed features, commands actually run, passed/failed/blocked tests, runnable artifact locations, credentials/configuration still needed, unverified targets, and remaining limitations. Do not claim to have built an entire application after only writing this specification.

## 21. Start now

After reading the companion files:

1. Inspect the repository and Windows environment.
2. Record a short implementation plan and compatibility decisions.
3. Implement Milestone 0 and the local-file vertical slice immediately.
4. Test real behavior, preserve evidence, and proceed through the milestones.

Do not reply only with “Here is how I would build it.” Create and verify the software using the tools available to you. Where external access blocks a step, deliver all independently achievable work and state the exact remaining authorization/setup requirement.

---

## Appendix A — Primary-source verification notes

Research date: **2026-09-26**. These sources verify selected platform capabilities and constraints; the product defaults, budgets, architecture, and evaluation targets above are proposed engineering decisions. Recheck documentation and compatibility at implementation time. Do not assume this list is a comprehensive or latest-model leaderboard.

[S01] Microsoft — .NET support policy. Confirms .NET 10 LTS support at the research date.  
https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core

[S02] Microsoft — Open XML SDK for Office. Basis for structured Office package operations; does not establish rendering fidelity.  
https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk

[S03] ggml-org — llama.cpp server documentation. Local serving, API authentication, and structured-response capabilities; verify exact pinned flags.  
https://github.com/ggml-org/llama.cpp/tree/master/tools/server

[S04] ggml-org — llama.cpp releases. Includes Windows ARM64 CPU and Windows x64 assets; verify the selected release rather than relying on a moving latest link.  
https://github.com/ggml-org/llama.cpp/releases/

[S05] Microsoft — Add Arm support to your Windows app. Native architecture and dependency considerations.  
https://learn.microsoft.com/en-us/windows/arm/add-arm-support

[S06] Microsoft — Using web browsers with MSAL.NET; token acquisition overview. Desktop sign-in and token-cache behavior must follow the selected supported flow.  
https://learn.microsoft.com/en-us/entra/msal/dotnet/acquiring-tokens/using-web-browsers  
https://learn.microsoft.com/en-us/entra/msal/dotnet/acquiring-tokens/overview

[S07] Microsoft — Search for DriveItems within a drive. Permission table and selected-permission limitation.  
https://learn.microsoft.com/en-us/graph/api/driveitem-search?view=graph-rest-1.0

[S08] Microsoft — Search OneDrive and SharePoint content. Entity selection and KQL path filtering.  
https://learn.microsoft.com/en-us/graph/search-concept-files

[S09] Microsoft — searchEntity: query. Search endpoint and permission requirements; scope selection depends on entity type and actual operations.  
https://learn.microsoft.com/en-us/graph/api/search-query?view=graph-rest-1.0

[S10] Microsoft — Selected permissions overview. Grants, resource scope, and the intersection of delegated app and user permissions.  
https://learn.microsoft.com/en-us/graph/permissions-selected-overview

[S11] Microsoft — Download driveItem content. Preauthenticated redirects and short-lived download URLs.  
https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0

[S12] Mistral AI — Introducing Mistral 3, December 2, 2025. Small-model family and Apache-2.0 release.  
https://mistral.ai/news/mistral-3/

[S13] Mistral AI — Official Ministral 3 3B Instruct 2512 model card. Exact upstream model identity and license.  
https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512

[S14] Microsoft — driveItem: delta. Incremental-change links and deletion handling; does not provide instant offline revocation.  
https://learn.microsoft.com/en-us/graph/api/driveitem-delta?view=graph-rest-1.0
