# CoWorker — the concept

**Product promise:** prepare your project while online; keep working with its knowledge when you are not.

## The problem

Useful company knowledge is often spread across project folders, briefs, slide decks, and runbooks. A consultant needs a small, relevant subset for a specific task. A connection-dependent assistant becomes less useful when that person travels or works in a restricted environment.

## The proposed experience

1. Explain the work: a customer workshop, proposal, handover, or presentation.
2. Select local files and explicitly permitted Microsoft 365 source locations.
3. Review useful supporting sources, reasons, transfer size, freshness, and missing evidence.
4. Approve preparation of a protected local project pack.
5. Work offline: ask grounded questions, inspect citations, take notes, draft and revise documents/slides.
6. Review changes on working copies; explicitly export finished work.
7. Reconnect and request a read-only refresh. Never silently upload or overwrite originals.

All generation in the proposed desktop app stays local. Microsoft authentication, scoped discovery, and approved downloads are online preparation tasks. The product must distinguish physical connectivity from permission to use it.

## Performance profiles

| Profile | Intended tradeoff | Must be measured before release |
| --- | --- | --- |
| Light | Smaller eligible model, shorter context, one job; target modest hardware. | RAM headroom, useful answer quality, latency, supported Windows architecture. |
| Balanced | Practical default for daily project work. | Source retrieval quality, generation speed, resource contention. |
| Performance | Larger tested configuration when resources allow. | Total model + context memory, acceleration availability, thermal behaviour. |

The demo's 2K/4K/8K context and 2/4/8 CPU-thread values are illustrative UI preferences, not measured hardware recommendations. The future app should inspect actual available hardware, benchmark a synthetic workload, and propose tested eligible profiles. It must never advertise a model as installed or ready without evidence.

## Coding-agent extension

The 28 September brief adds a coding assistant. Treat it as a separate, optional capability. Keep the core document assistant's narrow, typed tools intact.

The intended isolation boundary should enforce:

- A disposable workspace, with only explicitly copied project files.
- OS-level isolation and least privilege; no access to the user's home, company folders, credential stores, or host control sockets.
- Resource, process, time, and file-size limits; bounded execution and cancellation.
- Proposed patches reviewed before application; originals remain outside the sandbox.
- Network denied by default; per-task, expiring, destination- and purpose-scoped grants through an enforced egress broker.
- Offline Lock revokes and overrides network grants, including subprocess traffic.
- Dependencies treated as untrusted; no ambient credentials or automatic privileged installation.
- Visible action results and test evidence, with a clear distinction between proposed, attempted, and verified.

The exact supported Windows isolation technology must be selected and tested on x64 and ARM64. A folder, process wrapper, or prompt is not an isolation guarantee. Internet access remains an increased attack surface even with approval. This browser demo implements no sandbox and executes nothing.

## Business hypothesis

Use a small pilot to determine which cloud-assistant tasks can be served locally at acceptable quality and cost. Potential licence savings require seats actually removed, not just tasks shifted. Keep the expected costs of development, distribution, models, support, security review, and hardware visible.

The calculator uses:

`floor(seats × removable percentage / 100) × monthly seat cost × 12 − annual rollout and support`

Its inputs are assumptions. It is not a pricing source, a forecast, or evidence of productivity improvement.

## What the demo can validate

Comprehension of the idea; usability of the source-review journey; whether testers understand Offline Lock, citations, and evidence gaps; whether visible edit review feels useful; whether performance and coding-permission controls are understandable.

It cannot validate model quality, real tenant permissions, inference speed, licence savings, encrypted storage, Windows support, document fidelity, or sandbox security.
